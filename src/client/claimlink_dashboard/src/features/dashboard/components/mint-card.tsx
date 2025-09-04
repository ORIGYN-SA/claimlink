import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MintCardProps {
  title: string
  status: "Minted" | "Transferred" | "Waiting"
  date?: string
  imageUrl?: string
  className?: string
}

export function MintCard({
  title,
  status,
  date = "20 Feb, 2024",
  imageUrl,
  className
}: MintCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Minted":
        return {
          dot: "#50be8f", // Jade
          border: "#c7f2e0", // Jade 90
        }
      case "Transferred":
        return {
          dot: "#615bff", // Space Purple
          border: "#dddbff", // Space Purple lighter
        }
      case "Waiting":
        return {
          dot: "#ff55c5", // Candy Floss
          border: "#ffd4f0", // Candy Floss 95
        }
      default:
        return {
          dot: "#69737c", // Slate
          border: "#e1e1e1", // Mouse
        }
    }
  }

  const statusConfig = getStatusConfig(status)

  return (
    <Card className={cn("border border-[#e8e8e8] rounded-2xl bg-white", className)}>
      <CardContent className="px-3 py-[9px] flex flex-col gap-4">
        {/* Image */}
        <div className="relative w-full">
          <div
            className="h-[201px] w-full rounded-lg bg-center bg-cover bg-no-repeat"
            style={{
              backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
              backgroundColor: imageUrl ? undefined : "#060606"
            }}
          />
        </div>
        
        {/* Content */}
        <div className="px-1 pt-1 pb-2 flex flex-col gap-1">
          <div className="flex flex-col gap-2">
            <div className="font-['General_Sans'] font-normal text-[#222526] text-lg leading-6 w-full">
              {title}
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="font-['General_Sans'] font-medium text-[#69737c] text-[13px] leading-normal">
              {date}
            </div>
            <div 
              className="bg-white border border-[rgba(225,225,225,0.5)] rounded-full px-2 py-1 flex items-center gap-2 h-8"
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ 
                  backgroundColor: statusConfig.dot,
                  border: `1px solid ${statusConfig.border}`
                }}
              />
              <span className="font-['General_Sans'] font-medium text-[#222526] text-xs leading-normal">
                {status}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
