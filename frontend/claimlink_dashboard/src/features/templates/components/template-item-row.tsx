/**
 * TemplateItemRow Component
 * 
 * Displays a single template item in the edit template view
 * Shows item label, type, and action buttons
 */

import { Button } from '@/components/ui/button';
import Icon from '@/shared/ui/icons';
import type { TemplateItem } from '@/features/templates/types/template.types';
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
      return <span className="text-white font-bold text-sm sm:text-lg">Tt</span>;
    }

    // For other types, use Icon component
    const IconComponent = Icon[iconName as keyof typeof Icon] || Icon.Mint;
    return <IconComponent size={24} className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
  };

  return (
    <div
      className={`bg-white rounded-lg p-3 sm:p-4 flex items-center justify-between transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        {/* Drag Handle */}
        <div className="cursor-grab active:cursor-grabbing hidden sm:block">
          <Icon.Menu className="text-[#e1e1e1]" />
        </div>

        {/* Icon */}
        <div className="w-9 h-9 sm:w-12 sm:h-12 bg-[#222526] rounded-lg flex items-center justify-center flex-shrink-0">
          {renderIcon()}
        </div>

        {/* Item Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <p className="font-medium text-[#222526] text-sm sm:text-base truncate">{item.label}</p>
            {item.required && (
              <span className="text-red-500 text-xs sm:text-sm">*</span>
            )}
            {item.immutable && (
              <span className="text-[10px] sm:text-xs text-[#69737c] px-1.5 sm:px-2 py-0.5 bg-[#f1f6f9] rounded">
                Immutable
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#69737c]">{typeDisplayName}</p>
          {item.description && (
            <p className="text-[10px] sm:text-xs text-[#69737c] mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-none">{item.description}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-0.5 sm:gap-2 flex-shrink-0">
        {onInfo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onInfo(item)}
            title="View details"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            <Icon.InfoCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        )}
        {onEdit && !item.immutable && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item)}
            title="Edit item"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            <Icon.Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        )}
        {onDelete && !item.immutable && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item)}
            title="Delete item"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            <Icon.Close className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

