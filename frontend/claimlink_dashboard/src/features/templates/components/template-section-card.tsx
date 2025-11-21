/**
 * TemplateSectionCard Component
 * 
 * Displays a template section with all its items
 * Used in the edit template step
 */

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/shared/ui/icons';
import type { TemplateSection, TemplateItem } from '@/features/templates/types/template-structure.types';
import { TemplateItemRow } from './template-item-row';
import { getSectionItems } from '@/features/templates/utils/template-utils';

interface TemplateSectionCardProps {
  section: TemplateSection;
  onAddItem?: (sectionId: string) => void;
  onEditItem?: (item: TemplateItem) => void;
  onDeleteItem?: (item: TemplateItem) => void;
  onInfoItem?: (item: TemplateItem) => void;
  onToggleSection?: (sectionId: string) => void;
}

export function TemplateSectionCard({
  section,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onInfoItem,
  onToggleSection,
}: TemplateSectionCardProps) {
  const sortedItems = getSectionItems(section);

  return (
    <Card className="p-6 bg-[#f4f3f3] border-[#e1e1e1]">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium text-[#222526]">{section.name}</h2>
            <span className="text-xs text-[#69737c] px-2 py-1 bg-white rounded">
              {sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          {section.description && (
            <p className="text-sm text-[#69737c] mt-1">{section.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Add Item Button */}
          {onAddItem && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddItem(section.id)}
            >
              <Icon.Plus className="w-4 h-4 mr-1" />
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
              <Icon.Menu className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Section Items */}
      {!section.collapsed && (
        <div className="space-y-4">
          {sortedItems.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-[#69737c] text-sm">
                No items in this section yet
              </p>
              {onAddItem && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddItem(section.id)}
                  className="mt-4"
                >
                  <Icon.Plus className="w-4 h-4 mr-2" />
                  Add First Item
                </Button>
              )}
            </div>
          ) : (
            sortedItems.map((item) => (
              <TemplateItemRow
                key={item.id}
                item={item}
                onEdit={onEditItem}
                onDelete={onDeleteItem}
                onInfo={onInfoItem}
              />
            ))
          )}
        </div>
      )}

      {/* Collapsed State */}
      {section.collapsed && (
        <div className="bg-white rounded-lg p-4 text-center">
          <p className="text-[#69737c] text-sm">
            Section collapsed - {sortedItems.length} items hidden
          </p>
        </div>
      )}
    </Card>
  );
}

