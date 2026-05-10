"use client";

import React from "react";
import { X } from "lucide-react";

export type FilterState = {
  categories: string[];
  prices: string[];
};

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const CATEGORY_OPTIONS = ["Dogs", "Cats", "Birds", "Fish", "Small Pets", "Wild Pets", "Other"];
const PRICE_OPTIONS = [
  { label: "Under $50", value: "under-50" },
  { label: "$50 to $200", value: "50-200" },
  { label: "$200 to $800", value: "200-800" },
  { label: "Over $800", value: "over-800" },
];

export function FilterPanel({ isOpen, onClose, filters, setFilters }: FilterPanelProps) {
  if (!isOpen) return null;

  const handleCheckboxChange = (group: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const currentList = prev[group];
      if (currentList.includes(value)) {
        return { ...prev, [group]: currentList.filter((item) => item !== value) };
      } else {
        return { ...prev, [group]: [...currentList, value] };
      }
    });
  };

  const clearAll = () => {
    setFilters({ categories: [], prices: [] });
  };

  return (
    <>
      {/* Dimmed Backdrop (Closes panel when clicked) */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div
        className="fixed inset-y-0 left-0 z-50 w-full max-w-xs transform overflow-y-auto bg-surface border-r border-border p-6 shadow-2xl transition-transform duration-300 ease-in-out sm:max-w-sm"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the panel from closing it
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-bold text-primary">Filters</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-accent/10 hover:text-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-8">
          {/* CATEGORIES */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">Category</h3>
            <div className="space-y-3">
              {CATEGORY_OPTIONS.map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat)}
                    onChange={() => handleCheckboxChange("categories", cat)}
                    className="h-5 w-5 rounded border-border text-accent focus:ring-accent accent-accent transition-all"
                  />
                  <span className="text-sm font-medium text-secondary group-hover:text-primary transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-border/50" />

          {/* PRICE */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">Price</h3>
            <div className="space-y-3">
              {PRICE_OPTIONS.map((price) => (
                <label key={price.value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.prices.includes(price.value)}
                    onChange={() => handleCheckboxChange("prices", price.value)}
                    className="h-5 w-5 rounded border-border text-accent focus:ring-accent accent-accent transition-all"
                  />
                  <span className="text-sm font-medium text-secondary group-hover:text-primary transition-colors">{price.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Clear All Button */}
        <div className="mt-10 mb-4">
          <button
            onClick={clearAll}
            className="w-full rounded-xl border border-border bg-background py-3 text-sm font-semibold text-primary transition-colors hover:border-accent/30 hover:bg-accent/10 hover:text-accent"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </>
  );
}