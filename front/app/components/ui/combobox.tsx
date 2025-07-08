"use client";

import { useId, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { Icon } from "@iconify/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  id?: string;
  label?: string;
  icon?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  disabled?: boolean;
  className?: string;
}

export function Combobox({
  id: providedId,
  label,
  icon,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No options found.",
  value,
  onChange,
  options,
  disabled = false,
  className,
}: ComboboxProps) {
  const generatedId = useId();
  const id = providedId || generatedId;
  const [open, setOpen] = useState<boolean>(false);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={cn("grid w-full items-center gap-1.5", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "bg-background relative hover:bg-background border-input w-full justify-between font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
              icon ? "pl-8 pr-3" : "px-3"
            )}
          >
            {icon && (
              <Icon
                icon={icon}
                className="absolute top-1/2 left-2 -translate-y-1/2 text-muted-foreground h-4 w-4"
              />
            )}
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {selectedOption?.label || placeholder}
            </span>
            <ChevronDownIcon
              size={16}
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {option.label}
                    {value === option.value && (
                      <CheckIcon size={16} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
