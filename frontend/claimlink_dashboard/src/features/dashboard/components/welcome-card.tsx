// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface WelcomeCardProps {
  className?: string
}

export function WelcomeCard({ className }: WelcomeCardProps) {
  return (
    <div className={cn(
      "p-8 rounded-2xl shadow-[0_2px_4px_0_rgba(0,0,0,0.15),0_2px_4px_0_rgba(0,0,0,0.05)] text-white border-none w-[346px]",
      "bg-gradient-to-br from-[#061937] via-[#0b2d6a] to-[#1e3a8a]",
      className
    )}>
      {/* Welcome Back Tag */}
      <div className="flex items-center justify-start mb-8">
        <div className="bg-[#85f1ff] rounded-full px-2 py-1">
          <span className="font-['General_Sans'] font-medium text-[#061937] text-[10px] leading-[23px] tracking-[1px] uppercase">
            welcome back
          </span>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col mb-8">
        <h2 className="font-['General_Sans'] font-light text-white text-[40px] leading-[48px] mb-2">
          What do you want to mint?
        </h2>
        <p className="font-['General_Sans'] font-normal text-white text-base leading-6 tracking-[0.8px] h-[52px]">
          Today is a good day to mint some great stuff.
        </p>
      </div>
      
      {/* Button */}
      <div className="flex items-center justify-start">
        <button className="bg-white rounded-[20px] h-14 pl-6 pr-3 py-3 flex items-center justify-end gap-2.5 shadow-[0_4px_24px_0_rgba(0,0,0,0.15)] hover:bg-white/95 transition-colors">
          <span className="font-['General_Sans'] font-normal text-[#222526] text-sm leading-4 text-center">
            NFT
          </span>
          <div className="w-8 h-8 bg-gradient-to-br from-[#061937] to-[#1e3a8a] rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <path d="M8 4L12 8L8 12M4 8H12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
      </div>
    </div>
  )
}
