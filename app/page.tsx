import Link from "next/link";
import { ArrowRight, Sparkles, Layers, ShieldCheck, Repeat } from "lucide-react";
import { Section } from "@/components/Section";
import { ThemeCard } from "@/components/ThemeCard";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-rule bg-paper-2 px-6 py-16 md:py-24">
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-md border border-accent/30 bg-paper px-4 py-1.5 text-sm font-medium text-accent">
              <Sparkles className="h-4 w-4" />
              Design agent harnesses for any domain
            </span>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance mt-8 mb-8">
              Turn your ideas into{" "}
              <span className="italic-accent">reusable AI systems</span>
            </h1>

            <p className="text-lg md:text-xl text-ink-2 max-w-2xl mx-auto mb-10 leading-relaxed">
              A harness is not a prompt. It is a structured environment that turns an AI agent into a reliable operator for any workflow — video, research, publications, recipe books, fitness, trading, and beyond.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/generator/"
                className="group inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-paper font-semibold hover:bg-accent-light transition-colors"
              >
                Generate a Harness Recipe
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/what-is-a-harness/"
                className="inline-flex items-center gap-2 rounded-xl border border-rule bg-paper px-6 py-3.5 text-ink font-medium hover:border-accent hover:text-accent transition-colors"
              >
                Learn what a harness is
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Trust strip */}
      <Section className="py-12 border-y border-rule bg-paper-2">
        <div className="text-center">
          <p className="text-sm text-ink-2 uppercase tracking-wider mb-6 font-mono">Built on ideas from</p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-ink-2">
            <span>Venice Video Harness</span>
            <span>browser-use/video-use</span>
            <span>Typed Natural Language</span>
            <span>MarkdownLM</span>
            <span>CtxVault</span>
          </div>
        </div>
      </Section>

      {/* Feature grid */}
      <Section>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why build a harness?</h2>
          <p className="text-ink-2 text-lg">
            Platform harnesses are a great start. A custom harness is where the real leverage lives.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Layers className="h-6 w-6 text-accent" />}
            title="Universal"
            description="The same harness pattern works for any domain — recipe books, research reports, video series, trading strategies, or language learning apps."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-6 w-6 text-magenta" />}
            title="Cost-controlled"
            description="Model-as-harness gets expensive fast. A custom harness amortizes design cost across hundreds of runs and keeps you off the pay-per-call treadmill."
          />
          <FeatureCard
            icon={<Repeat className="h-6 w-6 text-cobalt" />}
            title="Self-improving"
            description="Every production run surfaces new anti-patterns. Log them once, and every future session follows the improved rules automatically."
          />
        </div>
      </Section>

      {/* Cultural harness theme section */}
      <Section className="border-y border-rule bg-paper-2">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Harnesses are <span className="italic-accent">older than AI</span>
          </h2>
          <p className="text-ink-2 text-lg">
            From Indian observatories to Egyptian archives, every great civilization built systems to preserve and reuse knowledge. Harness Engineering applies the same idea to AI agents.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <ThemeCard
            image="/images/card-indian.webp"
            badge="Indian"
            title="Observatories of order"
            description="Celestial maps, layered manuscripts, and repeating patterns — a knowledge system designed to be preserved, passed down, and reused."
          />
          <ThemeCard
            image="/images/card-unified.webp"
            badge="Unified"
            title="One shared architecture"
            description="When two ancient systems meet, the same underlying pattern appears: rules, storage, specialist roles, and continuous improvement."
          />
          <ThemeCard
            image="/images/card-egyptian.webp"
            badge="Egyptian"
            title="Temples of record"
            description="Hieroglyphic panels, papyrus scrolls, and structured archives — a durable environment for keeping complex work consistent."
          />
        </div>
      </Section>

      {/* CTA */}
      <Section className="pb-32">
        <div className="relative overflow-hidden rounded-3xl border border-accent bg-paper-2 p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to engineer your harness?</h2>
          <p className="text-ink-2 text-lg max-w-xl mx-auto mb-8">
            Describe what you want to build. The generator will think through every layer and produce a complete starter kit.
          </p>
          <Link
            href="/generator/"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-paper font-semibold hover:bg-accent-light transition-colors"
          >
            Start the Generator
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group rounded-2xl border border-rule bg-paper p-6 hover:border-accent/40 hover:bg-paper-2 transition-colors">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-ink">{title}</h3>
      <p className="text-ink-2 leading-relaxed">{description}</p>
    </div>
  );
}
