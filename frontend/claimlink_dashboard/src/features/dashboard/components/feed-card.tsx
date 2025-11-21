import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface FeedCardProps {
  title: string
  id?: string
  className?: string
}

export function FeedCard({ title, id = "65d32901f244eeb354d4b2df", className }: FeedCardProps) {
  return (
    <div className={cn("flex items-center gap-4 py-4", className)}>
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-[#061937]" />
        </Avatar>
        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white border border-[#e1e1e1]" />
      </div>
      <div>
        <div className="text-base leading-6 text-[#061937]">{title}</div>
        <div className="text-[13px] text-[#69737c] leading-none">
          {id}
        </div>
      </div>
    </div>
  )
}
