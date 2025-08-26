import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
          dot: "#50be8f",
          bg: "#c7f2e0",
          variant: "default" as const
        }
      case "Transferred":
        return {
          dot: "#615bff",
          bg: "#ddddff",
          variant: "secondary" as const
        }
      case "Waiting":
        return {
          dot: "#e84c25",
          bg: "#ffcec2",
          variant: "destructive" as const
        }
      default:
        return {
          dot: "#69737c",
          bg: "#f2f2f2",
          variant: "outline" as const
        }
    }
  }

  const statusConfig = getStatusConfig(status)

  return (
    <Card className={cn("border border-[#e8e8e8]", className)}>
      <CardContent className="p-3">
        <div
          className="h-[201px] rounded-lg bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
            backgroundColor: imageUrl ? undefined : "#060606"
          }}
        />
        <div className="px-1 pt-1 pb-2">
          <div className="text-[18px] text-[#222526] leading-6">{title}</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-[13px] text-[#69737c]">{date}</div>
            <Badge
              variant="outline"
              className="bg-white rounded-full px-2 py-1 flex items-center gap-2 border border-[#e1e1e1] hover:bg-white"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: statusConfig.dot }}
              />
              <span className="text-[12px] text-[#222526]">{status}</span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
