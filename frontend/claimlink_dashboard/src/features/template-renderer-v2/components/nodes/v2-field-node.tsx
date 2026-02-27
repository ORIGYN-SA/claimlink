/**
 * V2 Field Node
 *
 * Renders a field label + value pair.
 * Reads field info from schema via context.
 * Variant-aware styling:
 * - certificate: centered, dark text
 * - custom-certificate: centered, white text
 * - information: label-value row, light text
 */

import type { V2FieldLayoutNode } from '../../types';
import { useV2Context, useV2LocalizedText } from '../../context/v2-template-context';
import { cn } from '@/lib/utils';

interface V2FieldNodeProps {
  node: V2FieldLayoutNode;
  variant: 'certificate' | 'custom-certificate' | 'information' | 'default';
}

export function V2FieldNode({ node, variant }: V2FieldNodeProps) {
  const { getFieldValue, getFieldDefinition, showPlaceholders } = useV2Context();
  const field = getFieldDefinition(node.fieldId);
  const label = useV2LocalizedText(field?.label);
  const value = getFieldValue(node.fieldId);

  const showLabel = node.showLabel !== false;
  const fieldSize = node.size ?? field?.size ?? 'md';

  const isPlaceholder = !value && showPlaceholders;
  const displayValue = value || (showPlaceholders ? 'Sample text content' : null);

  if (!displayValue && !showLabel) return null;

  // Certificate variant: centered column layout
  if (variant === 'certificate') {
    if (!showLabel) {
      const sizeStyles = {
        lg: 'text-[36px] sm:text-[72px] font-light leading-[40px] sm:leading-[56px]',
        md: 'text-[18px] sm:text-[24px] font-medium leading-6 sm:leading-8',
        sm: 'text-[14px] sm:text-[18px] font-normal leading-5 sm:leading-7',
      };
      const Tag = fieldSize === 'lg' ? 'h3' : 'h5';
      return (
        <Tag
          className={cn(
            sizeStyles[fieldSize],
            'text-[#222526] text-center',
            isPlaceholder && 'text-gray-400 italic',
            node.className
          )}
        >
          <span className="whitespace-pre-wrap">{displayValue}</span>
        </Tag>
      );
    }
    return (
      <div className={cn('flex flex-col gap-1 items-center text-center w-full', node.className)}>
        <p className="text-[12px] sm:text-[14px] font-normal leading-5 sm:leading-6 text-[#69737c] tracking-[1px] sm:tracking-[1.4px] uppercase">
          {label}
        </p>
        <p className={cn(
          'text-[18px] sm:text-[24px] font-medium leading-6 sm:leading-8 text-[#222526]',
          isPlaceholder && 'text-gray-400 italic',
        )}>
          {displayValue}
        </p>
      </div>
    );
  }

  // Custom-certificate variant: centered column layout with light text
  if (variant === 'custom-certificate') {
    if (!showLabel) {
      const sizeStyles = {
        lg: 'text-[36px] sm:text-[72px] font-light leading-[40px] sm:leading-[56px]',
        md: 'text-[18px] sm:text-[24px] font-medium leading-6 sm:leading-8',
        sm: 'text-[14px] sm:text-[18px] font-normal leading-5 sm:leading-7',
      };
      const Tag = fieldSize === 'lg' ? 'h3' : 'h5';
      return (
        <Tag
          className={cn(
            sizeStyles[fieldSize],
            'text-white text-center',
            isPlaceholder && 'text-gray-500 italic',
            node.className
          )}
        >
          <span className="whitespace-pre-wrap">{displayValue}</span>
        </Tag>
      );
    }
    return (
      <div className={cn('flex flex-col gap-1 items-center text-center w-full', node.className)}>
        <p className="text-[12px] sm:text-[14px] font-normal leading-5 sm:leading-6 text-[#fcfafa] tracking-[1px] sm:tracking-[1.4px] uppercase">
          {label}
        </p>
        <p className={cn(
          'text-[18px] sm:text-[24px] font-medium leading-6 sm:leading-8 text-white',
          isPlaceholder && 'text-gray-500 italic',
        )}>
          {displayValue}
        </p>
      </div>
    );
  }

  // Information variant: row layout with dark background
  if (variant === 'information') {
    if (!showLabel) {
      const sizeStyles = {
        lg: 'text-[#f9f8f4] font-extralight italic text-[24px] sm:text-[38px] leading-[32px] sm:leading-[50px]',
        md: 'text-white text-[14px] sm:text-[16px] font-light leading-6 sm:leading-8',
        sm: 'text-white text-[12px] sm:text-[14px] font-light leading-5 sm:leading-6',
      };
      const Tag = fieldSize === 'lg' ? 'h3' : 'p';
      return (
        <Tag
          className={cn(
            sizeStyles[fieldSize],
            isPlaceholder && 'text-gray-500 italic',
            node.className
          )}
        >
          <span className="whitespace-pre-wrap">{displayValue}</span>
        </Tag>
      );
    }
    return (
      <div
        className={cn(
          'flex flex-col sm:flex-row items-start sm:justify-between gap-1 sm:gap-0 py-3 sm:py-4 border-t border-[rgba(239,236,227,0.25)]',
          node.className
        )}
      >
        <p className="text-[#e1e1e1] text-[10px] sm:text-[12px] font-normal leading-5 sm:leading-6 tracking-[1px] sm:tracking-[1.2px] uppercase w-full sm:w-[159px] shrink-0">
          {label}
        </p>
        <p className={cn(
          'flex-1 text-white text-[14px] sm:text-[16px] font-light leading-6 sm:leading-8 text-left sm:text-right',
          isPlaceholder && 'text-gray-500 italic',
        )}>
          {displayValue}
        </p>
      </div>
    );
  }

  // Default variant: grid layout
  if (!showLabel) {
    return (
      <p className={cn('text-sm text-[#151515]', isPlaceholder && 'text-gray-400 italic', node.className)}>
        {displayValue}
      </p>
    );
  }
  return (
    <div className={cn('grid grid-cols-[1fr_2fr] text-left max-w-[660px] w-full mx-auto py-4 border-b border-[#e3e3e1]', node.className)}>
      <p className="text-sm text-[#5f5f5f]">{label}</p>
      <p className={cn(
        'text-sm text-[#151515] text-right font-medium',
        isPlaceholder && 'text-gray-400 italic font-normal',
      )}>
        {displayValue}
      </p>
    </div>
  );
}
