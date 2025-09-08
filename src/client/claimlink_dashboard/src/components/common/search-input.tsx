import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchInputProps {
  placeholder?: string
  className?: string
  value?: string
  onChange?: (value: string) => void
}

export function SearchInput({
  placeholder = "Search for an item",
  className,
  value,
  onChange
}: SearchInputProps) {
  return (
    <div className={cn(
      "relative bg-white rounded-full px-4 py-3 border border-[#e1e1e1] flex items-center justify-between text-[13px] text-[#69737c]",
      className
    )}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="border-none bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#69737c] text-[13px]"
      />
      <Search className="h-4 w-4 text-[#69737c]" />
    </div>
  )
}
