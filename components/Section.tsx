import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  /** @deprecated decorative glow halos removed in the paper-palette polish ;  kept for back-compat with existing call sites. */
  glow?: boolean;
  id?: string;
}

export function Section({ children, className, innerClassName, id }: SectionProps) {
  return (
    <section id={id} className={cn("relative py-20 md:py-28", className)}>
      <div className={cn("relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
