import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CollectionStatusBadge } from "./collection-status-badge";
import type { Collection } from "../types/collection.types";

interface CollectionCardProps {
  collection: Collection;
  onClick?: (collection: Collection) => void;
  className?: string;
}

export function CollectionCard({ collection, onClick, className }: CollectionCardProps) {
  return (
    <Card
      className={cn(
        "bg-white border border-[#e1e1e1] rounded-[16px] p-3 gap-4",
        "flex flex-col items-start justify-center w-[257.5px] h-[320px]",
        "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={() => onClick?.(collection)}
    >
      {/* Image Container */}
      <div className="relative w-[233.5px] h-[233.434px] rounded-[8px] overflow-hidden bg-[#060606] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.15)]">
        <img
          src={collection.imageUrl}
          alt={collection.title}
          className="w-full h-full object-cover"
        />

        {/* ORIGYN Certified Badge */}
        <div className="absolute top-2 right-2 bg-[rgba(34,37,38,0.1)] rounded-full p-2">
          <div className="w-3.5 h-3.5">
            {/* OGY Icon placeholder - you can replace with actual icon */}
            <div className="w-full h-full bg-[#615bff] rounded-sm" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 pb-2 pt-1 px-1 w-full">
        {/* Description */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2 items-start w-full">
            <h3 className="flex-1 text-[18px] font-normal text-[#222526] leading-normal">
              {collection.title}
            </h3>
          </div>
          <p className="text-[14px] font-normal text-[#69737c] leading-[18px] w-full line-clamp-2">
            {collection.description}
          </p>
          <p className="text-[13px] font-medium text-[#69737c] leading-normal">
            {collection.itemCount} items
          </p>
        </div>

        {/* Legend - Date and Status */}
        <div className="flex items-center justify-between w-full">
          <span className="text-[13px] font-medium text-[#69737c] leading-normal">
            {collection.lastModified}
          </span>
          <CollectionStatusBadge status={collection.status} />
        </div>
      </div>
    </Card>
  );
}
