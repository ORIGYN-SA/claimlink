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
        <h1 className="font-['General_Sans:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#222526] text-[24px] text-nowrap">
          <p className="leading-[32px] whitespace-pre">{title}</p>
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {/* Wallet Button */}
        <div className="bg-white box-border content-stretch flex gap-2 items-center justify-start px-4 py-2 relative rounded-[100px] h-[47px] shrink-0">
          <div aria-hidden="true" className="absolute border border-[#e1e1e1] border-solid inset-0 pointer-events-none rounded-[100px]" />
          <div className="relative shrink-0 size-4">
            <div className="absolute inset-0">
              {/* OGY Icon placeholder - you may need to import the actual OGY icon */}
              <div className="w-full h-full bg-[#615bff] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">O</span>
              </div>
            </div>
          </div>
          <div className="font-['General_Sans:Semibold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#061937] text-[0px] text-nowrap">
            <p className="text-[14px] whitespace-pre">
              <span className="font-['General_Sans:Medium',_sans-serif] leading-[16px] not-italic">1'256</span>
              <span className="leading-[16px]"> </span>
              <span className="font-['General_Sans:Regular',_sans-serif] leading-[24px] not-italic text-[#69737c] tracking-[0.7px]">OGY</span>
            </p>
          </div>
        </div>
        
        {/* Account Button */}
        <button className="bg-white box-border content-stretch cursor-pointer flex gap-2 h-[47px] items-center justify-start overflow-visible pl-1 pr-4 py-2 relative rounded-[100px] shrink-0">
          <div aria-hidden="true" className="absolute border border-[#e1e1e1] border-solid inset-0 pointer-events-none rounded-[100px]" />
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
            <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[39px]">
              <div className="w-full h-full bg-gray-300 rounded-full"></div>
            </div>
            <div className="[grid-area:1_/_1] ml-3 mt-3 relative size-4">
              <div className="absolute inset-[14.29%_17.17%_7.14%_14.29%]">
                <div className="absolute inset-[-6.82%_-7.82%]">
                  {/* Certificate owner icon placeholder */}
                  <div className="w-full h-full bg-[#69737c] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="font-['DM_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#222526] text-[0px] text-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
            <p className="not-italic text-[14px] whitespace-pre">
              <span className="font-['General_Sans:Medium',_sans-serif] leading-[16px] text-[#061937]">My Account:</span>
              <span className="font-['General_Sans:Semibold',_sans-serif] leading-[16px]"> </span>
              <span className="font-['General_Sans:Regular',_sans-serif] leading-[24px] text-[#69737c] tracking-[0.7px]">55vo...3dfa</span>
            </p>
          </div>
        </button>
      </div>
    </div>
  )
}
