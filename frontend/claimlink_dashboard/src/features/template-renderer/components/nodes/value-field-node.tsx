/**
 * Value Field Node Component
 *
 * Renders dynamic values from metadata.
 * Looks up field names in the data and joins multiple values with ", ".
 * Styling depends on variant:
 * - default: Small bold text
 * - certificate: Large centered text for prominent display
 * - information: White text on dark background
 */

import type { ValueFieldNode as ValueFieldNodeType } from '../../types';
import { useTemplateContext } from '../../context/template-context';
import { cn } from '@/lib/utils';

interface ValueFieldNodeProps {
  node: ValueFieldNodeType;
}

export function ValueFieldNode({ node }: ValueFieldNodeProps) {
  const { getFieldValue, variant, showPlaceholders } = useTemplateContext();

  // Get values for all fields and join them
  const value = node.fields
    ?.map((fieldName) => getFieldValue(fieldName))
    .filter((v) => v !== null && v !== '')
    .join(', ');

  // Show placeholder if no value and placeholders enabled
  const isPlaceholder = !value && showPlaceholders;
  const displayValue = value || (showPlaceholders ? 'Sample text content' : null);

  if (!displayValue) {
    return null;
  }

  const fieldSize = node.size ?? 'md';

  // Certificate variant: centered text with size-based styling
  if (variant === 'certificate') {
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
        {node.preText}
        <span className="whitespace-pre-wrap">{displayValue}</span>
      </Tag>
    );
  }

  // Custom-certificate variant: centered light text for custom backgrounds
  if (variant === 'custom-certificate') {
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
        {node.preText}
        <span className="whitespace-pre-wrap">{displayValue}</span>
      </Tag>
    );
  }

  // Information variant: light text on dark background
  if (variant === 'information') {
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
          isPlaceholder && 'text-gray-500' + (fieldSize !== 'lg' ? ' italic' : ''),
          node.className
        )}
      >
        {node.preText}
        <span className="whitespace-pre-wrap">{displayValue}</span>
      </Tag>
    );
  }

  // Default variant
  return (
    <h5
      className={cn(
        'font-semibold text-sm leading-[22px] tracking-[-0.15px] text-[#151515]',
        isPlaceholder && 'text-gray-400 italic font-normal',
        node.className
      )}
    >
      {node.preText}
      <pre className="whitespace-pre-wrap font-sans text-inherit inline">
        {displayValue}
      </pre>
    </h5>
  );
}
