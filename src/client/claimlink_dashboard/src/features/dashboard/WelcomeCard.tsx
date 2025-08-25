import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface WelcomeCardProps {
  className?: string
}

export function WelcomeCard({ className }: WelcomeCardProps) {
  return (
    <Card className={cn(
      "shadow-[0_2px_4px_0_rgba(0,0,0,0.15),0_2px_4px_0_rgba(0,0,0,0.05)] bg-[radial-gradient(120%_120%_at_0%_0%,#061937_0%,#0b2d6a_60%,#1e3a8a_100%)] text-white border-none",
      className
    )}>
      <CardContent className="p-8">
        <div>
          <Badge className="uppercase tracking-[1px] text-[10px] text-[#061937] bg-[#85f1ff] hover:bg-[#85f1ff]/90 rounded-full px-2 py-1 mb-4 border-none">
            welcome back
          </Badge>
        </div>
        <h3 className="text-[40px] leading-[48px]">What do you want to mint?</h3>
        <p className="text-[16px] leading-6 opacity-80 mt-2">
          Today is a good day to mint some great stuff.
        </p>
        <div className="mt-6">
          <Button className="bg-white text-[#222526] h-14 px-6 rounded-[20px] shadow-[0_4px_24px_0_rgba(0,0,0,0.15)] hover:bg-white/90">
            <span className="text-[14px]">NFT</span>
            <span className="inline-block h-8 w-8 rounded-full bg-[#061937]" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
