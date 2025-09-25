import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ListColumn {
  key: string;
  label: string;
  width?: string; // CSS width class
  render?: (item: any) => React.ReactNode;
}

interface StandardizedListViewProps {
  items: any[];
  columns: ListColumn[];
  onItemClick: (item: any) => void;
  onAddItem?: () => void;
  addItemText?: string;
  showMoreActions?: boolean;
  onMoreActionsClick?: (item: any) => void;
  className?: string;
}

export function StandardizedListView({
  items,
  columns,
  onItemClick,
  onAddItem,
  addItemText = "Create your first item",
  showMoreActions = true,
  onMoreActionsClick,
  className
}: StandardizedListViewProps) {
  // Generate grid columns based on column configuration
  const gridCols = columns.map(col => col.width || 'auto').join(' ');
  const gridColsWithActions = showMoreActions 
    ? `${gridCols} 40px`
    : gridCols;

  return (
    <Card className={cn(
      "bg-white border border-[#e1e1e1] rounded-[25px] overflow-hidden shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)]",
      className
    )}>
      {/* Table Header */}
      <div className="bg-[#222526] border-b border-[#e1e1e1] px-6 py-4">
        <div 
          className="grid gap-4 items-center"
          style={{ gridTemplateColumns: gridColsWithActions }}
        >
          {columns.map((column) => (
            <div 
              key={column.key}
              className="text-[13px] font-medium text-white"
            >
              {column.label}
            </div>
          ))}
          {showMoreActions && (
            <div className="flex justify-center">
              {/* More actions header - empty for now */}
            </div>
          )}
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-[#e1e1e1]">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="px-6 py-4 hover:bg-[#f9f9f9] cursor-pointer transition-colors"
            onClick={() => onItemClick(item)}
          >
            <div 
              className="grid gap-4 items-center"
              style={{ gridTemplateColumns: gridColsWithActions }}
            >
              {columns.map((column) => (
                <div key={column.key}>
                  {column.render ? (
                    column.render(item)
                  ) : (
                    <div className="text-[14px] font-normal text-[#69737c]">
                      {item[column.key]}
                    </div>
                  )}
                </div>
              ))}

              {/* More Actions */}
              {showMoreActions && (
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 rounded-full hover:bg-[#f0f0f0]"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoreActionsClick?.(item);
                    }}
                  >
                    <MoreHorizontal className="w-4 h-4 text-[#69737c]" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="text-[#69737c] text-[14px]">
            No items found.{' '}
            {onAddItem && (
              <button
                onClick={onAddItem}
                className="text-[#061937] font-medium hover:underline"
              >
                {addItemText}
              </button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
