import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface HeaderBarProps {
  className?: string
}

export function HeaderBar({ className }: HeaderBarProps) {
  return (
    <div className={cn("flex items-center justify-between px-6 py-0", className)}>
      <h1 className="text-[24px] leading-8 text-[#222526]">Dashboard</h1>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="lg"
          className="bg-white h-[47px] rounded-full px-4 flex items-center gap-2 border border-[#e1e1e1]"
        >
          <span className="h-4 w-4 rounded bg-[#061937]" />
          <span className="text-[14px] text-[#061937]">1'256</span>
          <span className="text-[14px] text-[#69737c] tracking-[0.7px]">
            OGY
          </span>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="bg-white h-[47px] rounded-full pl-1 pr-4 flex items-center gap-2 border border-[#e1e1e1]"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-[#061937]" />
          </Avatar>
          <span className="text-[14px] text-[#061937]">My Account:</span>
          <span className="text-[14px] text-[#69737c] tracking-[0.7px]">
            55vo...3dfa
          </span>
        </Button>
      </div>
    </div>
  )
}
