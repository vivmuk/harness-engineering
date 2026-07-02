import { veniceChat, VeniceChatMessage } from "./venice";

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
  diagramImage?: string;
}

export interface GenerateHarnessOptions {
  apiKey: string;
  useCase: string;
  model?: string;
  includeDiagram?: boolean;
  diagramModel?: string;
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
  "diagramPrompt": "a detailed prompt for a Venice image model that illustrates this harness as a beautiful, dark-themed, diagrammatic infographic. Cool palette: deep violet, electric blue, soft orange accents. No text labels. Abstract nodes, flowing arrows, layered structure."
}

Be specific. Use real file names, command names, and data structures. The recipe should feel like a starter kit the user can implement today.
`;

export async function generateHarnessRecipe(options: GenerateHarnessOptions): Promise<HarnessRecipe> {
  const { apiKey, useCase, model = "claude-sonnet-4-6" } = options;

  const messages: VeniceChatMessage[] = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Design a complete harness recipe for the following use case. Be thorough and practical.\n\nUse case: ${useCase}`,
    },
  ];

  const recipe = await veniceChat<HarnessRecipe>({
    apiKey,
    model,
    messages,
    temperature: 0.7,
    max_tokens: 6000,
    response_format: { type: "json_object" },
  });

  return recipe;
}
