"use client";

import { useEffect, useRef, useState } from "react";
import { Code2, Copy, CheckCircle2 } from "lucide-react";
import { copyTextToClipboard } from "@/lib/utils";

let renderCounter = 0;

type RenderResult = { code: string; svg: string | null; failed: boolean };

export function MermaidDiagram({ code }: { code: string }) {
  // Keyed by the source code so a code change naturally falls back to the
  // loading state without resetting state synchronously in the effect.
  const [result, setResult] = useState<RenderResult | null>(null);
  const [showSource, setShowSource] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "dark",
          themeVariables: {
            background: "#0f0f13",
            primaryColor: "#1e1e27",
            primaryTextColor: "#f5f5f7",
            primaryBorderColor: "#6d5dfc",
            lineColor: "#8b7dff",
            secondaryColor: "#16161d",
            tertiaryColor: "#16161d",
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
          },
        });
        const id = `harness-mermaid-${++renderCounter}`;
        const { svg } = await mermaid.render(id, code);
        if (!cancelled) setResult({ code, svg, failed: false });
      } catch {
        if (!cancelled) setResult({ code, svg: null, failed: true });
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [code]);

  const current = result?.code === code ? result : null;
  const svg = current?.svg ?? null;
  const failed = current?.failed ?? false;

  async function handleCopy() {
    if (await copyTextToClipboard(code)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="rounded-2xl border border-rule bg-paper overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-rule">
        <span className="text-xs font-medium text-ink-2 uppercase tracking-wider">Architecture Diagram</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSource((v) => !v)}
            className="rounded-md p-1.5 text-ink-2 hover:text-ink hover:bg-surface-3 transition-colors"
            title={showSource ? "Show diagram" : "View Mermaid source"}
            aria-pressed={showSource}
          >
            <Code2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleCopy}
            className="rounded-md p-1.5 text-ink-2 hover:text-ink hover:bg-surface-3 transition-colors"
            title="Copy Mermaid source"
          >
            {copied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {showSource || failed ? (
        <div className="p-4">
          {failed && (
            <p className="text-xs text-warning mb-2">
              The diagram could not be rendered — showing the Mermaid source instead.
            </p>
          )}
          <pre className="text-xs overflow-x-auto"><code>{code}</code></pre>
        </div>
      ) : svg ? (
        <div
          ref={containerRef}
          className="p-4 overflow-x-auto [&_svg]:mx-auto [&_svg]:max-w-full [&_svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="p-10 text-center text-sm text-ink-2 animate-pulse">Rendering diagram…</div>
      )}
    </div>
  );
}
