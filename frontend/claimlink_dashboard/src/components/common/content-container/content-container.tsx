import { cn } from "@/lib/utils";
import { ViewToggle, type ViewMode } from "../view-toggle";

interface ContentContainerProps {
  title: string;
  totalCount: number;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  showViewToggle?: boolean; // Controls whether view toggle is shown
  actionButton?: React.ReactNode; // Optional action button for top right
  className?: string;
  children: React.ReactNode;
}

export function ContentContainer({
  title,
  totalCount,
  viewMode = 'grid',
  onViewModeChange,
  showViewToggle = true,
  actionButton,
  className,
  children
}: ContentContainerProps) {
  return (
    <div className={cn(
      "bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] border border-[#f2f2f2] rounded-[16px] overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="bg-white border-b border-[#f2f2f2] p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-medium text-[#222526] leading-normal">
              {title} <span className="text-[#69737c]">({totalCount})</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {actionButton}
            
            {/* View Toggle */}
            {showViewToggle && onViewModeChange && (
              <ViewToggle
                viewMode={viewMode}
                onViewModeChange={onViewModeChange}
                showListView={true}
              />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-4">
        {children}
      </div>
    </div>
  );
}
