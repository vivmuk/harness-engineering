"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CheckCircle2, ChevronDown, ChevronUp, Copy, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { cn, copyTextToClipboard } from "@/lib/utils";

interface RecipeSectionProps {
  label: string;
  content: string;
  expanded: boolean;
  streaming?: boolean;
  onToggle: () => void;
  /** When provided, shows the Refine affordance. Should resolve when the section has been replaced. */
  onRefine?: (instruction: string) => Promise<void>;
}

export function RecipeSection({ label, content, expanded, streaming, onToggle, onRefine }: RecipeSectionProps) {
  const [copied, setCopied] = useState(false);
  const [refineOpen, setRefineOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [refining, setRefining] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);
  const [justRefined, setJustRefined] = useState(false);

  async function handleCopy() {
    if (await copyTextToClipboard(content)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleRefine() {
    if (!instruction.trim() || !onRefine) return;
    setRefining(true);
    setRefineError(null);
    try {
      await onRefine(instruction.trim());
      setInstruction("");
      setRefineOpen(false);
      setJustRefined(true);
      setTimeout(() => setJustRefined(false), 1500);
    } catch (err) {
      setRefineError(err instanceof Error ? err.message : "Refinement failed.");
    } finally {
      setRefining(false);
    }
  }

  return (
    <div
      className={cn(
        "rounded-xl border bg-paper overflow-hidden transition-colors",
        streaming ? "border-accent/40" : justRefined ? "border-success/50" : "border-rule"
      )}
    >
      <div className="flex items-center justify-between pr-3 hover:bg-surface-2 transition-colors">
        <button
          onClick={onToggle}
          aria-expanded={expanded}
          className="flex-1 flex items-center justify-between gap-3 p-5 text-left"
        >
          <span className="font-semibold text-ink flex items-center gap-2">
            {label}
            {streaming && <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />}
          </span>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-accent shrink-0" />
          ) : (
            <ChevronDown className="h-5 w-5 text-ink-2 shrink-0" />
          )}
        </button>
        <div className="flex items-center gap-1 shrink-0">
          {onRefine && !streaming && (
            <button
              onClick={() => {
                setRefineOpen((v) => !v);
                if (!expanded) onToggle();
              }}
              className={cn(
                "rounded-md p-1.5 hover:bg-surface-3 transition-colors",
                refineOpen ? "text-accent" : "text-ink-2 hover:text-ink"
              )}
              title="Refine this section with AI"
            >
              <Sparkles className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleCopy}
            className="rounded-md p-1.5 text-ink-2 hover:text-ink hover:bg-surface-3 transition-colors"
            title="Copy"
          >
            {copied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="px-5 pb-5 border-t border-rule">
          {refineOpen && onRefine && (
            <div className="mt-4 rounded-lg border border-accent/20 bg-surface-2 p-3 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRefine()}
                  placeholder="e.g. make the agents more specific"
                  disabled={refining}
                  className="flex-1 rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-2/50 focus:border-accent focus:outline-none"
                />
                <button
                  onClick={handleRefine}
                  disabled={refining || !instruction.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-light transition-colors disabled:opacity-50"
                >
                  {refining ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {refining ? "Refining…" : "Refine"}
                </button>
              </div>
              {refineError && (
                <p className="flex items-start gap-1.5 text-xs text-red-300">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  {refineError}
                </p>
              )}
            </div>
          )}
          <div className="prose prose-invert prose-harness max-w-none pt-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
