"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FilterState, LayoutMode, SortOption } from "@/lib/types";
import { DateRangePicker } from "./DateRangePicker";

const LANGUAGES = [
  { value: "all", label: "All Languages" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "java", label: "Java" },
  { value: "c++", label: "C++" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "php", label: "PHP" },
  { value: "csharp", label: "C#" },
  { value: "shell", label: "Shell" },
  { value: "dart", label: "Dart" },
  { value: "scala", label: "Scala" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "stars", label: "Most Stars" },
  { value: "forks", label: "Most Forks" },
  { value: "updated", label: "Recently Updated" },
];

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: Partial<FilterState>) => void;
  totalCount?: number;
}

export function FilterBar({ filters, onChange, totalCount }: FilterBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasActiveFilters =
    filters.language !== "all" || filters.sort !== "stars";

  const clearFilters = () => {
    onChange({ language: "all", sort: "stars" });
  };

  const FilterControls = () => (
    <div className="flex flex-wrap items-center gap-2">
      {/* Language */}
      <div className="relative">
        <select
          value={filters.language}
          onChange={(e) => onChange({ language: e.target.value })}
          className={cn(
            "appearance-none pl-3 pr-8 h-8 text-xs rounded-lg border bg-secondary",
            "border-border text-foreground cursor-pointer",
            "hover:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-ring",
            "transition-colors",
            filters.language !== "all" && "border-foreground/40 bg-accent",
          )}
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
      </div>

      {/* Sort */}
      <div className="relative">
        <select
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value as SortOption })}
          className={cn(
            "appearance-none pl-3 pr-8 h-8 text-xs rounded-lg border bg-secondary",
            "border-border text-foreground cursor-pointer",
            "hover:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-ring",
            "transition-colors",
          )}
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
      </div>

      {/* Date range */}
      <DateRangePicker
        value={filters.timeRange}
        customDate={filters.date}
        onChange={(timeRange, date) => onChange({ timeRange, date })}
      />

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 h-8 px-2.5 text-xs rounded-lg border border-border
            text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      {/* Left: counts + filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {totalCount !== undefined && (
          <span className="text-sm text-muted-foreground font-medium">
            <span className="text-foreground font-semibold">
              {totalCount.toLocaleString()}
            </span>{" "}
            repositories
          </span>
        )}

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex md:hidden items-center gap-1.5 h-8 px-3 text-xs rounded-lg border border-border
            text-muted-foreground hover:text-foreground transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
          )}
        </button>

        {/* Desktop */}
        <div className="hidden md:flex">
          <FilterControls />
        </div>
      </div>

      {/* Right: Layout toggle */}
      <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
        <button
          onClick={() => onChange({ layout: "grid" })}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            filters.layout === "grid"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-label="Grid view"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onChange({ layout: "list" })}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            filters.layout === "list"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-label="List view"
        >
          <List className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden absolute left-4 right-4 top-full mt-1 z-40 bg-popover border border-border
          rounded-xl p-4 shadow-xl"
        >
          <FilterControls />
        </div>
      )}
    </div>
  );
}
