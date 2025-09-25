import { TokenCard } from "../token-card/token-card";
import { AddTokenCard } from "../add-token-card/add-token-card";
import type { BaseToken } from "../token-card/token.types";
import { cn } from "@/lib/utils";

interface StandardizedGridViewProps {
  items: BaseToken[];
  showCertifiedBadge?: boolean;
  onItemClick: (item: BaseToken) => void;
  onAddItem: () => void;
  addButtonText?: string;
  addButtonDescription?: string;
  showAddButton?: boolean; // Controls whether add button is shown
  gridCols?: string; // Allow customization of grid columns
  className?: string;
}

export function StandardizedGridView({
  items,
  showCertifiedBadge = false,
  onItemClick,
  onAddItem,
  addButtonText = "Add an item",
  addButtonDescription = "Create a new item",
  showAddButton = true,
  gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  className
}: StandardizedGridViewProps) {
  return (
    <div className={cn(
      `grid ${gridCols} gap-4`,
      className
    )}>
      {/* Add Item Card - conditionally rendered and always first */}
      {showAddButton && (
        <AddTokenCard
          onClick={onAddItem}
          title={addButtonText}
          description={addButtonDescription}
        />
      )}

      {/* Item Cards */}
      {items.map((item) => (
        <TokenCard
          key={item.id}
          token={item}
          showCertifiedBadge={showCertifiedBadge}
          onClick={onItemClick}
        />
      ))}
    </div>
  );
}
