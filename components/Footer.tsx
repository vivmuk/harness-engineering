import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-rule bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10">
                <Zap className="h-4 w-4 text-accent" />
              </div>
              <span className="font-semibold text-ink">Harness Engineering</span>
            </Link>
            <p className="text-ink-2 max-w-sm leading-relaxed">
              Design agent harnesses for any domain. Build reusable AI systems with rules, state, and quality gates.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-ink mb-3">Learn</h3>
            <ul className="space-y-2 text-sm text-ink-2">
              <li><Link href="/what-is-a-harness/" className="hover:text-accent">What is a Harness?</Link></li>
              <li><Link href="/anatomy/" className="hover:text-accent">Anatomy</Link></li>
              <li><Link href="/principles/" className="hover:text-accent">Principles</Link></li>
              <li><Link href="/build-vs-buy/" className="hover:text-accent">Build vs Buy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-ink mb-3">Build</h3>
            <ul className="space-y-2 text-sm text-ink-2">
              <li><Link href="/generator/" className="hover:text-accent">Recipe Generator</Link></li>
              <li><Link href="/domains/" className="hover:text-accent">Domain Examples</Link></li>
              <li>
                <a href="https://venice.ai" target="_blank" rel="noopener noreferrer" className="hover:text-accent inline-flex items-center gap-1">
                  Powered by Venice AI
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-rule flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-2">
          <p>© {new Date().getFullYear()} Harness Engineering. Open source under MIT.</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/vivmuk/harness-engineering" target="_blank" rel="noopener noreferrer" className="hover:text-ink flex items-center gap-1">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
