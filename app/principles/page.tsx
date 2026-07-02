import { Section } from "@/components/Section";
import { Lightbulb, FileSearch, RefreshCw, Layers, Eye, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Principles | Harness Engineering",
  description: "Core design principles for building durable agent harnesses.",
};

const principles = [
  {
    icon: <Lightbulb className="h-6 w-6 text-accent" />,
    title: "Agent interface first",
    description: "Design from the user's first message backward. Decide what they will say, what the agent should do without asking, and where it must stop and confirm. Encode those decisions in rules and playbooks.",
  },
  {
    icon: <Layers className="h-6 w-6 text-orange" />,
    title: "Stable state schema",
    description: "A harness is reusable because it saves and resumes work. Define project config, ground truth, intermediate artifacts, and final outputs with clear schemas and owners.",
  },
  {
    icon: <FileSearch className="h-6 w-6 text-blue" />,
    title: "Text-first substrates",
    description: "Video, audio, and large corpora are too big to dump into context. Convert them into compact structured text the LLM can reason over, then reach for raw media only at explicit decision points.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-success" />,
    title: "Confirm-and-eval loops",
    description: "Every render, publish, or finalize must: propose a plan, wait for explicit confirmation, execute, run automated QA, and allow a bounded number of fix iterations.",
  },
  {
    icon: <RefreshCw className="h-6 w-6 text-warning" />,
    title: "QHX recursive self-improvement",
    description: "Quality + Human feedback + eXecution. After every run, log what broke, why it broke, and how you fixed it. The next session starts smarter than the last.",
  },
  {
    icon: <Eye className="h-6 w-6 text-accent-light" />,
    title: "Model-aware wrappers",
    description: "Never let the agent guess parameters. Build a registry that knows supported fields, duration/resolution constraints, cost estimates, and deprecation warnings.",
  },
];

export default function Principles() {
  return (
    <>
      <Section className="pt-24 pb-16" glow>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Principles that make harnesses{" "}
            <span className="gradient-text">last</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
            These are the design habits that separate a harness that works once from a harness that gets better every time you use it.
          </p>
        </div>
      </Section>

      <Section className="pb-32">
        <div className="grid md:grid-cols-2 gap-6">
          {principles.map((p) => (
            <div key={p.title} className="rounded-2xl border border-white/5 bg-surface p-6 hover:border-accent/20 transition-colors">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                {p.icon}
              </div>
              <h2 className="text-xl font-bold mb-3">{p.title}</h2>
              <p className="text-text-secondary leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
