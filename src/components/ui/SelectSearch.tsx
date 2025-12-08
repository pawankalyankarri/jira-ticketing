"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
// interface Option {
//   label?: string
//   value?: string
//   id? :string,
//   title? : string
// }

interface SelectSearchProps {
  SelectSearchData: string[];
  title: string;
  size: "sm" | "md" | "xs" | "lg" | "full";
  value: string; 
  onChange: (value: string) => void; 
  required? :boolean
}
export function SelectSearch({SelectSearchData,title,size,value,onChange,required} : SelectSearchProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
    {required && <input
        type="text"
        value={value}
        required
        readOnly
        className="hidden"
      />}
    <Popover open={open} onOpenChange={setOpen} >
      
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(" justify-between text-xs capitalize",size === 'xs' ? "w-[100px]" : size === "sm" ?  "w-[150px]" :  size === "lg" ? "w-[375px]" :  size == "full" ? "w-full" :  "w-[210px]"  )}
        >
          
          {value
            ? SelectSearchData.find((data) => data === value)
            : title}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn(" p-0", size === 'xs' ? "w-[100px]" : size === "sm" ? "w-[150px]" :  size === "lg" ? "w-[375px]" :  size == "full" ? "w-[355px]"  :  "w-[210px]")} >
        <Command className="text-xs">
          <CommandInput placeholder="Search Here..." className="h-9 text-xs" />
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {SelectSearchData.map((item) => (
                <CommandItem
                className="text-xs capitalize"
                  key={item}
                  value={item}
                  onSelect={(currentValue) => {
                    console.log('cv',currentValue,value)
              
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {item}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    </>
  )
}
