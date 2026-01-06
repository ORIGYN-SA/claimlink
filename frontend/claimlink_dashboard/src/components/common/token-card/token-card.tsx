import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TokenStatusBadge } from "../token-status-badge/token-status-badge";
import type { TokenCardProps } from "./token.types";

export function TokenCard({
  token,
  showCertifiedBadge = false,
  onClick,
  className,
  compact = false
}: TokenCardProps) {
  return (
    <Card
      className={cn(
        "bg-white border border-[#e1e1e1] rounded-[16px] p-2 md:p-3 gap-3 md:gap-4",
        compact
          ? "flex flex-col items-start justify-center w-full min-w-0 h-auto min-h-[220px] md:min-h-[280px]"
          : "flex flex-col items-start justify-center w-full min-w-0 h-auto min-h-[260px] md:min-h-[320px]",
        "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={() => onClick?.(token)}
    >
      {/* Image Container */}
      <div className={cn(
        "relative w-full rounded-[8px] overflow-hidden bg-[#060606] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.15)]",
        compact ? "h-28 md:h-40" : "h-32 md:h-48"
      )}>
        {token.imageUrl && (
          <img
            src={token.imageUrl}
            alt={token.title}
            className="w-full h-full object-cover"
          />
        )}

        {/* ORIGYN Certified Badge - only shown when showCertifiedBadge is true */}
        {showCertifiedBadge && (
          <div className="absolute top-2 right-2 bg-[rgba(34,37,38,0.1)] rounded-full p-2">
            <div className="w-3.5 h-3.5">
              {/* OGY Icon placeholder - you can replace with actual icon */}
              <div className="w-full h-full bg-[#615bff] rounded-sm" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 pb-1 md:pb-2 pt-1 px-1 w-full min-w-0 overflow-hidden">
        {/* Description */}
        <div className="flex flex-col gap-1 md:gap-2 w-full min-w-0">
          <div className="flex gap-2 items-start w-full min-w-0">
            <h3
              className="flex-1 text-sm md:text-lg font-normal text-[#222526] leading-tight md:leading-normal truncate min-w-0"
              title={token.title}
            >
              {token.title}
            </h3>
          </div>
          <p className="text-xs md:text-[14px] font-normal text-[#69737c] leading-tight md:leading-[18px] w-full truncate">
            {token.collectionName}
          </p>
        </div>

        {/* Legend - Date and Status */}
        <div className="flex items-center justify-between w-full gap-1 min-w-0">
          <span className="text-[11px] md:text-[13px] font-medium text-[#69737c] leading-normal shrink-0">
            {token.date}
          </span>
          <TokenStatusBadge status={token.status} className="shrink min-w-0" />
        </div>
      </div>
    </Card>
  );
}
