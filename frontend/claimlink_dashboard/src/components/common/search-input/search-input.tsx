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
    <div className={cn("flex-1 relative flex items-center", className)}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="pr-10 rounded-full border-[#e1e1e1] bg-white h-12 w-full"
      />
      <Search className="absolute right-4 w-4 h-4 text-[#69737c] pointer-events-none" />
    </div>
  )
}


