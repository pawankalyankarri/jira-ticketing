"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CalendarProps {
  date: Date | undefined;
  onChange: (date: Date) => void;
}

export function Calendar22({ date, onChange }: CalendarProps) {
  const [open, setOpen] = React.useState(false);
  const today = new Date();
const nextTwoMonths = new Date();
nextTwoMonths.setMonth(today.getMonth() + 12);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="w-full justify-between font-normal"
        >
          {date ? date.toLocaleDateString() : "Select date"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          endMonth={nextTwoMonths}
          // disabled={[{ before: today.getMonth() }]} 
          // disabled = {[
          //   {before : today},
          //   {after : nextTwoMonths}
          // ]}
          onSelect={(selectedDate) => {
            if (selectedDate) onChange(selectedDate);
            setOpen(false);
          }}
        
        />
      </PopoverContent>
    </Popover>
  );
}
