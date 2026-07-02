import { Section } from "@/components/Section";
import { ArrowRight, Bot, FileText, Settings, Shield } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "What is a Harness? | Harness Engineering",
  description: "A harness is a structured environment that turns an AI agent into a reliable operator for a reusable workflow.",
};

export default function WhatIsAHarness() {
  return (
    <>
      <Section className="pt-24 pb-16" glow>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            A harness is not a <span className="text-text-secondary">prompt</span>.<br />
            It is a <span className="gradient-text">production system</span>.
          </h1>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
            Most people treat AI like a chatbot: ask once, get an answer, start over next time. A harness treats AI like an operator inside a reusable environment.
          </p>
        </div>
      </Section>

      <Section className="border-y border-white/5 bg-surface/50">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Without a harness</h2>
            <ul className="space-y-4 text-text-secondary">
              <li className="flex gap-3"><span className="text-warning">✗</span> Every session starts from zero context.</li>
              <li className="flex gap-3"><span className="text-warning">✗</span> The agent re-derives the same decisions.</li>
              <li className="flex gap-3"><span className="text-warning">✗</span> Mistakes repeat because lessons are not logged.</li>
              <li className="flex gap-3"><span className="text-warning">✗</span> Costs scale linearly with every request.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">With a harness</h2>
            <ul className="space-y-4 text-text-secondary">
              <li className="flex gap-3"><span className="text-success">✓</span> State, rules, and memory persist across sessions.</li>
              <li className="flex gap-3"><span className="text-success">✓</span> The agent follows proven playbooks.</li>
              <li className="flex gap-3"><span className="text-success">✓</span> Anti-patterns are logged and avoided.</li>
              <li className="flex gap-3"><span className="text-success">✓</span> Work gets cheaper and faster over time.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What a harness gives you</h2>
          <p className="text-text-secondary text-lg">
            Four capabilities that separate a toy from a tool.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <BenefitCard
            icon={<Bot className="h-6 w-6 text-accent" />}
            title="Consistency"
            description="The same inputs produce the same quality outputs, because the agent follows encoded rules instead of improvising every time."
          />
          <BenefitCard
            icon={<FileText className="h-6 w-6 text-orange" />}
            title="Resumability"
            description="State files let you stop and resume work. The agent picks up exactly where you left off, even days later."
          />
          <BenefitCard
            icon={<Shield className="h-6 w-6 text-blue" />}
            title="Quality gates"
            description="Automated checks catch errors before they compound. Every render, publish, or finalize runs through a confirm-and-eval loop."
          />
          <BenefitCard
            icon={<Settings className="h-6 w-6 text-success" />}
            title="Cost control"
            description="Model-as-harness is pay-per-call. A custom harness amortizes design cost across many runs and avoids expensive re-derivation."
          />
        </div>
      </Section>

      <Section className="pb-32">
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to see the full architecture?</h2>
          <p className="text-text-secondary mb-8 max-w-xl mx-auto">
            A harness is built from seven layers: rules, playbooks, agents, skills, execution, state, and anti-patterns.
          </p>
          <Link
            href="/anatomy/"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-white font-semibold hover:bg-accent-light transition-colors"
          >
            Explore the Anatomy
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-surface p-6">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
