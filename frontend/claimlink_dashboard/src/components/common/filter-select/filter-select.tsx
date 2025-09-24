import { ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  placeholder?: string;
  value: string;
  options: FilterOption[];
  onValueChange: (value: string) => void;
  width?: string;
  className?: string;
}

export function FilterSelect({
  placeholder = "Filter",
  value,
  options,
  onValueChange,
  width = "w-[200px]",
  className
}: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn(
        width,
        "cursor-pointer rounded-full border-[#e1e1e1] bg-white h-12",
        className
      )}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem className="cursor-pointer hover:bg-[#f0f0f0] focus:bg-[#f0f0f0]" key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
