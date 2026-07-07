import { parse as parsePartialJson, Allow } from "partial-json";
import {
  veniceChat,
  veniceChatStream,
  parseJsonContent,
  stripCodeFences,
  VeniceChatMessage,
  DEFAULT_TEXT_MODEL,
} from "./venice";

export interface HarnessRecipe {
  domain: string;
  summary: string;
  rules: string;
  playbook: string;
  agents: string;
  skills: string;
  stateSchema: string;
  executionLayer: string;
  antiPatterns: string;
  qhxLoop: string;
  modelSuggestions: string;
  veniceApiUsage: string;
  diagramPrompt: string;
  mermaidDiagram?: string;
  diagramImage?: string;
}

export type RecipeSectionKey = Exclude<keyof HarnessRecipe, "diagramImage">;

const REQUIRED_FIELDS: RecipeSectionKey[] = [
  "domain",
  "summary",
  "rules",
  "playbook",
  "agents",
  "skills",
  "stateSchema",
  "executionLayer",
  "antiPatterns",
  "qhxLoop",
  "modelSuggestions",
  "veniceApiUsage",
  "diagramPrompt",
];

const ALL_STRING_FIELDS: RecipeSectionKey[] = [...REQUIRED_FIELDS, "mermaidDiagram"];

export interface GenerateHarnessOptions {
  apiKey: string;
  useCase: string;
  model?: string;
  signal?: AbortSignal;
  /** Called with the partially-populated recipe as fields stream in. */
  onPartial?: (partial: Partial<HarnessRecipe>) => void;
}

const systemPrompt = `You are a senior harness engineering architect. Your job is to turn a user's use case into a complete, production-ready harness recipe.

A harness is a structured environment that turns an AI agent into a repeatable operator. It is not a prompt. It is a production system with rules, playbooks, specialist agents, reusable skills, typed execution code, persistent state, and an anti-patterns log.

Output strictly valid JSON matching this schema:
{
  "domain": "short domain label",
  "summary": "2-3 sentence summary of what the harness does",
  "rules": "markdown for CLAUDE.md / .cursorrules",
  "playbook": "markdown for .claude/commands/my-command.md",
  "agents": "markdown listing specialist agents in .claude/agents/",
  "skills": "markdown listing reusable skills in .claude/skills/",
  "stateSchema": "markdown describing project.json, state files, provenance sidecars",
  "executionLayer": "markdown describing the typed code layer (src/)",
  "antiPatterns": "markdown listing 6-10 learned anti-patterns to log",
  "qhxLoop": "markdown describing the Quality + Human feedback + eXecution recursive improvement loop",
  "modelSuggestions": "markdown suggesting Venice models or model routing rules",
  "veniceApiUsage": "markdown describing which Venice endpoints to use and how",
  "diagramPrompt": "a detailed prompt for a Venice image model that illustrates this harness as a beautiful, dark-themed, diagrammatic infographic. Cool palette: deep violet, electric blue, soft orange accents. No text labels. Abstract nodes, flowing arrows, layered structure.",
  "mermaidDiagram": "Mermaid flowchart source (flowchart TD) showing this harness's architecture: orchestration rules feeding playbooks, specialist agents, skills, the execution layer, state files, and the QHX feedback loop. Use short node labels, subgraphs for layers, and valid Mermaid syntax only. Do not wrap in code fences."
}

Be specific but concise. Use real file names, command names, and data structures. Keep each section to a few bullet-rich paragraphs so the entire JSON fits within the output token limit. Do not wrap the JSON in markdown code fences. Output raw JSON only.`;

export class RecipeParseError extends Error {}

function validateRecipe(value: unknown): HarnessRecipe {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new RecipeParseError("The model response was not a JSON object.");
  }
  const record = value as Record<string, unknown>;
  const missing = REQUIRED_FIELDS.filter(
    (field) => typeof record[field] !== "string" || !(record[field] as string).trim()
  );
  if (missing.length > 0) {
    throw new RecipeParseError(`The model response was missing sections: ${missing.join(", ")}.`);
  }
  const recipe: Partial<HarnessRecipe> = {};
  for (const field of ALL_STRING_FIELDS) {
    if (typeof record[field] === "string" && (record[field] as string).trim()) {
      recipe[field] = record[field] as string;
    }
  }
  return recipe as HarnessRecipe;
}

/** Best-effort extraction of recipe fields from an incomplete JSON buffer. */
export function extractPartialRecipe(buffer: string): Partial<HarnessRecipe> | null {
  const cleaned = stripCodeFences(buffer);
  const start = cleaned.indexOf("{");
  if (start === -1) return null;
  let parsed: unknown;
  try {
    parsed = parsePartialJson(cleaned.slice(start), Allow.ALL);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const record = parsed as Record<string, unknown>;
  const partial: Partial<HarnessRecipe> = {};
  for (const field of ALL_STRING_FIELDS) {
    if (typeof record[field] === "string" && (record[field] as string).trim()) {
      partial[field] = record[field] as string;
    }
  }
  return Object.keys(partial).length > 0 ? partial : null;
}

export async function generateHarnessRecipe(options: GenerateHarnessOptions): Promise<HarnessRecipe> {
  const { apiKey, useCase, model = DEFAULT_TEXT_MODEL, signal, onPartial } = options;

  const messages: VeniceChatMessage[] = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Design a complete harness recipe for the following use case. Be thorough and practical.\n\nUse case: ${useCase}`,
    },
  ];

  const attempt = async (): Promise<HarnessRecipe> => {
    const content = await veniceChatStream(
      {
        apiKey,
        model,
        messages,
        temperature: 0.7,
        max_tokens: 12000,
        response_format: { type: "json_object" },
        signal,
      },
      onPartial
        ? (accumulated) => {
            const partial = extractPartialRecipe(accumulated);
            if (partial) onPartial(partial);
          }
        : undefined
    );
    return validateRecipe(parseJsonContent<unknown>(content));
  };

  try {
    return await attempt();
  } catch (err) {
    // Retry once when the model produced unusable output; never retry
    // aborts or transport/auth failures.
    if (signal?.aborted || !isRetryableParseError(err)) throw err;
    return attempt();
  }
}

function isRetryableParseError(err: unknown): boolean {
  return (
    err instanceof RecipeParseError ||
    (err instanceof Error && err.message.includes("not valid JSON"))
  );
}

export interface RefineSectionOptions {
  apiKey: string;
  model?: string;
  recipe: HarnessRecipe;
  sectionKey: RecipeSectionKey;
  instruction: string;
  signal?: AbortSignal;
}

/** Regenerate a single recipe section per the user's instruction, keeping the rest intact. */
export async function refineSection(options: RefineSectionOptions): Promise<string> {
  const { apiKey, model = DEFAULT_TEXT_MODEL, recipe, sectionKey, instruction, signal } = options;

  const context: Partial<HarnessRecipe> = { ...recipe };
  delete context.diagramImage;

  const messages: VeniceChatMessage[] = [
    {
      role: "system",
      content: `You are a senior harness engineering architect refining one section of an existing harness recipe. You will receive the full recipe as context, the name of the section to rewrite, and an instruction. Rewrite ONLY that section, staying consistent with the rest of the recipe. Output strictly valid JSON with a single key: {"${sectionKey}": "the rewritten section content"}. Do not wrap the JSON in markdown code fences.`,
    },
    {
      role: "user",
      content: `Full recipe (context):\n${JSON.stringify(context, null, 2)}\n\nSection to rewrite: "${sectionKey}"\n\nInstruction: ${instruction}`,
    },
  ];

  const result = await veniceChat<Record<string, unknown>>({
    apiKey,
    model,
    messages,
    temperature: 0.7,
    max_tokens: 6000,
    response_format: { type: "json_object" },
    signal,
  });

  const value = result?.[sectionKey];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("The model did not return the refined section. Try rephrasing the instruction.");
  }
  return value;
}
