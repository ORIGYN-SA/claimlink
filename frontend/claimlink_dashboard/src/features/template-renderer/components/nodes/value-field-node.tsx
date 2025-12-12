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
  const { getFieldValue, variant } = useTemplateContext();

  // Get values for all fields and join them
  const value = node.fields
    ?.map((fieldName) => getFieldValue(fieldName))
    .filter((v) => v !== null && v !== '')
    .join(', ');

  if (!value) {
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
            'text-[72px] font-light leading-[56px] text-[#222526] text-center',
            node.className
          )}
        >
          {node.preText}
          <span className="whitespace-pre-wrap">{value}</span>
        </h3>
      );
    }
    return (
      <h5
        className={cn(
          'text-[24px] font-medium leading-8 text-[#222526] text-center',
          node.className
        )}
      >
        {node.preText}
        <span className="whitespace-pre-wrap">{value}</span>
      </h5>
    );
  }

  // Information variant: light text on dark background
  if (variant === 'information') {
    if (isMainValue) {
      return (
        <h3
          className={cn(
            'text-[#f9f8f4] font-extralight italic text-[38px] leading-[50px]',
            node.className
          )}
        >
          {node.preText}
          <span className="whitespace-pre-wrap">{value}</span>
        </h3>
      );
    }
    return (
      <p
        className={cn(
          'text-white text-[16px] font-light leading-8',
          node.className
        )}
      >
        {node.preText}
        <span className="whitespace-pre-wrap">{value}</span>
      </p>
    );
  }

  // Default variant
  return (
    <h5
      className={cn(
        'font-semibold text-sm leading-[22px] tracking-[-0.15px] text-[#151515]',
        node.className
      )}
    >
      {node.preText}
      <pre className="whitespace-pre-wrap font-sans text-inherit inline">
        {value}
      </pre>
    </h5>
  );
}
