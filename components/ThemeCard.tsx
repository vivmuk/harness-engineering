interface ThemeCardProps {
  image: string;
  title: string;
  description: string;
  badge?: string;
}

export function ThemeCard({ image, title, description, badge }: ThemeCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-rule bg-paper">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        {badge && (
          <span className="mb-3 inline-block rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent font-mono tracking-wider uppercase">
            {badge}
          </span>
        )}
        <h3 className="text-xl font-bold mb-2 text-ink">{title}</h3>
        <p className="text-ink-2 leading-relaxed text-sm">{description}</p>
      </div>
    </div>
  );
}
