"use client";

import { useEffect, useRef } from "react";

/**
 * Wraps children in a div that fades up when scrolled into view.
 *
 * - 700ms custom ease-out transition (per viv-design motion doctrine).
 * - prefers-reduced-motion: drops the translate, keeps opacity only.
 * - No IntersectionObserver thresholds to flip into re-hide on scroll-out;
 *   one-shot reveal is correct for editorial brand surfaces.
 */
export function RevealOnScroll({
  children,
  className = "",
  as: Tag = "div",
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  delayMs?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-revealed");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-revealed");
            io.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const props = {
    ref,
    className: `reveal ${className}`,
    style: delayMs ? { transitionDelay: `${delayMs}ms` } : undefined,
  };

  return <Tag {...(props as object)}>{children}</Tag>;
}
