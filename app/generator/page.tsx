"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Section } from "@/components/Section";
import {
  Wand2,
  Download,
  Loader2,
  ImageIcon,
  AlertCircle,
  Key,
  Share2,
  CheckCircle2,
  XCircle,
  Save,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  generateHarnessRecipe,
  refineSection,
  HarnessRecipe,
  RecipeSectionKey,
} from "@/lib/harness-generator";
import { veniceImage, veniceListModels, VeniceModel, DEFAULT_TEXT_MODEL, DEFAULT_IMAGE_MODEL } from "@/lib/venice";
import { downloadBundle } from "@/lib/bundle";
import {
  listRecipes,
  saveRecipe,
  updateRecipe,
  deleteRecipe,
  encodeRecipeShareHash,
  decodeRecipeShareHash,
  StoredRecipe,
} from "@/lib/recipe-store";
import { copyTextToClipboard } from "@/lib/utils";
import { RecipeSection } from "@/components/generator/RecipeSection";
import { HistoryPanel } from "@/components/generator/HistoryPanel";
import { MermaidDiagram } from "@/components/generator/MermaidDiagram";

const defaultUseCases = [
  "Character-consistent AI video series",
  "Weekly deep-research briefings",
  "One article → blog, thread, newsletter, slides",
  "Recipe book generator with shopping lists",
  "Kids' language-learning tutor",
  "Trading strategy backtest harness",
];

const sections: { key: RecipeSectionKey; label: string }[] = [
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

const API_KEY_STORAGE = "harness:apiKey";
const MODELS_STORAGE = "harness:modelPrefs";

export default function GeneratorPage() {
  const [apiKey, setApiKey] = useState("");
  const [rememberKey, setRememberKey] = useState(false);
  const [useCase, setUseCase] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<Partial<HarnessRecipe> | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("summary");
  const [history, setHistory] = useState<StoredRecipe[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sharedView, setSharedView] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showModelSettings, setShowModelSettings] = useState(false);
  const [models, setModels] = useState<VeniceModel[] | null>(null);
  const [textModel, setTextModel] = useState(DEFAULT_TEXT_MODEL);
  const [imageModel, setImageModel] = useState(DEFAULT_IMAGE_MODEL);
  const abortRef = useRef<AbortController | null>(null);
  const userToggledRef = useRef(false);

  // Restore remembered key, model prefs, history, and any shared recipe in the
  // URL hash. Deferred to a microtask: these are browser-only sources that are
  // not available during prerender, and deferring keeps the effect body free of
  // synchronous state updates.
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const storedKey = window.localStorage.getItem(API_KEY_STORAGE);
        if (storedKey) {
          setApiKey(storedKey);
          setRememberKey(true);
        }
        const prefs = window.localStorage.getItem(MODELS_STORAGE);
        if (prefs) {
          const parsed = JSON.parse(prefs) as { text?: string; image?: string };
          if (parsed.text) setTextModel(parsed.text);
          if (parsed.image) setImageModel(parsed.image);
        }
      } catch {
        // storage unavailable ;  proceed with defaults
      }
      setHistory(listRecipes());

      const shared = decodeRecipeShareHash(window.location.hash);
      if (shared) {
        setRecipe(shared);
        setIsComplete(true);
        setSharedView(true);
        setExpandedSection("summary");
      }
    });
    return () => {
      cancelled = true;
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    try {
      if (rememberKey && apiKey) {
        window.localStorage.setItem(API_KEY_STORAGE, apiKey);
      } else {
        window.localStorage.removeItem(API_KEY_STORAGE);
      }
    } catch {
      // storage unavailable
    }
  }, [rememberKey, apiKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(MODELS_STORAGE, JSON.stringify({ text: textModel, image: imageModel }));
    } catch {
      // storage unavailable
    }
  }, [textModel, imageModel]);

  const loadModels = useCallback(async () => {
    if (!apiKey.trim() || models) return;
    try {
      setModels(await veniceListModels(apiKey));
    } catch {
      // Silently keep the free-text inputs with defaults.
      setModels(null);
    }
  }, [apiKey, models]);

  function clearShareHash() {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    setSharedView(false);
  }

  async function handleGenerate() {
    if (!apiKey.trim()) {
      setError("Please enter your Venice API key.");
      return;
    }
    if (!useCase.trim()) {
      setError("Please describe a use case.");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsStreaming(true);
    setError(null);
    setRecipe(null);
    setIsComplete(false);
    setActiveId(null);
    clearShareHash();
    userToggledRef.current = false;

    try {
      const result = await generateHarnessRecipe({
        apiKey,
        useCase,
        model: textModel,
        signal: controller.signal,
        onPartial: (partial) => {
          setRecipe(partial);
          if (!userToggledRef.current) {
            const present = sections.filter(({ key }) => partial[key]);
            const latest = present[present.length - 1];
            if (latest) setExpandedSection(latest.key);
          }
        },
      });
      setRecipe(result);
      setIsComplete(true);
      setExpandedSection("summary");
      const saved = saveRecipe(useCase, result);
      if (saved) {
        setActiveId(saved.id);
        setHistory(listRecipes());
      }
    } catch (err) {
      if (controller.signal.aborted) {
        setError("Generation cancelled.");
        setRecipe(null);
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    } finally {
      setIsStreaming(false);
    }
  }

  function handleCancel() {
    abortRef.current?.abort();
  }

  async function handleGenerateDiagram() {
    if (!recipe?.diagramPrompt || !apiKey.trim()) return;
    setGeneratingImage(true);
    setError(null);
    try {
      const imageUrl = await veniceImage({
        apiKey,
        model: imageModel,
        prompt: recipe.diagramPrompt,
        aspect_ratio: "16:9",
        resolution: "2K",
      });
      setRecipe((prev) => (prev ? { ...prev, diagramImage: imageUrl } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate diagram.");
    } finally {
      setGeneratingImage(false);
    }
  }

  function handleDownload() {
    if (!recipe || !isComplete) return;
    downloadBundle(recipe as HarnessRecipe);
  }

  async function handleShare() {
    if (!recipe || !isComplete) return;
    const url =
      window.location.origin + window.location.pathname + encodeRecipeShareHash(recipe as HarnessRecipe);
    if (await copyTextToClipboard(url)) {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } else {
      setError("Could not copy the share link to the clipboard.");
    }
  }

  function handleSaveShared() {
    if (!recipe || !isComplete) return;
    const saved = saveRecipe("Shared recipe", recipe as HarnessRecipe);
    if (saved) {
      setActiveId(saved.id);
      setHistory(listRecipes());
      clearShareHash();
    } else {
      setError("Could not save to your library (storage unavailable or full).");
    }
  }

  function handleLoadFromHistory(item: StoredRecipe) {
    abortRef.current?.abort();
    setRecipe(item.recipe);
    setIsComplete(true);
    setActiveId(item.id);
    setError(null);
    setExpandedSection("summary");
    clearShareHash();
  }

  function handleDeleteFromHistory(id: string) {
    setHistory(deleteRecipe(id));
    if (activeId === id) setActiveId(null);
  }

  function makeRefineHandler(sectionKey: RecipeSectionKey) {
    return async (instruction: string) => {
      if (!recipe || !isComplete) return;
      const value = await refineSection({
        apiKey,
        model: textModel,
        recipe: recipe as HarnessRecipe,
        sectionKey,
        instruction,
      });
      const updated = { ...(recipe as HarnessRecipe), [sectionKey]: value };
      setRecipe(updated);
      if (activeId) {
        updateRecipe(activeId, updated);
        setHistory(listRecipes());
      }
    };
  }

  const canRefine = isComplete && !sharedView && apiKey.trim().length > 0;
  const textModels = models?.filter((m) => !m.type || m.type === "text") ?? [];
  const imageModels = models?.filter((m) => m.type === "image") ?? [];

  return (
    <>
      <Section className="pt-24 pb-16" glow>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Harness <span className="italic-accent">Recipe Generator</span>
          </h1>
          <p className="text-lg md:text-xl text-ink-2 leading-relaxed">
            Describe what you want to build. The generator designs the full harness: rules, playbooks, agents, state, anti-patterns, and a beautiful diagram.
          </p>
        </div>
      </Section>

      <Section className="border-y border-rule bg-paper-2">
        <div className="max-w-2xl mx-auto space-y-6">
          <HistoryPanel
            items={history}
            activeId={activeId}
            onLoad={handleLoadFromHistory}
            onDelete={handleDeleteFromHistory}
          />

          <div className="space-y-2">
            <label htmlFor="apiKey" className="flex items-center gap-2 text-sm font-medium text-ink">
              <Key className="h-4 w-4 text-accent" />
              Venice API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onBlur={loadModels}
              placeholder="sk-venice-..."
              className="w-full rounded-xl border border-rule bg-paper px-4 py-3 text-ink placeholder:text-ink-2/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-ink-2">
                Your key stays in your browser. It is sent directly to Venice AI from your device.
              </p>
              <label className="flex items-center gap-1.5 text-xs text-ink-2 whitespace-nowrap cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberKey}
                  onChange={(e) => setRememberKey(e.target.checked)}
                  className="accent-[var(--accent)]"
                />
                Remember on this device
              </label>
            </div>
          </div>

          <div>
            <button
              onClick={() => {
                setShowModelSettings((v) => !v);
                loadModels();
              }}
              aria-expanded={showModelSettings}
              className="flex items-center gap-2 text-xs font-medium text-ink-2 hover:text-ink transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Model settings
              {showModelSettings ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
            {showModelSettings && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="textModel" className="text-xs font-medium text-ink-2">
                    Text model
                  </label>
                  {textModels.length > 0 ? (
                    <select
                      id="textModel"
                      value={textModel}
                      onChange={(e) => setTextModel(e.target.value)}
                      className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                    >
                      {!textModels.some((m) => m.id === textModel) && <option value={textModel}>{textModel}</option>}
                      {textModels.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.id}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="textModel"
                      type="text"
                      value={textModel}
                      onChange={(e) => setTextModel(e.target.value)}
                      className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                    />
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="imageModel" className="text-xs font-medium text-ink-2">
                    Image model
                  </label>
                  {imageModels.length > 0 ? (
                    <select
                      id="imageModel"
                      value={imageModel}
                      onChange={(e) => setImageModel(e.target.value)}
                      className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                    >
                      {!imageModels.some((m) => m.id === imageModel) && <option value={imageModel}>{imageModel}</option>}
                      {imageModels.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.id}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="imageModel"
                      type="text"
                      value={imageModel}
                      onChange={(e) => setImageModel(e.target.value)}
                      className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                    />
                  )}
                </div>
                <p className="sm:col-span-2 text-xs text-ink-2">
                  Models load from your Venice account when a key is set; otherwise type any model id.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="useCase" className="text-sm font-medium text-ink">Use Case</label>
            <textarea
              id="useCase"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              placeholder="e.g. Generate a weekly deep-research briefing from a topic, with citations and a one-page executive summary"
              rows={4}
              className="w-full rounded-xl border border-rule bg-paper px-4 py-3 text-ink placeholder:text-ink-2/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {defaultUseCases.map((example) => (
              <button
                key={example}
                onClick={() => setUseCase(example)}
                className="text-xs rounded-full border border-rule bg-surface-2 px-3 py-1.5 text-ink-2 hover:border-accent/30 hover:text-ink transition-colors"
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

          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={isStreaming}
              className="flex-1 rounded-xl bg-accent px-6 py-4 text-white font-semibold hover:bg-accent-light transition-all shadow-lg shadow-accent/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isStreaming ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
              {isStreaming ? "Designing harness..." : "Generate Harness Recipe"}
            </button>
            {isStreaming && (
              <button
                onClick={handleCancel}
                className="rounded-xl border border-rule bg-paper px-4 py-4 text-sm font-medium text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors flex items-center gap-2"
              >
                <XCircle className="h-5 w-5" />
                Cancel
              </button>
            )}
          </div>
        </div>
      </Section>

      {recipe && (
        <Section className="pb-32">
          <div className="max-w-4xl mx-auto">
            {sharedView && (
              <div className="mb-8 rounded-xl border border-accent/30 bg-accent/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-sm text-ink">
                  You&apos;re viewing a shared recipe. Save it to your library to refine or extend it.
                </p>
                <button
                  onClick={handleSaveShared}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-light transition-colors shrink-0"
                >
                  <Save className="h-4 w-4" />
                  Save to my library
                </button>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  {recipe.domain ?? "Designing"} Harness
                  {isStreaming && <Loader2 className="inline-block ml-3 h-5 w-5 animate-spin text-accent" />}
                </h2>
                <p className="text-ink-2">
                  {isStreaming
                    ? "Sections appear live as the model designs them."
                    : "Review each layer, refine any section, then share or download the starter bundle."}
                </p>
              </div>
              {isComplete && (
                <div className="flex flex-wrap gap-3">
                  {!sharedView && (
                    <button
                      onClick={handleGenerateDiagram}
                      disabled={generatingImage || !apiKey.trim()}
                      className="inline-flex items-center gap-2 rounded-xl border border-rule bg-paper px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface-2 transition-colors disabled:opacity-60"
                    >
                      {generatingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                      {generatingImage ? "Generating..." : "AI Art Diagram"}
                    </button>
                  )}
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 rounded-xl border border-rule bg-paper px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface-2 transition-colors"
                  >
                    {shareCopied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Share2 className="h-4 w-4" />}
                    {shareCopied ? "Link copied!" : "Share"}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-light transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download Bundle
                  </button>
                </div>
              )}
            </div>

            {recipe.mermaidDiagram ? (
              <div className="mb-10 space-y-4">
                <MermaidDiagram code={recipe.mermaidDiagram} />
                {recipe.diagramImage && (
                  <div className="rounded-2xl border border-rule bg-paper p-2 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={recipe.diagramImage}
                      alt={`${recipe.domain ?? "Harness"} AI art diagram`}
                      className="w-full rounded-xl"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-10 rounded-2xl border border-rule bg-paper p-2 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={recipe.diagramImage || "/harness-diagram.svg"}
                  alt={`${recipe.domain ?? "Harness"} diagram`}
                  className="w-full rounded-xl"
                />
              </div>
            )}

            <div className="space-y-4">
              {sections
                .filter(({ key }) => typeof recipe[key] === "string")
                .map(({ key, label }) => (
                  <RecipeSection
                    key={key}
                    label={label}
                    content={recipe[key] as string}
                    expanded={expandedSection === key}
                    streaming={isStreaming && expandedSection === key}
                    onToggle={() => {
                      userToggledRef.current = true;
                      setExpandedSection(expandedSection === key ? null : key);
                    }}
                    onRefine={canRefine ? makeRefineHandler(key) : undefined}
                  />
                ))}
            </div>

            {isComplete && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-white font-semibold hover:bg-accent-light transition-all shadow-lg shadow-accent/20"
                >
                  <Download className="h-5 w-5" />
                  Download Starter Bundle
                </button>
              </div>
            )}
          </div>
        </Section>
      )}
    </>
  );
}
