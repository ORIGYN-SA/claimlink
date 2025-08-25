// shared/components/stat-card/StatCard.tsx
import { Card } from "@shared/ui/card/Card";
import { Badge } from "@shared/ui/badge/Badge";
import Icon from "@shared/ui/icons";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
}

export const StatCard = ({ title, value, trend }: StatCardProps) => {
  return (
    <Card variant="bordered">
      <div className="text-[14px] text-[#000]">{title}</div>
      <div className="mt-2 flex items-center gap-2">
        <div className="text-[48px] leading-[56px] text-[#222526]">{value}</div>
        {trend && (
          <Badge
            variant={trend.direction === "up" ? "success" : "error"}
            dot={false}
          >
            {trend.direction === "up" ? (
              <Icon.TrendingDown />
            ) : (
              <Icon.TrendingDown />
            )}
            {trend.value}
          </Badge>
        )}
      </div>
    </Card>
  );
};
