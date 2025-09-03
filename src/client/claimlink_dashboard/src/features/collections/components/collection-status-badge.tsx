import { cn } from "@/lib/utils";
import type { CollectionStatus } from "../types/collection.types";

interface CollectionStatusBadgeProps {
  status: CollectionStatus;
  className?: string;
}

export function CollectionStatusBadge({ status, className }: CollectionStatusBadgeProps) {
  const getStatusConfig = (status: CollectionStatus) => {
    switch (status) {
      case 'Active':
        return {
          text: 'Active',
          className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
          dotColor: 'bg-[#50be8f]',
          dotBorder: 'border-[#c7f2e0]'
        };
      case 'Inactive':
        return {
          text: 'Inactive',
          className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
          dotColor: 'bg-[#ff55c5]',
          dotBorder: 'border-[#ffd4f0]'
        };
      case 'Draft':
        return {
          text: 'Draft',
          className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
          dotColor: 'bg-[#615bff]',
          dotBorder: 'border-[#dddbff]'
        };
      default:
        return {
          text: status,
          className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
          dotColor: 'bg-gray-500',
          dotBorder: 'border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={cn(
      "flex items-center gap-2 px-2 py-1 rounded-full border border-solid",
      config.className,
      className
    )}>
      <div className={cn(
        "w-2.5 h-2.5 rounded-full border",
        config.dotColor,
        config.dotBorder
      )} />
      <span className="text-[12px] font-medium leading-normal whitespace-nowrap">
        {config.text}
      </span>
    </div>
  );
}
