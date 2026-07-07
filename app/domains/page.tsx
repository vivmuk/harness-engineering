import { Section } from "@/components/Section";
import { Film, BookOpen, FileText, Dumbbell, TrendingUp, Languages, UtensilsCrossed, Microscope, Sparkles } from "lucide-react";
import { ThemeCard } from "@/components/ThemeCard";

export const metadata = {
  title: "Domain Examples | Harness Engineering",
  description: "Harness examples across video, research, publications, recipe books, fitness, and more.",
};

const domains = [
  {
    icon: <Film className="h-6 w-6 text-accent" />,
    title: "AI Video Production",
    description: "Character-consistent videos, storyboards, trailers, and long-form narrative with model routing and text-first editing.",
    examples: ["Venice Video Harness", "browser-use/video-use"],
  },
  {
    icon: <Microscope className="h-6 w-6 text-orange" />,
    title: "Deep Research",
    description: "Ingest sources, extract claims, build evidence maps, and generate reports with citations and confidence scores.",
    examples: ["Source → claim map → report", "Fact-checker agent"],
  },
  {
    icon: <BookOpen className="h-6 w-6 text-blue" />,
    title: "Publications",
    description: "One source of truth, many formats: long-form article, social thread, newsletter, slide deck, podcast script.",
    examples: ["Blog → thread → slides", "Newsletter assembly"],
  },
  {
    icon: <UtensilsCrossed className="h-6 w-6 text-success" />,
    title: "Recipe Books",
    description: "Generate, test, and refine recipes with dietary constraints, seasonal ingredients, and shopping lists.",
    examples: ["Recipe development", "Meal-plan harness"],
  },
  {
    icon: <Dumbbell className="h-6 w-6 text-warning" />,
    title: "Fitness Planning",
    description: "Build periodized training plans, track progress, and adjust based on feedback and recovery data.",
    examples: ["Training block planner", "Recovery coach"],
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-accent-light" />,
    title: "Trading Strategies",
    description: "Strategy-as-markdown with backtests, risk rules, and execution guardrails.",
    examples: ["VibeTrade", "Rebalancing harness"],
  },
  {
    icon: <Languages className="h-6 w-6 text-orange" />,
    title: "Language Learning",
    description: "Bilingual tutor, progress tracking, and kid-friendly content generation with safety guardrails.",
    examples: ["Gujarati Kids pattern", "Comprehensible input levels"],
  },
  {
    icon: <FileText className="h-6 w-6 text-blue" />,
    title: "Legal / Contract Drafting",
    description: "Template-driven document generation with clause libraries, review agents, and version control.",
    examples: ["NDA generator", "Contract review harness"],
  },
];

export default function Domains() {
  return (
    <>
      <Section className="pt-24 pb-16" glow>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Harnesses for <span className="italic-accent">every domain</span>
          </h1>
          <p className="text-lg md:text-xl text-ink-2 leading-relaxed">
            The harness pattern is not limited to AI production. Here are just a few places it applies.
          </p>
        </div>
      </Section>

      <Section className="pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => (
            <div key={domain.title} className="rounded-2xl border border-rule bg-paper p-6 hover:border-accent/20 transition-colors flex flex-col">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                {domain.icon}
              </div>
              <h2 className="text-xl font-bold mb-2">{domain.title}</h2>
              <p className="text-ink-2 leading-relaxed mb-4 flex-1">{domain.description}</p>
              <div className="flex flex-wrap gap-2">
                {domain.examples.map((ex) => (
                  <span key={ex} className="text-xs font-mono px-2 py-1 rounded-md bg-surface-2 text-ink-2">
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-y border-rule bg-paper-2 pb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent mb-4">
              <Sparkles className="h-4 w-4" />
              Visual language
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              A look that carries meaning
            </h2>
            <p className="text-ink-2 text-lg leading-relaxed">
              The Indian and Egyptian visual themes are not decoration. They remind us that harnesses are a human pattern: rules, roles, records, and rituals, refined over millennia.
            </p>
          </div>
          <ThemeCard
            image="/images/hero-unified.webp"
            badge="Indo-Egyptian"
            title="Two civilizations, one architecture"
            description="Observatories, archives, scribes, inspectors, and recurring motifs ;  every durable system needs the same harness layers."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <ThemeCard
            image="/images/card-indian.webp"
            badge="Video & creative"
            title="Pattern and repetition"
            description="Like Indian miniature painting, creative harnesses rely on consistent motifs, palettes, and compositional rules."
          />
          <ThemeCard
            image="/images/card-egyptian.webp"
            badge="Research & legal"
            title="Order and provenance"
            description="Like Egyptian record-keeping, research harnesses depend on structured archives, citation trails, and verification roles."
          />
          <ThemeCard
            image="/images/card-unified.webp"
            badge="Every domain"
            title="Reusable across cultures"
            description="The same harness layers work in any domain because the underlying problem ;  reliable, reusable work ;  is universal."
          />
        </div>
      </Section>
    </>
  );
}
