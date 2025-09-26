import { StandardizedGridView } from "../standardized-grid-view";
import { StandardizedListView, type ListColumn } from "../standardized-list-view";
import { ContentContainer } from "./content-container";
import { type ViewMode } from "../view-toggle";
import type { BaseToken } from "../token-card/token.types";

interface StandardizedGridListContainerProps {
  // Container props
  title: string;
  totalCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showViewToggle?: boolean;
  actionButton?: React.ReactNode;
  
  // Data and actions
  items: any[];
  onItemClick: (item: any) => void;
  onAddItem: () => void;
  
  // Grid view props
  showCertifiedBadge?: boolean;
  addButtonText?: string;
  addButtonDescription?: string;
  showAddButton?: boolean;
  gridCols?: string;
  
  // List view props
  listColumns?: ListColumn[];
  addItemText?: string;
  showMoreActions?: boolean;
  onMoreActionsClick?: (item: any) => void;
  
  // Coming soon placeholder for list view
  listViewComingSoon?: boolean;
  
  className?: string;
}

export function StandardizedGridListContainer({
  // Container props
  title,
  totalCount,
  viewMode,
  onViewModeChange,
  showViewToggle = true,
  actionButton,
  
  // Data and actions
  items,
  onItemClick,
  onAddItem,
  
  // Grid view props
  showCertifiedBadge = false,
  addButtonText = "Add an item",
  addButtonDescription = "Create a new item",
  showAddButton = true,
  gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  
  // List view props
  listColumns = [],
  addItemText = "Create your first item",
  showMoreActions = true,
  onMoreActionsClick,
  
  // Coming soon placeholder
  listViewComingSoon = false,
  
  className
}: StandardizedGridListContainerProps) {
  return (
    <ContentContainer
      title={title}
      totalCount={totalCount}
      viewMode={viewMode}
      onViewModeChange={onViewModeChange}
      showViewToggle={showViewToggle}
      actionButton={actionButton}
      className={className}
    >
      {viewMode === 'grid' ? (
        <StandardizedGridView
          items={items as BaseToken[]}
          showCertifiedBadge={showCertifiedBadge}
          onItemClick={onItemClick}
          onAddItem={onAddItem}
          addButtonText={addButtonText}
          addButtonDescription={addButtonDescription}
          showAddButton={showAddButton}
          gridCols={gridCols}
        />
      ) : (
        listViewComingSoon ? (
          <div className="text-center py-8 text-[#69737c]">
            List view coming soon...
          </div>
        ) : (
          <StandardizedListView
            items={items}
            columns={listColumns}
            onItemClick={onItemClick}
            onAddItem={onAddItem}
            addItemText={addItemText}
            showMoreActions={showMoreActions}
            onMoreActionsClick={onMoreActionsClick}
          />
        )
      )}
    </ContentContainer>
  );
}
