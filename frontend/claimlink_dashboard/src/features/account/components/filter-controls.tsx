import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/common/search-input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Download } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface FilterControlsProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onDateFilter: (dateRange: { start: Date | undefined; end: Date | undefined }) => void;
  onExport: () => void;
}

export function FilterControls({
  searchQuery,
  onSearch,
  onDateFilter,
  onExport,
}: FilterControlsProps) {
  const [dateRange, setDateRange] = useState<{ start: Date | undefined; end: Date | undefined }>({
    start: undefined,
    end: undefined,
  });

  const handleDateChange = (field: 'start' | 'end', value: Date | undefined) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);

    // Trigger filter whenever a date is set
    onDateFilter(newDateRange);
  };

  const clearDateRange = () => {
    const clearedRange = { start: undefined, end: undefined };
    setDateRange(clearedRange);
    onDateFilter(clearedRange);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      {/* Search Input */}
      <SearchInput
        placeholder="Search for an item"
        value={searchQuery}
        onChange={onSearch}
        className="max-w-md"
      />

      {/* Date Range Picker */}
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "rounded-full border-[#e1e1e1] px-4 py-3 h-12 justify-start text-left font-normal",
                !dateRange.start && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-[#69737c]" />
              {dateRange.start ? format(dateRange.start, "PPP") : <span>Start date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateRange.start}
              onSelect={(date) => handleDateChange('start', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "rounded-full border-[#e1e1e1] px-4 py-3 h-12 justify-start text-left font-normal",
                !dateRange.end && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-[#69737c]" />
              {dateRange.end ? format(dateRange.end, "PPP") : <span>End date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateRange.end}
              onSelect={(date) => handleDateChange('end', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {(dateRange.start || dateRange.end) && (
          <Button
            variant="ghost"
            onClick={clearDateRange}
            className="rounded-full px-4 py-3 h-12"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Export Button */}
      <Button
        onClick={onExport}
        className="bg-[#69737c] hover:bg-[#5a6269] text-white rounded-full px-6 py-3 h-12 flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Download Excel
      </Button>
    </div>
  );
}

