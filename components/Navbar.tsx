"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/what-is-a-harness/", label: "What is a Harness?" },
  { href: "/anatomy/", label: "Anatomy" },
  { href: "/principles/", label: "Principles" },
  { href: "/build-vs-buy/", label: "Build vs Buy" },
  { href: "/domains/", label: "Domains" },
  { href: "/generator/", label: "Generator", highlight: true },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <Zap className="h-5 w-5 text-accent" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-ink">
              Harness Engineering
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  link.highlight
                    ? "bg-accent text-paper hover:bg-accent-light"
                    : "text-ink-2 hover:text-ink hover:bg-paper-2"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden rounded-md p-2 text-ink-2 hover:text-ink hover:bg-paper-2"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-rule bg-paper">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  link.highlight
                    ? "bg-accent text-paper"
                    : "text-ink-2 hover:text-ink hover:bg-paper-2"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
