import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StatCardProps } from "../types/dashboard.types";

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
    <Card className={cn("border border-[#e8e8e8] rounded-2xl bg-white", className)}>
      <CardContent className="p-4">
        {/* Header with Icon and Title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {icon && (
              <div className="w-4 h-4 text-[#69737c]">
                {icon}
              </div>
            )}
            <div className="font-sans font-medium text-[#69737c] text-[13px] leading-normal">
              {title}
            </div>
          </div>
          {/* Info tooltip icon */}
          <div className="w-3 h-3 opacity-50">
            <svg viewBox="0 0 13 13" fill="none" className="w-full h-full">
              <circle cx="6.5" cy="6.5" r="5.5" stroke="#69737c" strokeWidth="1"/>
              <text x="6.5" y="9" fontSize="8" fill="#69737c" textAnchor="middle" fontFamily="General Sans">i</text>
            </svg>
          </div>
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
            <div className="w-1.5 h-1.5 flex items-center justify-center">
              <div 
                className={cn(
                  "transform",
                  trendColor === "green" ? "rotate-180 scale-y-[-1]" : "rotate-180"
                )}
              >
                <svg viewBox="0 0 6 6" fill="white" className="w-full h-full">
                  <path d="M3 1L4.5 4H1.5L3 1Z" />
                </svg>
              </div>
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
