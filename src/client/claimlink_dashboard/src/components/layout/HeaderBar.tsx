import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface HeaderBarProps {
  title?: string
  className?: string
}

export function HeaderBar({ title = "Dashboard", className }: HeaderBarProps) {
  return (
    <div className={cn("flex items-center justify-between px-6 py-0", className)}>
      <h1 className="font-['General_Sans'] font-medium text-[#222526] text-2xl leading-8">
        {title}
      </h1>
      <div className="flex items-center gap-2">
        {/* Wallet Button */}
        <div className="bg-white border border-[#e1e1e1] rounded-full px-4 py-2 flex items-center gap-2 h-[47px]">
          <div className="w-4 h-4 bg-orange-500 rounded-full" />
          <span className="font-['General_Sans'] text-sm">
            <span className="font-medium text-[#061937]">1'256</span>
            <span className="font-normal text-[#69737c] tracking-[0.7px]"> OGY</span>
          </span>
        </div>
        
        {/* Account Button */}
        <button className="bg-white border border-[#e1e1e1] rounded-full pl-1 pr-4 py-2 flex items-center gap-2 h-[47px]">
          <Avatar className="h-[39px] w-[39px]">
            <AvatarFallback className="bg-gray-300 relative">
              <div className="absolute inset-3 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-400" />
              </div>
            </AvatarFallback>
          </Avatar>
          <span className="font-['General_Sans'] text-sm">
            <span className="font-medium text-[#061937]">My Account:</span>
            <span className="font-normal text-[#69737c] tracking-[0.7px]"> 55vo...3dfa</span>
          </span>
        </button>
      </div>
    </div>
  )
}
