import { Section } from "@/components/Section";
import { Film, BookOpen, FileText, Dumbbell, TrendingUp, Languages, UtensilsCrossed, Microscope } from "lucide-react";

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
            Harnesses for <span className="gradient-text">every domain</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
            The harness pattern is not limited to AI production. Here are just a few places it applies.
          </p>
        </div>
      </Section>

      <Section className="pb-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => (
            <div key={domain.title} className="rounded-2xl border border-white/5 bg-surface p-6 hover:border-accent/20 transition-colors flex flex-col">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                {domain.icon}
              </div>
              <h2 className="text-xl font-bold mb-2">{domain.title}</h2>
              <p className="text-text-secondary leading-relaxed mb-4 flex-1">{domain.description}</p>
              <div className="flex flex-wrap gap-2">
                {domain.examples.map((ex) => (
                  <span key={ex} className="text-xs font-mono px-2 py-1 rounded-md bg-surface-2 text-text-secondary">
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
