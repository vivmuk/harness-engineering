import JSZip from "jszip";
import { HarnessRecipe } from "./harness-generator";

export function buildHarnessBundle(recipe: HarnessRecipe): JSZip {
  const zip = new JSZip();

  zip.folder(".claude")?.folder("commands")?.file(`${recipe.domain.toLowerCase().replace(/\s+/g, "-")}.md`, recipe.playbook);
  zip.folder(".claude")?.folder("agents")?.file("README.md", recipe.agents);
  zip.folder(".claude")?.folder("skills")?.folder(recipe.domain.toLowerCase().replace(/\s+/g, "-"))?.file("SKILL.md", recipe.skills);
  zip.file("CLAUDE.md", recipe.rules);
  zip.file("README.md", generateReadme(recipe));
  zip.file("project-state-schema.md", recipe.stateSchema);
  zip.file("execution-layer.md", recipe.executionLayer);
  zip.file("anti-patterns.md", recipe.antiPatterns);
  zip.file("qhx-loop.md", recipe.qhxLoop);
  zip.file("venice-api-usage.md", recipe.veniceApiUsage);
  zip.file("model-routing.md", recipe.modelSuggestions);

  if (recipe.mermaidDiagram) {
    zip.file("diagram.mmd", recipe.mermaidDiagram);
  }

  if (recipe.diagramImage) {
    const b64 = recipe.diagramImage.replace(/^data:image\/png;base64,/, "");
    zip.file("harness-diagram.png", b64, { base64: true });
  }

  return zip;
}

function generateReadme(recipe: HarnessRecipe): string {
  const kebab = recipe.domain.toLowerCase().replace(/\s+/g, "-");
  return `# ${recipe.domain} Harness

${recipe.summary}

## Quick start

1. Open this folder in Cursor, Claude Code, or any agentic IDE.
2. The agent will read \`CLAUDE.md\` first for global rules.
3. Run the playbook command: \`/${kebab}\`
4. Follow the confirm-and-execute loop.

## Files included

- \`CLAUDE.md\` ;  orchestration rules
- \`.claude/commands/${kebab}.md\` ;  workflow playbook
- \`.claude/agents/README.md\` ;  specialist agents
- \`.claude/skills/${kebab}/SKILL.md\` ;  reusable skill
- \`project-state-schema.md\` ;  state schema
- \`execution-layer.md\` ;  execution layer guide
- \`anti-patterns.md\` ;  anti-patterns log
- \`qhx-loop.md\` ;  recursive improvement loop
- \`venice-api-usage.md\` ;  Venice API integration notes
- \`model-routing.md\` ;  model suggestions
${recipe.mermaidDiagram ? "- `diagram.mmd` ;  architecture diagram (Mermaid source)\n" : ""}

## Anti-patterns to watch

See \`anti-patterns.md\`.

## Improving the harness

After every production run, update \`anti-patterns.md\` and \`CLAUDE.md\` with what you learned. The next session starts smarter.
`;
}

export async function downloadBundle(recipe: HarnessRecipe, filename?: string): Promise<void> {
  const zip = buildHarnessBundle(recipe);
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `${recipe.domain.toLowerCase().replace(/\s+/g, "-")}-harness.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
