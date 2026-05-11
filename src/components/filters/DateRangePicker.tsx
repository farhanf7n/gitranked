"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { TimeRange } from "@/lib/types";

const TIME_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "custom", label: "Custom date" },
];

interface DateRangePickerProps {
  value: TimeRange;
  customDate?: string;
  onChange: (timeRange: TimeRange, date?: string) => void;
}

export function DateRangePicker({
  value,
  customDate,
  onChange,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const selectedOption = TIME_OPTIONS.find((o) => o.value === value);
  const displayLabel =
    value === "custom" && customDate
      ? format(new Date(customDate), "MMM d, yyyy")
      : (selectedOption?.label ?? "Today");

  const handleSelect = (range: TimeRange) => {
    if (range === "custom") {
      setShowCalendar(true);
    } else {
      onChange(range);
      setOpen(false);
      setShowCalendar(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange("custom", format(date, "yyyy-MM-dd"));
      setOpen(false);
      setShowCalendar(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1.5 h-8 pl-2.5 pr-2 text-xs rounded-lg border bg-secondary",
            "border-border text-foreground cursor-pointer",
            "hover:border-foreground/30 focus:outline-none transition-colors",
            value !== "today" && "border-foreground/40 bg-accent",
          )}
        >
          <Calendar className="w-3 h-3 text-muted-foreground" />
          {displayLabel}
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-1 w-auto" align="start">
        {!showCalendar ? (
          <div className="flex flex-col gap-0.5">
            {TIME_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex items-center w-full px-3 py-2 text-sm rounded-lg text-left transition-colors",
                  value === option.value
                    ? "bg-secondary font-medium"
                    : "hover:bg-accent text-muted-foreground hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setShowCalendar(false)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
            <CalendarComponent
              mode="single"
              selected={customDate ? new Date(customDate) : undefined}
              onSelect={handleDateSelect}
              disabled={(date) => date > new Date()}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
