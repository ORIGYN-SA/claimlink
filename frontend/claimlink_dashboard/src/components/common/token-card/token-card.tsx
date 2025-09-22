import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TokenStatusBadge } from "../token-status-badge/token-status-badge";
import type { TokenCardProps } from "./token.types";

export function TokenCard({
  token,
  showCertifiedBadge = false,
  onClick,
  className
}: TokenCardProps) {
  return (
    <Card
      className={cn(
        "bg-white border border-[#e1e1e1] rounded-[16px] p-3 gap-4",
        "flex flex-col items-start justify-center w-[257.5px] h-[320px]",
        "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={() => onClick?.(token)}
    >
      {/* Image Container */}
      <div className="relative w-[233.5px] h-[233.434px] rounded-[8px] overflow-hidden bg-[#060606] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.15)]">
        <img
          src={token.imageUrl}
          alt={token.title}
          className="w-full h-full object-cover"
        />

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
      <div className="flex flex-col gap-1 pb-2 pt-1 px-1 w-full">
        {/* Description */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2 items-start w-full">
            <h3 className="flex-1 text-lg font-normal text-[#222526] leading-normal">
              {token.title}
            </h3>
          </div>
          <p className="text-[14px] font-normal text-[#69737c] leading-[18px] w-full">
            {token.collectionName}
          </p>
        </div>

        {/* Legend - Date and Status */}
        <div className="flex items-center justify-between w-full">
          <span className="text-[13px] font-medium text-[#69737c] leading-normal">
            {token.date}
          </span>
          <TokenStatusBadge status={token.status} />
        </div>
      </div>
    </Card>
  );
}
