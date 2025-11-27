"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface dropdownDataType {
  value: string;
  label: string;
}

interface dropdownDataPropsType {
  dropdownData: dropdownDataType[];
  title: string;
  value: string;
  onChange: (value: string) => void;
  size?: string;
}

// const frameworks = [
//   {
//     value: "next.js",
//     label: "Next.js",
//   },
//   {
//     value: "sveltekit",
//     label: "SvelteKit",
//   },
//   {
//     value: "nuxt.js",
//     label: "Nuxt.js",
//   },
//   {
//     value: "remix",
//     label: "Remix",
//   },
//   {
//     value: "astro",
//     label: "Astro",
//   },
// ]

export function DropdownSearch({
  dropdownData,
  title,
  value,
  onChange,
  size,
}: dropdownDataPropsType) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between",
            size ? `w-[${size}px]` : "w-[200px] "
          )}
        >
          {value
            ? dropdownData.find((data) => String(data.value) === String(value))?.label
            : `Select ${title}`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-0 ")}
        style={{ width: size ? `${size}px` : "200px" }}
      >
        <Command>
          <CommandInput
            placeholder={`Search ${title}...`}
            className="h-9"
            required
          />
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {dropdownData.map((data) => (
                <CommandItem
                  aria-required
                  key={data.value}
                  value={data.value}
                  onSelect={() => {
                    if (value === data.value) {
                      onChange("");
                    } else {
                      onChange(data.value);
                    }
                    setOpen(false);
                  }}
                >
                  {data.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === data.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
