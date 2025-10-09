/**
 * TemplateItemRow Component
 * 
 * Displays a single template item in the edit template view
 * Shows item label, type, and action buttons
 */

import { Button } from '@/components/ui/button';
import Icon from '@/shared/ui/icons';
import type { TemplateItem } from '@/features/templates/types/template-structure.types';
import { getItemTypeDisplayName, getItemTypeIcon } from '@/features/templates/utils/template-utils';

interface TemplateItemRowProps {
  item: TemplateItem;
  onEdit?: (item: TemplateItem) => void;
  onDelete?: (item: TemplateItem) => void;
  onInfo?: (item: TemplateItem) => void;
  isDragging?: boolean;
}

export function TemplateItemRow({
  item,
  onEdit,
  onDelete,
  onInfo,
  isDragging = false,
}: TemplateItemRowProps) {
  const typeDisplayName = getItemTypeDisplayName(item.type);
  const iconName = getItemTypeIcon(item.type);

  // Render icon based on type
  const renderIcon = () => {
    // For title type, show "Tt" text
    if (item.type === 'title') {
      return <span className="text-white font-bold text-lg">Tt</span>;
    }

    // For other types, use Icon component
    const IconComponent = Icon[iconName as keyof typeof Icon] || Icon.Mint;
    return <IconComponent size={24} className="w-6 h-6 text-white" />;
  };

  return (
    <div
      className={`bg-white rounded-lg p-4 flex items-center justify-between transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Drag Handle */}
        <div className="cursor-grab active:cursor-grabbing">
          <Icon.Menu className="text-[#e1e1e1]" />
        </div>

        {/* Icon */}
        <div className="w-12 h-12 bg-[#222526] rounded-lg flex items-center justify-center flex-shrink-0">
          {renderIcon()}
        </div>

        {/* Item Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-[#222526] truncate">{item.label}</p>
            {item.required && (
              <span className="text-red-500 text-sm">*</span>
            )}
            {item.immutable && (
              <span className="text-xs text-[#69737c] px-2 py-0.5 bg-[#f1f6f9] rounded">
                Immutable
              </span>
            )}
          </div>
          <p className="text-sm text-[#69737c]">{typeDisplayName}</p>
          {item.description && (
            <p className="text-xs text-[#69737c] mt-1">{item.description}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {onInfo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onInfo(item)}
            title="View details"
          >
            <Icon.InfoCircle className="w-4 h-4" />
          </Button>
        )}
        {onEdit && !item.immutable && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item)}
            title="Edit item"
          >
            <Icon.Mint className="w-4 h-4" />
          </Button>
        )}
        {onDelete && !item.immutable && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item)}
            title="Delete item"
          >
            <Icon.Close className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

