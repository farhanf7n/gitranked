"use client";

import { useCallback, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { FilterBar } from "@/components/filters/FilterBar";
import { RepoGrid } from "@/components/repository/RepoGrid";
import { useInfiniteRepositories } from "@/lib/hooks/useRepositories";
import type { FilterState } from "@/lib/types";
import { cn } from "@/lib/utils";

function useFiltersFromUrl(): FilterState {
  const sp = useSearchParams();
  return {
    language: sp.get("language") ?? "all",
    timeRange: (sp.get("timeRange") as FilterState["timeRange"]) ?? "today",
    sort: (sp.get("sort") as FilterState["sort"]) ?? "stars",
    layout: (sp.get("layout") as FilterState["layout"]) ?? "grid",
    query: sp.get("query") ?? "",
    date: sp.get("date") ?? undefined,
  };
}

export default function HomeClient() {
  const router = useRouter();
  const filters = useFiltersFromUrl();
  const [searchValue, setSearchValue] = useState(filters.query);
  const [, startTransition] = useTransition();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteRepositories({
      language: filters.language,
      timeRange: filters.timeRange,
      sort: filters.sort,
      query: filters.query,
      date: filters.date,
    });

  const repositories = data?.pages.flatMap((p) => p.repositories) ?? [];
  const totalCount = data?.pages[0]?.totalCount;

  const updateUrl = useCallback(
    (partial: Partial<FilterState>) => {
      const sp = new URLSearchParams(window.location.search);
      Object.entries(partial).forEach(([key, val]) => {
        if (val == null || val === "" || val === "all") {
          sp.delete(key);
        } else {
          sp.set(key, String(val));
        }
      });
      // reset sort to default
      if (!sp.get("sort") || sp.get("sort") === "stars") sp.delete("sort");
      if (!sp.get("timeRange") || sp.get("timeRange") === "today")
        sp.delete("timeRange");
      if (!sp.get("layout") || sp.get("layout") === "grid") sp.delete("layout");
      startTransition(() => {
        router.push(`/?${sp.toString()}`, { scroll: false });
      });
    },
    [router],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ query: searchValue });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        {/* Background glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(120,120,120,0.12) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border
            bg-secondary text-xs text-muted-foreground mb-6"
          >
            <Sparkles className="w-3 h-3" />
            Discover trending open-source projects
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
            Discover the most starred{" "}
            <span className="text-muted-foreground">GitHub projects</span> from
            any date.
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            Explore trending repositories by language, date, and more. Stay on
            top of the open-source ecosystem.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search repositories…"
              className={cn(
                "w-full h-11 pl-10 pr-28 rounded-xl border border-border bg-card",
                "text-sm placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                "transition-all shadow-sm",
              )}
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-4 rounded-lg
                bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </form>
        </motion.div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        {/* Filter bar */}
        <div className="relative mb-6 border-b border-border pb-3">
          <FilterBar
            filters={filters}
            onChange={updateUrl}
            totalCount={totalCount}
          />
        </div>

        {/* Grid / List */}
        <RepoGrid
          repositories={repositories}
          layout={filters.layout}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
        />
      </section>
    </div>
  );
}
