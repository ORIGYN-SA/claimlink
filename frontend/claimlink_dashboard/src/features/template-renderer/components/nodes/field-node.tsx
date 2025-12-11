/**
 * Field Node Component
 *
 * Renders a label + value pair.
 * Styling depends on variant:
 * - default: Grid layout (label left, value right)
 * - certificate: Centered column layout (label above value)
 * - information: Row layout with dark background styling
 */

import type { FieldNode as FieldNodeType } from '../../types';
import { useTemplateContext, useLocalizedText } from '../../context/template-context';
import { cn } from '@/lib/utils';

interface FieldNodeProps {
  node: FieldNodeType;
}

export function FieldNode({ node }: FieldNodeProps) {
  const { getFieldValue, variant } = useTemplateContext();
  const title = useLocalizedText(node.title);

  // Get values for all fields and join them
  const value = node.fields
    ?.map((fieldName) => getFieldValue(fieldName))
    .filter((v) => v !== null && v !== '')
    .join(', ');

  // If no title, render just the value
  if (!title) {
    return (
      <p
        className={cn(
          'text-sm',
          variant === 'certificate' && 'text-[#222526] text-center',
          variant === 'information' && 'text-white font-light',
          variant === 'default' && 'text-[#151515]',
          node.className
        )}
      >
        {value}
      </p>
    );
  }

  // Certificate variant: centered column layout
  if (variant === 'certificate') {
    return (
      <div
        className={cn(
          'flex flex-col gap-1 items-center text-center w-full',
          node.className
        )}
      >
        <p className="text-[14px] font-normal leading-6 text-[#69737c] tracking-[1.4px] uppercase">
          {title}
        </p>
        <p className="text-[24px] font-medium leading-8 text-[#222526]">
          {value}
        </p>
      </div>
    );
  }

  // Information variant: row layout with dark background styling
  if (variant === 'information') {
    return (
      <div
        className={cn(
          'flex items-start justify-between py-4 border-t border-[rgba(239,236,227,0.25)]',
          node.className
        )}
      >
        <p className="text-[#e1e1e1] text-[12px] font-normal leading-6 tracking-[1.2px] uppercase w-[159px] shrink-0">
          {title}
        </p>
        <p className="flex-1 text-white text-[16px] font-light leading-8 text-right">
          {value}
        </p>
      </div>
    );
  }

  // Default variant: grid layout
  return (
    <div
      className={cn(
        'grid grid-cols-[1fr_2fr] text-left max-w-[660px] w-full mx-auto py-4 border-b border-[#e3e3e1]',
        node.className
      )}
    >
      <p className="text-sm text-[#5f5f5f]">{title}</p>
      <p className="text-sm text-[#151515] text-right font-medium">{value}</p>
    </div>
  );
}
