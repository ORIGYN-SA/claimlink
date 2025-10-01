import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  return (
    <Card className={cn(
      "bg-white border border-[#e1e1e1] rounded-[25px] overflow-hidden shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)]",
      className
    )}>
      <Table>
        <TableHeader className="bg-[#222526] border-b border-[#e1e1e1] [&_tr]:border-b-0">
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead 
                key={column.key}
                className="text-[13px] font-medium text-white h-[56px] px-6"
                style={{ width: column.width }}
              >
                {column.label}
              </TableHead>
            ))}
            {showMoreActions && (
              <TableHead className="w-[40px] px-6">
                {/* More actions header - empty for now */}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item, index) => (
            <TableRow
              key={item.id || index}
              className="cursor-pointer hover:bg-[#f9f9f9] border-b border-[#e1e1e1] last:border-b-0"
              onClick={() => onItemClick(item)}
            >
              {columns.map((column) => (
                <TableCell 
                  key={column.key}
                  className="px-6 py-4"
                >
                  {column.render ? (
                    column.render(item)
                  ) : (
                    <div className="text-[14px] font-normal text-[#69737c]">
                      {item[column.key]}
                    </div>
                  )}
                </TableCell>
              ))}

              {/* More Actions */}
              {showMoreActions && (
                <TableCell className="px-6 py-4 w-[40px]">
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
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
