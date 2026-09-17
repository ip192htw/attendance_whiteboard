"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import * as Popover from "@radix-ui/react-popover";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check, ChevronDown, X } from "lucide-react";

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function RadixMultiSelect({
    options,
    selected,
    onChange,
    placeholder = "請選擇...",
    className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  // 切換選取狀態
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  // 移除標籤
  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== value));
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      {/* 下拉選單開關觸發器 */}
      <Popover.Trigger asChild>
        <button className={cn("flex min-h-10 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500", className)}>
          <div className="flex flex-wrap gap-1 items-center">
            {selected.length > 0 ? (
              selected.map((val) => {
                const option = options.find((o) => o.value === val);
                return (
                  <span
                    key={val}
                    className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800"
                  >
                    {option?.label || val}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={(e) => handleRemove(val, e)}
                    />
                  </span>
                );
              })
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 ml-2" />
        </button>
      </Popover.Trigger>

      {/* 下拉彈出視窗 */}
      <Popover.Portal>
        <Popover.Content
          className="z-50 w-(--radix-popover-trigger-width) rounded-md border border-gray-200 bg-white p-1 shadow-lg animate-in fade-in-80"
          sideOffset={5}
        >
          <div className="max-h-60 overflow-y-auto space-y-1">
            {options.map((option) => {
              const isChecked = selected.includes(option.value);

              return (
                <div
                  key={option.value}
                  onClick={() => handleToggle(option.value)}
                  className="flex items-center gap-2 rounded px-2 py-1.5 text-sm cursor-pointer hover:bg-indigo-50 select-none"
                >
                  <Checkbox.Root
                    checked={isChecked}
                    onCheckedChange={() => handleToggle(option.value)}
                    className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 focus:outline-none"
                  >
                    <Checkbox.Indicator>
                      <Check className="h-3 w-3 text-white" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <span>{option.label}</span>
                </div>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}