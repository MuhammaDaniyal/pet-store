"use client";

import React from "react";

interface SortPanelProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  isExpanded: boolean;
}

export function SortPanel({ sortBy, setSortBy, isExpanded }: SortPanelProps) {
  if (!isExpanded) return null;

  return (
    <div className="mb-6 rounded-2xl border border-border bg-surface p-5 shadow-sm dark:bg-background/50">
      <h4 className="mb-4 text-lg font-semibold text-primary font-serif">Sort Products</h4>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Reset Sort */}
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer rounded-lg p-2 transition-colors hover:bg-accent/10">
            <input
              type="radio"
              name="sort"
              value="none"
              checked={sortBy === "none"}
              onChange={() => setSortBy("none")}
              className="h-4 w-4 text-accent accent-accent"
            />
            <span className="text-sm font-medium text-primary">None (Default)</span>
          </label>
        </div>

        {/* Price Sort */}
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer rounded-lg p-2 transition-colors hover:bg-accent/10">
            <input
              type="radio"
              name="sort"
              value="price-low"
              checked={sortBy === "price-low"}
              onChange={() => setSortBy("price-low")}
              className="h-4 w-4 text-accent accent-accent"
            />
            <span className="text-sm font-medium text-primary">Price: Low to High</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer rounded-lg p-2 transition-colors hover:bg-accent/10">
            <input
              type="radio"
              name="sort"
              value="price-high"
              checked={sortBy === "price-high"}
              onChange={() => setSortBy("price-high")}
              className="h-4 w-4 text-accent accent-accent"
            />
            <span className="text-sm font-medium text-primary">Price: High to Low</span>
          </label>
        </div>

        {/* Name Sort */}
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer rounded-lg p-2 transition-colors hover:bg-accent/10">
            <input
              type="radio"
              name="sort"
              value="name-asc"
              checked={sortBy === "name-asc"}
              onChange={() => setSortBy("name-asc")}
              className="h-4 w-4 text-accent accent-accent"
            />
            <span className="text-sm font-medium text-primary">Name: A to Z</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer rounded-lg p-2 transition-colors hover:bg-accent/10">
            <input
              type="radio"
              name="sort"
              value="name-desc"
              checked={sortBy === "name-desc"}
              onChange={() => setSortBy("name-desc")}
              className="h-4 w-4 text-accent accent-accent"
            />
            <span className="text-sm font-medium text-primary">Name: Z to A</span>
          </label>
        </div>
      </div>
    </div>
  );
}