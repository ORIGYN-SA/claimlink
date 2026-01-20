/**
 * TemplateSectionCard Component
 *
 * Displays a template section with all its items
 * Used in the edit template step
 * Supports drag-and-drop reordering of items
 */

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/shared/ui/icons';
import type { TemplateSection, TemplateItem } from '@/features/templates/types/template.types';
import { SortableTemplateItemRow } from './sortable-template-item-row';
import { getSectionItems } from '@/features/templates/utils/template-utils';

interface TemplateSectionCardProps {
  section: TemplateSection;
  onAddItem?: (sectionId: string) => void;
  onEditItem?: (item: TemplateItem) => void;
  onDeleteItem?: (item: TemplateItem) => void;
  onInfoItem?: (item: TemplateItem) => void;
  onToggleSection?: (sectionId: string) => void;
  onReorderItems?: (sectionId: string, activeId: string, overId: string) => void;
}

export function TemplateSectionCard({
  section,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onInfoItem,
  onToggleSection,
  onReorderItems,
}: TemplateSectionCardProps) {
  const sortedItems = getSectionItems(section);

  // Configure drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorderItems?.(section.id, active.id as string, over.id as string);
    }
  };

  return (
    <Card className="p-4 sm:p-6 bg-[#f4f3f3] border-[#e1e1e1]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h2 className="text-base sm:text-lg font-medium text-[#222526]">{section.name}</h2>
            <span className="text-[10px] sm:text-xs text-[#69737c] px-2 py-1 bg-white rounded">
              {sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          {section.description && (
            <p className="text-xs sm:text-sm text-[#69737c] mt-1">{section.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Add Item Button */}
          {onAddItem && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddItem(section.id)}
              className="text-xs sm:text-sm"
            >
              <Icon.Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              Add Item
            </Button>
          )}

          {/* Toggle Collapse (if collapsible) */}
          {section.collapsible && onToggleSection && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleSection(section.id)}
            >
              <Icon.Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Section Items */}
      {!section.collapsed && (
        <div className="space-y-2 sm:space-y-4">
          {sortedItems.length === 0 ? (
            <div className="bg-white rounded-lg p-4 sm:p-8 text-center">
              <p className="text-[#69737c] text-xs sm:text-sm">
                No items in this section yet
              </p>
              {onAddItem && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddItem(section.id)}
                  className="mt-3 sm:mt-4 text-xs sm:text-sm"
                >
                  <Icon.Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                  Add First Item
                </Button>
              )}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedItems.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {sortedItems.map((item) => (
                  <SortableTemplateItemRow
                    key={item.id}
                    item={item}
                    onEdit={onEditItem}
                    onDelete={onDeleteItem}
                    onInfo={onInfoItem}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      )}

      {/* Collapsed State */}
      {section.collapsed && (
        <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
          <p className="text-[#69737c] text-xs sm:text-sm">
            Section collapsed - {sortedItems.length} items hidden
          </p>
        </div>
      )}
    </Card>
  );
}

