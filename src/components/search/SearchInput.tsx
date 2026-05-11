"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  readOnly?: boolean;
  compact?: boolean;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  onFocus,
  placeholder = "Search repositories…",
  readOnly = false,
  compact = false,
  className,
}: SearchInputProps) {
  return (
    <div
      className={cn(
        "relative flex items-center",
        compact ? "h-8" : "h-10",
        className,
      )}
    >
      <Search
        className={cn(
          "absolute left-3 text-muted-foreground pointer-events-none",
          compact ? "w-3.5 h-3.5" : "w-4 h-4",
        )}
      />
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        readOnly={readOnly}
        className={cn(
          "w-full bg-secondary border border-border rounded-lg text-sm",
          "placeholder:text-muted-foreground text-foreground",
          "focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring",
          "transition-colors",
          compact ? "pl-8 pr-3 h-8 text-xs" : "pl-9 pr-4 h-10",
          readOnly && "cursor-pointer",
        )}
      />
    </div>
  );
}
