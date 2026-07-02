import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  glow?: boolean;
  id?: string;
}

export function Section({ children, className, innerClassName, glow, id }: SectionProps) {
  return (
    <section id={id} className={cn("relative py-20 md:py-28", className)}>
      {glow && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
        </div>
      )}
      <div className={cn("relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
