"use client";

import { useState } from "react";
import { Section } from "@/components/Section";
import { Wand2, Download, Loader2, ImageIcon, AlertCircle, CheckCircle2, Copy, ChevronDown, ChevronUp, Key } from "lucide-react";
import { generateHarnessRecipe, HarnessRecipe } from "@/lib/harness-generator";
import { veniceImage } from "@/lib/venice";
import { downloadBundle } from "@/lib/bundle";

const defaultUseCases = [
  "Character-consistent AI video series",
  "Weekly deep-research briefings",
  "One article → blog, thread, newsletter, slides",
  "Recipe book generator with shopping lists",
  "Kids' language-learning tutor",
  "Trading strategy backtest harness",
];

export default function GeneratorPage() {
  const [apiKey, setApiKey] = useState("");
  const [useCase, setUseCase] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<HarnessRecipe | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("summary");

  async function handleGenerate() {
    if (!apiKey.trim()) {
      setError("Please enter your Venice API key.");
      return;
    }
    if (!useCase.trim()) {
      setError("Please describe a use case.");
      return;
    }

    setLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const result = await generateHarnessRecipe({ apiKey, useCase });
      setRecipe(result);
      setExpandedSection("summary");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateDiagram() {
    if (!recipe || !apiKey.trim()) return;
    setGeneratingImage(true);
    setError(null);
    try {
      const imageUrl = await veniceImage({
        apiKey,
        prompt: recipe.diagramPrompt,
        aspect_ratio: "16:9",
        resolution: "2K",
      });
      setRecipe({ ...recipe, diagramImage: imageUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate diagram.");
    } finally {
      setGeneratingImage(false);
    }
  }

  function handleDownload() {
    if (!recipe) return;
    downloadBundle(recipe);
  }

  function copyToClipboard(text: string, section: string) {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  }

  const sections: { key: keyof HarnessRecipe; label: string }[] = [
    { key: "summary", label: "Summary" },
    { key: "rules", label: "Orchestration Rules (CLAUDE.md)" },
    { key: "playbook", label: "Workflow Playbook" },
    { key: "agents", label: "Specialist Agents" },
    { key: "skills", label: "Reusable Skills" },
    { key: "stateSchema", label: "State Schema" },
    { key: "executionLayer", label: "Execution Layer" },
    { key: "antiPatterns", label: "Anti-Patterns" },
    { key: "qhxLoop", label: "QHX Improvement Loop" },
    { key: "modelSuggestions", label: "Model Suggestions" },
    { key: "veniceApiUsage", label: "Venice API Usage" },
  ];

  return (
    <>
      <Section className="pt-24 pb-16" glow>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Harness <span className="gradient-text">Recipe Generator</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
            Describe what you want to build. The generator designs the full harness: rules, playbooks, agents, state, anti-patterns, and a beautiful diagram.
          </p>
        </div>
      </Section>

      <Section className="border-y border-white/5 bg-surface/50">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="flex items-center gap-2 text-sm font-medium text-text">
              <Key className="h-4 w-4 text-accent" />
              Venice API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-venice-..."
              className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-text placeholder:text-text-secondary/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <p className="text-xs text-text-secondary">
              Your key stays in your browser. It is sent directly to Venice AI from your device.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="useCase" className="text-sm font-medium text-text">Use Case</label>
            <textarea
              id="useCase"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              placeholder="e.g. Generate a weekly deep-research briefing from a topic, with citations and a one-page executive summary"
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-text placeholder:text-text-secondary/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {defaultUseCases.map((example) => (
              <button
                key={example}
                onClick={() => setUseCase(example)}
                className="text-xs rounded-full border border-white/10 bg-surface-2 px-3 py-1.5 text-text-secondary hover:border-accent/30 hover:text-text transition-colors"
              >
                {example}
              </button>
            ))}
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex items-start gap-3 text-red-200">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full rounded-xl bg-accent px-6 py-4 text-white font-semibold hover:bg-accent-light transition-all shadow-lg shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
            {loading ? "Designing harness..." : "Generate Harness Recipe"}
          </button>
        </div>
      </Section>

      {recipe && (
        <Section className="pb-32">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold">{recipe.domain} Harness</h2>
                <p className="text-text-secondary">Review each layer, generate a diagram, then download the starter bundle.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleGenerateDiagram}
                  disabled={generatingImage}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-surface px-4 py-2.5 text-sm font-medium text-text hover:bg-surface-2 transition-colors disabled:opacity-60"
                >
                  {generatingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                  {generatingImage ? "Generating..." : "Generate Diagram"}
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-light transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download Bundle
                </button>
              </div>
            </div>

            <div className="mb-10 rounded-2xl border border-white/10 bg-surface p-2 overflow-hidden">
              <img src={recipe.diagramImage || "/harness-diagram.svg"} alt={`${recipe.domain} harness diagram`} className="w-full rounded-xl" />
            </div>

            <div className="space-y-4">
              {sections.map(({ key, label }) => (
                <div key={key} className="rounded-xl border border-white/5 bg-surface overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === key ? null : key)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-2 transition-colors"
                  >
                    <span className="font-semibold text-text">{label}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(recipe[key] as string, key);
                        }}
                        className="rounded-md p-1.5 text-text-secondary hover:text-text hover:bg-surface-3"
                        title="Copy"
                      >
                        {copiedSection === key ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                      </button>
                      {expandedSection === key ? (
                        <ChevronUp className="h-5 w-5 text-accent" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-text-secondary" />
                      )}
                    </div>
                  </button>
                  {expandedSection === key && (
                    <div className="px-5 pb-5 border-t border-white/5">
                      <div className="prose prose-invert max-w-none pt-4 text-text-secondary leading-relaxed whitespace-pre-wrap">
                        {recipe[key] as string}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-white font-semibold hover:bg-accent-light transition-all shadow-lg shadow-accent/20"
              >
                <Download className="h-5 w-5" />
                Download Starter Bundle
              </button>
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
