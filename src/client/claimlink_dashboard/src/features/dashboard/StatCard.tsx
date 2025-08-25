import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StatCardProps } from "./types";

export function StatCard({
  title,
  value,
  trend,
  trendColor,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]", className)}>
      <CardContent className="p-4">
        <div className="text-[14px] text-[#000]">{title}</div>
        <div className="mt-2 flex items-center gap-2">
          <div className="text-[48px] leading-[56px] text-[#222526]">
            {value}
          </div>
          <Badge
            variant={trendColor === "green" ? "default" : "destructive"}
            className={cn(
              "text-white border",
              trendColor === "green"
                ? "bg-[#50be8f] border-[#50be8f] hover:bg-[#50be8f]/90"
                : "bg-[#e84c25] border-[#e84c25] hover:bg-[#e84c25]/90",
            )}
          >
            <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-1 text-[10px] leading-none">
              {trend}
            </span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
