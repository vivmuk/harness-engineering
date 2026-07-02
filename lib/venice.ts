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
}

export async function veniceChat<T = string>(options: VeniceChatOptions): Promise<T> {
  const { apiKey, model = "claude-sonnet-4-6", messages, temperature = 0.7, max_tokens = 4000, response_format } = options;

  const response = await fetch("https://api.venice.ai/api/v1/chat/completions", {
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
    const cleaned = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    return JSON.parse(cleaned) as T;
  }

  return content as unknown as T;
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
    model = "gpt-image-2",
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

  const response = await fetch("https://api.venice.ai/api/v1/image/generate", {
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
