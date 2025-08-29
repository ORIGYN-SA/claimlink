import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

interface HeaderBarProps {
  title?: string
  className?: string
  showBackButton?: boolean
  backTo?: string
}

export function HeaderBar({ title = "Dashboard", className, showBackButton = false, backTo }: HeaderBarProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate({ to: backTo });
    } else {
      navigate({ to: '/dashboard' });
    }
  };

  return (
    <div className={cn("flex items-center justify-between px-6 py-0", className)}>
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 text-[#222526] hover:bg-[#f0f0f0]"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <h1 className="font-['General_Sans'] font-medium text-[#222526] text-2xl leading-8">
          {title}
        </h1>
      </div>
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
