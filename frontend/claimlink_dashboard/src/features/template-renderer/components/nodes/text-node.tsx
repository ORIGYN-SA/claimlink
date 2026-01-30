/**
 * Text Node Component
 *
 * Renders static text content with pre-wrap formatting.
 * Styling depends on variant:
 * - default: Inherit text color
 * - certificate: Dark text, centered
 * - information: Light text on dark background
 */

import type { TextNode as TextNodeType } from '../../types';
import { useTemplateContext, useLocalizedText } from '../../context/template-context';
import { cn } from '@/lib/utils';

interface TextNodeProps {
  node: TextNodeType;
}

export function TextNode({ node }: TextNodeProps) {
  const { variant } = useTemplateContext();
  const text = useLocalizedText(node.text);

  return (
    <div
      className={cn(
        '',
        variant === 'certificate' && 'text-[#222526] text-center text-sm sm:text-base',
        variant === 'custom-certificate' && 'text-[#fcfafa] text-center text-sm sm:text-base',
        variant === 'information' && 'text-white text-[14px] sm:text-[16px] font-light leading-6 sm:leading-8',
        node.className
      )}
    >
      <pre className="whitespace-pre-wrap font-sans text-inherit">
        {text}
      </pre>
    </div>
  );
}
