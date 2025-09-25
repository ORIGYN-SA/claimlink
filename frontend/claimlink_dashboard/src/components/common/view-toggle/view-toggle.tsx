import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showListView?: boolean; // Some pages only need grid view
  className?: string;
}

export function ViewToggle({
  viewMode,
  onViewModeChange,
  showListView = true,
  className
}: ViewToggleProps) {
  if (!showListView) {
    return null; // Don't render toggle if only grid view is needed
  }

  return (
    <div className={cn(
      "bg-[#fcfafa] border border-[#e1e1e1] rounded-full p-1 flex gap-0.5",
      className
    )}>
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className={cn(
          "rounded-full p-1 w-8 h-8",
          viewMode === 'grid'
            ? "bg-[#061937] text-white"
            : "bg-[#fcfafa] text-[#69737c] hover:bg-[#f0f0f0]"
        )}
      >
        <Grid className="w-4 h-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className={cn(
          "rounded-full p-1 w-8 h-8",
          viewMode === 'list'
            ? "bg-[#061937] text-white"
            : "bg-[#fcfafa] text-[#69737c] hover:bg-[#f0f0f0]"
        )}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
}
