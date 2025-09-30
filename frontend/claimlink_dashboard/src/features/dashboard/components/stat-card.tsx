import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { StatCardProps } from "../types/dashboard.types";
import { MoveDownRight, MoveUpRight, Info } from "lucide-react";

// interface StatCardProps {
//   title: string
//   value: string
//   trend: string
//   trendColor: "green" | "red"
//   icon?: React.ReactNode
//   className?: string
// }

export function StatCard({
  title,
  value,
  trend,
  trendColor,
  icon,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("border border-[#e8e8e8] rounded-2xl bg-white py-4", className)}>
      <CardContent >
        {/* Header with Icon and Title */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-1 min-w-0 flex-1">
            {icon && (
              <div className="w-4 h-4 text-[#69737c] flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="font-sans font-medium text-[#69737c] text-[13px] leading-normal truncate">
              {title}
            </div>
          </div>
          {/* Info tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3 h-3 text-[#69737c] opacity-50 cursor-help flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Additional information about {title}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Value and Trend */}
        <div className="flex items-center gap-2">
          <div className="font-sans font-medium text-[#222526] text-[48px] leading-[56px]">
            {value}
          </div>
          <div 
            className={cn(
              "flex items-center gap-1 px-1.5 py-1 rounded-full border",
              trendColor === "green" 
                ? "bg-[#50be8f] border-[#50be8f]" 
                : "bg-[#e84c25] border-[#e84c25]"
            )}
          >
            {/* Trend Arrow */}
            <div className="w-3 h-3 flex items-center justify-center">
              {trendColor === "green" ? (
                <MoveUpRight className="w-full h-full text-white" />
              ) : (
                <MoveDownRight className="w-full h-full text-white" />
              )}
            </div>
            <span className="font-sans font-medium text-white text-[10px] leading-normal">
              {trend}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
