"use client";

import { useState } from "react";
import { History, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { StoredRecipe } from "@/lib/recipe-store";
import { cn } from "@/lib/utils";

interface HistoryPanelProps {
  items: StoredRecipe[];
  activeId: string | null;
  onLoad: (item: StoredRecipe) => void;
  onDelete: (id: string) => void;
}

export function HistoryPanel({ items, activeId, onLoad, onDelete }: HistoryPanelProps) {
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-surface overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface-2 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-text">
          <History className="h-4 w-4 text-accent" />
          My recipes ({items.length})
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-accent" /> : <ChevronDown className="h-4 w-4 text-text-secondary" />}
      </button>
      {open && (
        <ul className="border-t border-white/5 divide-y divide-white/5 max-h-72 overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2 px-4 py-2.5">
              <button
                onClick={() => onLoad(item)}
                className={cn(
                  "flex-1 min-w-0 text-left transition-colors",
                  item.id === activeId ? "text-accent-light" : "text-text-secondary hover:text-text"
                )}
              >
                <span className="block text-sm font-medium truncate">{item.recipe.domain}</span>
                <span className="block text-xs truncate">
                  {new Date(item.createdAt).toLocaleDateString()} · {item.useCase}
                </span>
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="rounded-md p-1.5 text-text-secondary hover:text-red-300 hover:bg-surface-3 transition-colors shrink-0"
                title="Delete recipe"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
