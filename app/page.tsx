import Link from "next/link";
import { ArrowRight, Sparkles, Layers, ShieldCheck, Repeat } from "lucide-react";
import { Section } from "@/components/Section";
import { ThemeCard } from "@/components/ThemeCard";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-32 pb-16 md:pt-40 md:pb-24" glow>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface">
          <img
            src="/images/hero-unified.webp"
            alt="Ancient Indian and Egyptian knowledge systems merged into a single AI harness"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/80 to-bg" />
          <div className="relative z-10 px-6 py-16 md:py-24 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent mb-8">
              <Sparkles className="h-4 w-4" />
              Design agent harnesses for any domain
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance mb-8">
              Turn your ideas into{" "}
              <span className="gradient-text">reusable AI systems</span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              A harness is not a prompt. It is a structured environment that turns an AI agent into a reliable operator for any workflow — video, research, publications, recipe books, fitness, trading, and beyond.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/generator/"
                className="group inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-white font-semibold hover:bg-accent-light transition-all shadow-lg shadow-accent/20"
              >
                Generate a Harness Recipe
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/what-is-a-harness/"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-surface/80 backdrop-blur px-6 py-3.5 text-text font-medium hover:bg-surface-2 transition-colors"
              >
                Learn what a harness is
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Trust strip */}
      <Section className="py-12 border-y border-white/5 bg-surface/50">
        <div className="text-center">
          <p className="text-sm text-text-secondary uppercase tracking-wider mb-6">Built on ideas from</p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-text-secondary opacity-70">
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
          <p className="text-text-secondary text-lg">
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
            icon={<ShieldCheck className="h-6 w-6 text-orange" />}
            title="Cost-controlled"
            description="Model-as-harness gets expensive fast. A custom harness amortizes design cost across hundreds of runs and keeps you off the pay-per-call treadmill."
          />
          <FeatureCard
            icon={<Repeat className="h-6 w-6 text-blue" />}
            title="Self-improving"
            description="Every production run surfaces new anti-patterns. Log them once, and every future session follows the improved rules automatically."
          />
        </div>
      </Section>

      {/* Cultural harness theme section */}
      <Section className="border-y border-white/5 bg-surface/30">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Harnesses are <span className="gradient-text">older than AI</span>
          </h2>
          <p className="text-text-secondary text-lg">
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
      <Section className="pb-32" glow>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface p-10 md:p-16 text-center">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to engineer your harness?</h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto mb-8">
              Describe what you want to build. The generator will think through every layer and produce a complete starter kit.
            </p>
            <Link
              href="/generator/"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-white font-semibold hover:bg-accent-light transition-all shadow-lg shadow-accent/20"
            >
              Start the Generator
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-orange/10 pointer-events-none" />
        </div>
      </Section>
    </>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group rounded-2xl border border-white/5 bg-surface p-6 hover:border-accent/20 hover:bg-surface-2 transition-all">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
