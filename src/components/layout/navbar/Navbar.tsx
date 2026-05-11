"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ExternalLink, GitFork } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SearchInput } from "@/components/search/SearchInput";
import { CommandMenu } from "@/components/command/CommandMenu";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/60 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 group"
            aria-label="GitRanked home"
          >
            <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
              <GitFork className="w-3.5 h-3.5 text-background" />
            </div>
            <span className="font-semibold text-sm tracking-tight hidden sm:block">
              GitRanked
            </span>
          </Link>

          {/* Search — desktop */}
          <div className="flex-1 max-w-sm hidden md:block">
            <SearchInput
              placeholder="Search repositories… (⌘K)"
              onFocus={() => setCommandOpen(true)}
              readOnly
              compact
            />
          </div>

          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/farhanf7n/gitranked"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="GitHub"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
