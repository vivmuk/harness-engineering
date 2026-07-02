import { Section } from "@/components/Section";
import { BookOpen, Users, Wrench, Code2, Database, AlertTriangle, FileCode } from "lucide-react";
import { ThemeCard } from "@/components/ThemeCard";

export const metadata = {
  title: "Anatomy of a Harness | Harness Engineering",
  description: "The seven layers that make up every effective agent harness.",
};

const layers = [
  {
    icon: <BookOpen className="h-6 w-6 text-accent" />,
    title: "Orchestration Rules",
    file: "CLAUDE.md / .cursorrules",
    purpose: "Global behavior, defaults, pitfalls, and non-negotiables. The agent reads this first.",
    example: "Always archive existing outputs before overwriting. Never render without user confirmation.",
  },
  {
    icon: <FileCode className="h-6 w-6 text-orange" />,
    title: "Workflow Playbooks",
    file: ".claude/commands/",
    purpose: "One-line commands for recurring pipelines. They turn natural language into structured execution.",
    example: "/produce-episode, /edit-footage, /generate-report",
  },
  {
    icon: <Users className="h-6 w-6 text-blue" />,
    title: "Specialist Agents",
    file: ".claude/agents/",
    purpose: "Narrow roles that handle quality, creativity, or verification.",
    example: "art-director, cut-qa, fact-checker, prompt-engineer",
  },
  {
    icon: <Wrench className="h-6 w-6 text-success" />,
    title: "Reusable Skills",
    file: ".claude/skills/",
    purpose: "Packaged domain knowledge that can be loaded into any session.",
    example: "video-editing, character-consistency, research-briefing",
  },
  {
    icon: <Code2 className="h-6 w-6 text-accent-light" />,
    title: "Execution Layer",
    file: "src/ / scripts/",
    purpose: "Typed code that calls APIs, manipulates files, and enforces the rules.",
    example: "Venice client, model registry, ffmpeg pipelines, EDL renderer",
  },
  {
    icon: <Database className="h-6 w-6 text-warning" />,
    title: "State Schema",
    file: "project.json / series.json",
    purpose: "Stable files that let the agent save, resume, and validate work.",
    example: "Character refs, episode scripts, edit decision lists, provenance sidecars",
  },
  {
    icon: <AlertTriangle className="h-6 w-6 text-red-400" />,
    title: "Anti-Patterns Log",
    file: "CLAUDE.md → Learned Anti-Patterns",
    purpose: "A living record of production failures and fixes. Every new session inherits the lessons.",
    example: "Never cut inside a word. Never use doubled ellipses in TTS scripts.",
  },
];

export default function Anatomy() {
  return (
    <>
      <Section className="pt-24 pb-16" glow>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            The <span className="gradient-text">seven layers</span> of a harness
          </h1>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
            A harness is a stack. Each layer has a clear responsibility, and together they turn improvisation into operations.
          </p>
        </div>
      </Section>

      <Section className="pb-16">
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-orange to-blue hidden md:block" />

          <div className="space-y-8">
            {layers.map((layer, idx) => (
              <div key={layer.title} className="relative md:pl-24">
                <div className="absolute left-0 top-0 hidden md:flex h-16 w-16 items-center justify-center rounded-2xl bg-surface border border-white/10 z-10">
                  {layer.icon}
                </div>
                <div className="rounded-2xl border border-white/5 bg-surface p-6 md:p-8 hover:border-accent/20 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2">
                      {layer.icon}
                    </div>
                    <div>
                      <span className="text-xs font-mono text-accent">Layer {idx + 1}</span>
                      <h2 className="text-xl md:text-2xl font-bold">{layer.title}</h2>
                    </div>
                  </div>
                  <p className="text-sm font-mono text-text-secondary mb-4">{layer.file}</p>
                  <p className="text-text-secondary mb-3">{layer.purpose}</p>
                  <p className="text-sm text-text-secondary/70 border-l-2 border-accent/30 pl-4">
                    Example: {layer.example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="border-y border-white/5 bg-surface/30 pb-32">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ancient layers, modern agents
          </h2>
          <p className="text-text-secondary text-lg">
            Every durable knowledge system separated rules, roles, records, and rituals. A harness is the same idea in software.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <ThemeCard
            image="/images/card-indian.webp"
            badge="Rules & records"
            title="Indian observatories"
            description="Celestial rules, instrument specialists, and manuscript archives — all preserved so the next generation could resume the work."
          />
          <ThemeCard
            image="/images/card-unified.webp"
            badge="Roles & rituals"
            title="Shared architecture"
            description="The same layers appear in every great system: who decides, what is stored, how work is checked, and how lessons survive."
          />
          <ThemeCard
            image="/images/card-egyptian.webp"
            badge="Execution & QA"
            title="Egyptian temple offices"
            description="Scribes, inspectors, and standardized records turned complex state projects into repeatable operations."
          />
        </div>
      </Section>
    </>
  );
}
