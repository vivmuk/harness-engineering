import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-rule bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-paper">
                <Zap className="h-4 w-4" />
              </div>
              <span className="font-semibold text-ink">Harness Engineering</span>
            </Link>
            <p className="text-ink-2 max-w-xs leading-relaxed text-sm">
              A generator for domain-specific agent systems. Rules, roles, state,
              anti-patterns, and a starter bundle, with built-in quality gates.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="mono-caps mb-4">Learn</p>
            <ul className="space-y-2 text-sm text-ink-2">
              <li><Link href="/what-is-a-harness/" className="hover:text-accent transition-colors">What is a Harness?</Link></li>
              <li><Link href="/anatomy/" className="hover:text-accent transition-colors">Anatomy</Link></li>
              <li><Link href="/principles/" className="hover:text-accent transition-colors">Principles</Link></li>
              <li><Link href="/build-vs-buy/" className="hover:text-accent transition-colors">Build vs Buy</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="mono-caps mb-4">Build</p>
            <ul className="space-y-2 text-sm text-ink-2">
              <li><Link href="/generator/" className="hover:text-accent transition-colors">Recipe Generator</Link></li>
              <li><Link href="/domains/" className="hover:text-accent transition-colors">Domain Examples</Link></li>
              <li>
                <a
                  href="https://venice.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Powered by Venice AI
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-ink-3 font-mono">
          <p>© {new Date().getFullYear()} Harness Engineering · MIT license</p>
          <a
            href="https://github.com/vivmuk/harness-engineering"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            github / vivmuk / harness-engineering
          </a>
        </div>
      </div>
    </footer>
  );
}
