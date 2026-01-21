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

  // Check if this is a "main" or prominent value field
  const isMainValue = node.className?.includes('mainValue') || node.className?.includes('companyName');

  // Certificate variant: large centered text
  if (variant === 'certificate') {
    if (isMainValue) {
      return (
        <h3
          className={cn(
            'text-[36px] sm:text-[72px] font-light leading-[40px] sm:leading-[56px] text-[#222526] text-center',
            isPlaceholder && 'text-gray-400 italic',
            node.className
          )}
        >
          {node.preText}
          <span className="whitespace-pre-wrap">{displayValue}</span>
        </h3>
      );
    }
    return (
      <h5
        className={cn(
          'text-[18px] sm:text-[24px] font-medium leading-6 sm:leading-8 text-[#222526] text-center',
          isPlaceholder && 'text-gray-400 italic',
          node.className
        )}
      >
        {node.preText}
        <span className="whitespace-pre-wrap">{displayValue}</span>
      </h5>
    );
  }

  // Information variant: light text on dark background
  if (variant === 'information') {
    if (isMainValue) {
      return (
        <h3
          className={cn(
            'text-[#f9f8f4] font-extralight italic text-[24px] sm:text-[38px] leading-[32px] sm:leading-[50px]',
            isPlaceholder && 'text-gray-500',
            node.className
          )}
        >
          {node.preText}
          <span className="whitespace-pre-wrap">{displayValue}</span>
        </h3>
      );
    }
    return (
      <p
        className={cn(
          'text-white text-[14px] sm:text-[16px] font-light leading-6 sm:leading-8',
          isPlaceholder && 'text-gray-500 italic',
          node.className
        )}
      >
        {node.preText}
        <span className="whitespace-pre-wrap">{displayValue}</span>
      </p>
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
