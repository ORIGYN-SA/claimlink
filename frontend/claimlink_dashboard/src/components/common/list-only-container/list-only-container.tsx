import { StandardizedListView, type ListColumn } from "../standardized-list-view";

interface ListOnlyContainerProps {
  title: string;
  totalCount: number;
  items: any[];
  columns: ListColumn[];
  onItemClick: (item: any) => void;
  onAddItem?: () => void;
  addItemText?: string;
  showMoreActions?: boolean;
  onMoreActionsClick?: (item: any) => void;
  className?: string;
}

export function ListOnlyContainer({
  title,
  totalCount,
  items,
  columns,
  onItemClick,
  onAddItem,
  addItemText = "Create your first item",
  showMoreActions = true,
  onMoreActionsClick,
  className
}: ListOnlyContainerProps) {
  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-[#222526]">
            {title} <span className="text-[#69737c]">({totalCount})</span>
          </h3>
        </div>
      </div>

      {/* List View */}
      <StandardizedListView
        items={items}
        columns={columns}
        onItemClick={onItemClick}
        onAddItem={onAddItem}
        addItemText={addItemText}
        showMoreActions={showMoreActions}
        onMoreActionsClick={onMoreActionsClick}
        className={className}
      />
    </div>
  );
}
