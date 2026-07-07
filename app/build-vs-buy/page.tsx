import { Section } from "@/components/Section";
import { BuildVsBuyClient } from "./BuildVsBuyClient";

export const metadata = {
  title: "Build vs Buy | Harness Engineering",
  description: "When to use a ChatGPT or Claude harness, and when to build your own.",
};

export default function BuildVsBuy() {
  return (
    <>
      <Section className="pt-24 pb-16" glow>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Build vs. <span className="italic-accent">Buy</span>
          </h1>
          <p className="text-lg md:text-xl text-ink-2 leading-relaxed">
            Platform harnesses are a great start. Custom harnesses are where leverage lives. Here is how to decide.
          </p>
        </div>
      </Section>

      <Section className="border-y border-rule bg-paper-2">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-rule bg-paper p-8">
            <h2 className="text-2xl font-bold mb-4 text-ink-2">Platform Harness</h2>
            <ul className="space-y-3 text-ink-2">
              <li>✓ Fast to set up</li>
              <li>✓ No infrastructure</li>
              <li>✓ Good for prototypes</li>
              <li>✗ Limited control</li>
              <li>✗ No persistent state</li>
              <li>✗ Costs scale per run</li>
            </ul>
            <p className="mt-6 text-sm text-ink-2/70">
              Best for: personal assistants, quick experiments, one-off complex tasks.
            </p>
          </div>

          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8">
            <h2 className="text-2xl font-bold mb-4">Custom Harness</h2>
            <ul className="space-y-3 text-ink-2">
              <li>✓ Full control</li>
              <li>✓ Persistent state</li>
              <li>✓ Reusable across team</li>
              <li>✓ Cheaper at scale</li>
              <li>✓ Self-improving</li>
              <li>✗ Requires upfront design</li>
            </ul>
            <p className="mt-6 text-sm text-ink-2/70">
              Best for: recurring workflows, production content, multi-user systems, complex domains.
            </p>
          </div>
        </div>
      </Section>

      <BuildVsBuyClient />
    </>
  );
}
