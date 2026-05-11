"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Search,
  Moon,
  Sun,
  Home,
  GitFork,
  TrendingUp,
  Filter,
  Code2,
} from "lucide-react";
import { useTheme } from "next-themes";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "C++",
  "Ruby",
];

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [search, setSearch] = useState("");

  const runCommand = useCallback(
    (cmd: () => void) => {
      onOpenChange(false);
      cmd();
    },
    [onOpenChange],
  );

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput
          placeholder="Type a command or search…"
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Filter by Language">
            {LANGUAGES.map((lang) => (
              <CommandItem
                key={lang}
                onSelect={() =>
                  runCommand(() =>
                    router.push(`/?language=${lang.toLowerCase()}`),
                  )
                }
              >
                <Code2 className="w-4 h-4 mr-2" />
                {lang} repositories
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Time Range">
            {(
              [
                ["today", "Today's trending"],
                ["week", "This week's trending"],
                ["month", "This month's trending"],
              ] as const
            ).map(([range, label]) => (
              <CommandItem
                key={range}
                onSelect={() =>
                  runCommand(() => router.push(`/?timeRange=${range}`))
                }
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun className="w-4 h-4 mr-2" />
              Light mode
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="w-4 h-4 mr-2" />
              Dark mode
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Filter className="w-4 h-4 mr-2" />
              System theme
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
