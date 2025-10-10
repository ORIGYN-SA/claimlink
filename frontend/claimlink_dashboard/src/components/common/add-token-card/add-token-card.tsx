import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AddTokenCardProps {
  onClick?: () => void;
  title?: string;
  description?: string;
  variant?: 'vertical' | 'horizontal'; // New prop for layout style
  className?: string;
}

export function AddTokenCard({
  onClick,
  title = "Add an item",
  description = "Create a new item",
  variant = 'vertical',
  className
}: AddTokenCardProps) {
  // Vertical layout for certificates/NFTs (tall cards)
  if (variant === 'vertical') {
    return (
      <Card
        className={cn(
          "relative bg-[rgba(205,223,236,0.15)] border-dashed border-[#e1e1e1]",
          "flex flex-col items-center justify-center p-3 gap-4 rounded-[16px]",
          "cursor-pointer hover:bg-[rgba(205,223,236,0.25)] transition-colors",
          "h-[320px]",
          className
        )}
        onClick={onClick}
      >
        <div className="flex flex-col items-center gap-3.5 w-[226px]">
          {/* Plus Icon */}
          <div className="w-10 h-10 flex items-center justify-center bg-[#e1e1e1] rounded-full">
            <Plus className="w-6 h-6 text-[#69737c]" />
          </div>

          {/* Content */}
          <div className="flex flex-col items-center text-center w-full gap-2">
            <h3 className="text-[14px] font-medium text-[#061937] tracking-[0.7px] uppercase leading-[23px]">
              {title}
            </h3>
            <p className="text-[13px] font-light text-[#69737c] leading-normal">
              {description}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Horizontal layout for campaigns/templates (compact cards)
  return (
    <div
      className={cn(
        "cursor-pointer transition-all duration-200 hover:bg-[rgba(205,223,236,0.15)]",
        "bg-[rgba(205,223,236,0.08)] border-dashed border-2 border-[#cde9ec]",
        "box-border flex gap-[16px] items-center px-[12px] py-[9px]",
        "relative rounded-[16px] min-h-[94px]",
        className
      )}
      onClick={onClick}
    >
      {/* Plus Icon - matching campaign card image size */}
      <div className="relative w-[76px] h-[76px] shrink-0 flex items-center justify-center">
        <div className="w-10 h-10 flex items-center justify-center bg-[#cde9ec] rounded-full">
          <Plus className="w-6 h-6 text-[#69737c]" />
        </div>
      </div>

      {/* Content - matching campaign card layout */}
      <div className="flex flex-row items-center self-stretch min-w-0 flex-1">
        <div className="content-stretch flex flex-col h-full items-start justify-center relative shrink-0 min-w-0 flex-1 gap-1">
          <h3 className="text-[14px] font-medium text-[#061937] tracking-[0.7px] uppercase leading-[23px]">
            {title}
          </h3>
          <p className="text-[13px] font-light text-[#69737c] leading-normal">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
