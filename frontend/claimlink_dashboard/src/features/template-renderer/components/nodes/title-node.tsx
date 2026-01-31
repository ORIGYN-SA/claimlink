/**
 * Title Node Component
 *
 * Renders a heading with localized text.
 * Styling depends on variant:
 * - default: Small gray heading
 * - certificate: Centered, uppercase, navy text for formal certificate look
 * - information: Light text on dark background
 */

import type { TitleNode as TitleNodeType } from '../../types';
import { useTemplateContext, useLocalizedText } from '../../context/template-context';
import { cn } from '@/lib/utils';

interface TitleNodeProps {
  node: TitleNodeType;
}

export function TitleNode({ node }: TitleNodeProps) {
  const { variant } = useTemplateContext();
  const text = useLocalizedText(node.title);

  // Handle mainTitle className for larger headings
  const isMainTitle = node.className?.includes('mainTitle');

  // Certificate variant: formal certificate styling
  if (variant === 'certificate') {
    if (isMainTitle) {
      // Main title in certificate (e.g., certificate title like "MADE IN ITALY CERTIFICATE")
      return (
        <h2
          className={cn(
            'text-[14px] sm:text-[20px] font-semibold leading-4 sm:leading-5 text-[#061937] text-center tracking-[3px] sm:tracking-[5px] uppercase',
            node.className
          )}
        >
          {text}
        </h2>
      );
    }
    // Regular title in certificate
    return (
      <h6
        className={cn(
          'text-[12px] sm:text-[14px] font-normal leading-5 sm:leading-6 text-[#69737c] tracking-[1px] sm:tracking-[1.4px] uppercase text-center',
          node.className
        )}
      >
        {text}
      </h6>
    );
  }

  // Custom-certificate variant: formal styling with light text for custom backgrounds
  if (variant === 'custom-certificate') {
    if (isMainTitle) {
      return (
        <h2
          className={cn(
            'text-[14px] sm:text-[20px] font-semibold leading-4 sm:leading-5 text-white text-center tracking-[3px] sm:tracking-[5px] uppercase',
            node.className
          )}
        >
          {text}
        </h2>
      );
    }
    return (
      <h6
        className={cn(
          'text-[12px] sm:text-[14px] font-normal leading-5 sm:leading-6 text-[#fcfafa] tracking-[1px] sm:tracking-[1.4px] uppercase text-center',
          node.className
        )}
      >
        {text}
      </h6>
    );
  }

  // Information variant: light text on dark background
  if (variant === 'information') {
    if (isMainTitle) {
      return (
        <h2
          className={cn(
            'text-[#e1e1e1] text-[14px] sm:text-[16px] font-semibold leading-4 sm:leading-5 tracking-[1.5px] sm:tracking-[2.24px] uppercase',
            node.className
          )}
        >
          {text}
        </h2>
      );
    }
    return (
      <h6
        className={cn(
          'text-[#e1e1e1] text-[10px] sm:text-[12px] font-medium leading-normal tracking-[1px] sm:tracking-[1.2px] uppercase',
          node.className
        )}
      >
        {text}
      </h6>
    );
  }

  // Default variant
  return (
    <h6
      className={cn(
        'font-medium text-xs leading-5 tracking-[-0.1px] text-[#5f5f5f]',
        isMainTitle && 'font-semibold text-2xl leading-8 tracking-[-0.25px] text-inherit text-center my-6',
        node.className
      )}
    >
      {text}
    </h6>
  );
}
