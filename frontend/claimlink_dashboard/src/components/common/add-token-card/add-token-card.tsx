import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AddTokenCardProps {
  onClick?: () => void;
  title?: string;
  description?: string;
  className?: string;
}

export function AddTokenCard({
  onClick,
  title = "Add an item",
  description = "Create a new item",
  className
}: AddTokenCardProps) {
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
