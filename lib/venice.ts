export const DEFAULT_TEXT_MODEL = "claude-fable-5";
export const DEFAULT_IMAGE_MODEL = "gpt-image-2";

const VENICE_API_BASE = "https://api.venice.ai/api/v1";

export interface VeniceChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface VeniceChatOptions {
  apiKey: string;
  model?: string;
  messages: VeniceChatMessage[];
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: "json_object" | "json_schema"; schema?: unknown };
  signal?: AbortSignal;
}

export function stripCodeFences(content: string): string {
  return content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export function parseJsonContent<T>(content: string): T {
  const cleaned = stripCodeFences(content);
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error("The model returned a response that is not valid JSON. Try generating again.");
  }
}

export async function veniceChat<T = string>(options: VeniceChatOptions): Promise<T> {
  const { apiKey, model = DEFAULT_TEXT_MODEL, messages, temperature = 0.7, max_tokens = 4000, response_format, signal } = options;

  const response = await fetch(`${VENICE_API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
      ...(response_format ? { response_format } : {}),
    }),
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "Unknown error");
    throw new Error(`Venice API error ${response.status}: ${text}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };

  if (data.error) {
    throw new Error(data.error.message || "Venice API returned an error");
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("No content returned from Venice API");
  }

  if (response_format?.type === "json_object") {
    return parseJsonContent<T>(content);
  }

  return content as unknown as T;
}

/**
 * Streaming variant of veniceChat. Reads the SSE response and invokes
 * `onChunk` with the full accumulated content after each delta.
 * Returns the complete raw content string (not JSON-parsed).
 */
export async function veniceChatStream(
  options: VeniceChatOptions,
  onChunk?: (accumulated: string) => void
): Promise<string> {
  const { apiKey, model = DEFAULT_TEXT_MODEL, messages, temperature = 0.7, max_tokens = 4000, response_format, signal } = options;

  const response = await fetch(`${VENICE_API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
      stream: true,
      ...(response_format ? { response_format } : {}),
    }),
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "Unknown error");
    throw new Error(`Venice API error ${response.status}: ${text}`);
  }

  if (!response.body) {
    throw new Error("Venice API returned no response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const delta = parseSseLine(line);
        if (delta) {
          content += delta;
          onChunk?.(content);
        }
      }
    }
    const finalDelta = parseSseLine(buffer);
    if (finalDelta) {
      content += finalDelta;
      onChunk?.(content);
    }
  } finally {
    reader.releaseLock();
  }

  if (!content) {
    throw new Error("No content returned from Venice API");
  }

  return content;
}

function parseSseLine(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith("data:")) return null;
  const payload = trimmed.slice(5).trim();
  if (!payload || payload === "[DONE]") return null;
  try {
    const parsed = JSON.parse(payload) as {
      choices?: Array<{ delta?: { content?: string } }>;
      error?: { message?: string };
    };
    if (parsed.error?.message) {
      throw new Error(parsed.error.message);
    }
    const delta = parsed.choices?.[0]?.delta?.content;
    return typeof delta === "string" && delta.length > 0 ? delta : null;
  } catch (err) {
    if (err instanceof SyntaxError) return null;
    throw err;
  }
}

export interface VeniceModel {
  id: string;
  type?: string;
}

export async function veniceListModels(apiKey: string, signal?: AbortSignal): Promise<VeniceModel[]> {
  const response = await fetch(`${VENICE_API_BASE}/models`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "Unknown error");
    throw new Error(`Venice models API error ${response.status}: ${text}`);
  }

  const data = (await response.json()) as { data?: Array<{ id?: string; type?: string }> };
  return (data.data ?? [])
    .filter((m): m is { id: string; type?: string } => typeof m.id === "string" && m.id.length > 0)
    .map((m) => ({ id: m.id, type: m.type }));
}

export interface VeniceImageOptions {
  apiKey: string;
  model?: string;
  prompt: string;
  width?: number;
  height?: number;
  aspect_ratio?: string;
  resolution?: string;
  negative_prompt?: string;
}

export async function veniceImage(options: VeniceImageOptions): Promise<string> {
  const {
    apiKey,
    model = DEFAULT_IMAGE_MODEL,
    prompt,
    width,
    height,
    aspect_ratio,
    resolution,
    negative_prompt,
  } = options;

  const body: Record<string, unknown> = {
    model,
    prompt,
    format: "png",
  };

  if (aspect_ratio) {
    body.aspect_ratio = aspect_ratio;
  }
  if (resolution) {
    body.resolution = resolution;
  }
  if (width && height) {
    body.width = width;
    body.height = height;
  }
  if (negative_prompt) {
    body.negative_prompt = negative_prompt;
  }

  const response = await fetch(`${VENICE_API_BASE}/image/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "Unknown error");
    throw new Error(`Venice image API error ${response.status}: ${text}`);
  }

  const data = (await response.json()) as { images?: string[]; error?: { message?: string } };

  if (data.error) {
    throw new Error(data.error.message || "Venice image API returned an error");
  }

  const b64 = data.images?.[0];
  if (!b64) {
    throw new Error("No image returned from Venice API");
  }

  return `data:image/png;base64,${b64}`;
}
