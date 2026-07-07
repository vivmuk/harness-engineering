import Link from "next/link";
import { ArrowRight, Sparkles, Layers, ShieldCheck, Repeat, GitBranch, BookOpen } from "lucide-react";
import { Section } from "@/components/Section";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export default function Home() {
  return (
    <>
      {/* ───────────────────── HERO ─────────────────────
       * Asymmetric bento layout: text-led on the left,
       * a real "code preview" card on the right. Avoids
       * the centered-text-on-cream-reflex hero shape
       * that reads as 1990s monograph. */}
      <Section className="pt-24 pb-16 md:pt-24 md:pb-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <RevealOnScroll className="lg:col-span-7 xl:col-span-7">
            <p className="mono-caps mb-8">Harness Engineering · v2</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.035em] text-balance leading-[1.05] mb-8">
              Build an AI agent that{" "}
              <span className="italic-accent">actually works</span>.
            </h1>
            <p className="text-lg md:text-xl text-ink-2 max-w-xl leading-relaxed mb-10">
              Harness Engineering is a generator for domain-specific agent systems.
              Describe the work. The generator produces rules, roles, state schemas,
              anti-patterns, and the executable scaffold, with built-in quality gates.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/generator/"
                className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-paper font-semibold hover:bg-accent-dark transition-colors"
              >
                Open the generator
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/what-is-a-harness/"
                className="group inline-flex items-center gap-2 rounded-lg px-5 py-3 text-ink font-medium border border-rule hover:border-accent hover:text-accent transition-colors"
              >
                Read the doctrine
                <BookOpen className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </RevealOnScroll>

          {/* Side: real code preview card. NO fake div-as-screenshot. */}
          <RevealOnScroll delayMs={140} className="lg:col-span-5 xl:col-span-5">
            <div className="rounded-xl border border-rule bg-paper-2 overflow-hidden hover-raise">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-rule">
                <div className="flex items-center gap-2 mono-caps text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  live session
                </div>
                <span className="mono-caps text-[10px] opacity-60">v0.4.2</span>
              </div>
              <pre className="font-mono text-[12px] leading-relaxed p-4 m-0 bg-transparent overflow-x-auto text-ink-2">
                <code>
                  <span className="text-ink-3">// harness.yml</span>{"\n"}
                  <span className="text-accent">domain</span>: research.briefing{"\n"}
                  <span className="text-accent">rules</span>:{"\n"}
                  {"  "}- Cite every claim with source URL{"\n"}
                  {"  "}- Reject single-source conclusions{"\n"}
                  {"  "}- Verify ≥2 independent sources{"\n"}
                  <span className="text-accent">agents</span>:{"\n"}
                  {"  "}- researcher, fact-checker, editor{"\n"}
                  <span className="text-accent">state</span>: claim-graph.json{"\n"}
                  <span className="text-accent">gates</span>: source-balance ≥ 2.0{"\n"}
                  {"\n"}
                  <span className="text-ink-3">// model: claude-fable-5</span>
                </code>
              </pre>
            </div>
            <p className="text-xs text-ink-2/80 mt-3 font-mono leading-relaxed">
              The generator emits a starter file bundle: <code>CLAUDE.md</code>,
              agents, skills, playbooks, state schema, anti-patterns.
            </p>
          </RevealOnScroll>
        </div>
      </Section>

      {/* ───────────────────── BENTO (4-cell, asymmetric) ─────────────────────
       * Layout family 1 of 4. One big cell + three satellites.
       * ENSURES no two consecutive sections share a layout family. */}
      <Section className="py-20 md:py-28 border-t border-rule">
        <RevealOnScroll className="mb-12 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.025em] text-balance mb-4">
            Four properties of a working harness.
          </h2>
          <p className="text-ink-2 text-lg leading-relaxed">
            The generator treats these as load-bearing. Drop one and the system
            degrades within a few production runs.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(0,auto)]">
          {/* Big cell: Universal */}
          <RevealOnScroll className="md:col-span-2 md:row-span-2 rounded-xl border border-rule bg-paper p-8 hover-raise hover:border-accent/40 transition-colors">
            <div className="h-full flex flex-col">
              <Layers className="h-7 w-7 text-accent mb-6" />
              <h3 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] mb-3">
                Universal
              </h3>
              <p className="text-ink-2 leading-relaxed text-base md:text-lg max-w-md">
                The same harness shape works for any domain. Recipe books, research
                reports, video series, trading strategies, language tutors. The
                generator binds the shape to your domain's vocabulary.
              </p>
              <div className="mt-auto pt-6 flex flex-wrap gap-2">
                <span className="mono-caps text-[10px] opacity-60">domain.agnostic</span>
                <span className="mono-caps text-[10px] opacity-60">schema.first</span>
                <span className="mono-caps text-[10px] opacity-60">no.magic</span>
              </div>
            </div>
          </RevealOnScroll>

          {/* Small cell: Cost-controlled */}
          <RevealOnScroll delayMs={80} className="rounded-xl border border-rule bg-paper-2 p-6 hover-raise hover:border-accent/40 transition-colors">
            <ShieldCheck className="h-6 w-6 text-magenta mb-4" />
            <h3 className="text-lg font-semibold tracking-[-0.02em] mb-2">
              Cost-controlled
            </h3>
            <p className="text-ink-2 text-sm leading-relaxed">
              Per-call harnesses scale linearly. A real harness amortizes design cost
              across hundreds of runs and caps spend per task.
            </p>
          </RevealOnScroll>

          {/* Small cell: Self-improving */}
          <RevealOnScroll delayMs={160} className="rounded-xl border border-rule bg-paper-2 p-6 hover-raise hover:border-accent/40 transition-colors">
            <Repeat className="h-6 w-6 text-cobalt mb-4" />
            <h3 className="text-lg font-semibold tracking-[-0.02em] mb-2">
              Self-improving
            </h3>
            <p className="text-ink-2 text-sm leading-relaxed">
              Production runs surface anti-patterns. Log them in <code>STATE.md</code>
              {" "}once. Future runs inherit the rule.
            </p>
          </RevealOnScroll>

          {/* Small cell at wide: Citable + exactly N items */}
          <RevealOnScroll delayMs={240} className="rounded-xl border border-rule bg-paper-2 p-6 hover-raise hover:border-accent/40 transition-colors">
            <Sparkles className="h-6 w-6 text-acid mb-4" />
            <h3 className="text-lg font-semibold tracking-[-0.02em] mb-2">
              Inspectable
            </h3>
            <p className="text-ink-2 text-sm leading-relaxed">
              Every rule, agent, and state file is plain markdown. Humans read the
              harness as fast as the model does.
            </p>
          </RevealOnScroll>
        </div>
      </Section>

      {/* ───────────────────── ZIGZAG (image + text split) ─────────────────────
       * Layout family 2 of 4. Two image-text splits in alternation pattern.
       * Real images from the public/ assets, framed with a 1px rule. */}
      <Section className="py-20 md:py-28 border-t border-rule bg-paper-2">
        <RevealOnScroll className="mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.025em] text-balance mb-4">
            Harnesses are a human pattern, older than AI.
          </h2>
          <p className="text-ink-2 text-lg leading-relaxed">
            Indian observatories, Egyptian record-keepers, monastic scriptoria.
            Every durable knowledge system solved the same problem we solve today.
          </p>
        </RevealOnScroll>

        <div className="space-y-16 md:space-y-24">
          <RevealOnScroll>
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-rule">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/card-indian.webp"
                    alt="Indian observatory, layered manuscripts and recurring patterns"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="md:col-span-6 md:pl-8">
                <p className="mono-caps mb-4">obs · india · 1700 BCE</p>
                <h3 className="text-2xl font-semibold tracking-[-0.02em] mb-3">
                  Observatories of order
                </h3>
                <p className="text-ink-2 leading-relaxed text-base">
                  Jantar Mantar compiled 4,770 stars into a single instrument.
                  Layered manuscripts taught readers how to reuse prior observations.
                  A knowledge system designed to be preserved, passed down, and inherited.
                </p>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 md:order-2">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-rule">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/card-egyptian.webp"
                    alt="Egyptian archive: glyphic panels, papyrus scrolls, structured storage"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="md:col-span-6 md:order-1 md:pr-8">
                <p className="mono-caps mb-4">archive · egypt · 300 BCE</p>
                <h3 className="text-2xl font-semibold tracking-[-0.02em] mb-3">
                  Temples of record
                </h3>
                <p className="text-ink-2 leading-relaxed text-base">
                  The Library of Alexandria organized knowledge by domain before
                  there were domains. Hieroglyphic panels, papyrus scrolls, and
                  structured archives, a durable environment for keeping complex
                  work consistent across generations.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </Section>

      {/* ───────────────────── STRIP / DIAGRAM BANNER ─────────────────────
       * Layout family 3 of 4. Single-row asset showcase. */}
      <Section className="py-20 md:py-28 border-t border-rule">
        <RevealOnScroll>
          <p className="mono-caps mb-8">system diagram</p>
          <div className="rounded-xl border border-rule bg-paper-2 p-6 md:p-10">
            <div className="mx-auto" style={{ maxWidth: 880 }}>
              <img
                src="/harness-diagram.svg"
                alt="Anatomy of a Harness: rules, agents, state, playbooks, and the QHX quality loop"
                className="w-full h-auto"
              />
            </div>
            <p className="mt-6 text-sm text-ink-2 leading-relaxed max-w-2xl mx-auto text-center">
              The QHX loop: every production run writes one delta to the anti-pattern
              list. The next run inherits the rule. Self-improving by construction,
              not by prompt magic.
            </p>
          </div>
        </RevealOnScroll>
      </Section>

      {/* ───────────────────── PULL-QUOTE CTA ─────────────────────
       * Layout family 4 of 4. Statement-led, not boxy. */}
      <Section className="py-24 md:py-32 border-t border-rule bg-paper-2">
        <RevealOnScroll className="max-w-3xl mx-auto text-center">
          <p className="mono-caps mb-8">ready when you are</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.035em] text-balance leading-[1.05] mb-10">
            Describe what you want to build.{" "}
            <span className="italic-accent">The generator handles the rest.</span>
          </h2>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              href="/generator/"
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-paper font-semibold hover:bg-accent-dark transition-colors"
            >
              Open the generator
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/principles/"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-ink font-medium border border-rule hover:border-accent hover:text-accent transition-colors"
            >
              Read the principles
            </Link>
          </div>
          <p className="mt-10 text-sm text-ink-3 font-mono">
            Built on Venice AI · Powered by <code className="text-accent">claude-fable-5</code>
          </p>
        </RevealOnScroll>
      </Section>
    </>
  );
}
