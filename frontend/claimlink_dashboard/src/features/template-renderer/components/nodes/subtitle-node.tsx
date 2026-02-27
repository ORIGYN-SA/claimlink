/**
 * SubTitle Node Component
 *
 * Renders a subtitle/paragraph with localized text.
 * Styling depends on variant:
 * - default: Gray text
 * - certificate: Dark text, centered
 * - custom-certificate: Light text, centered
 * - information: Light text
 */

import type { SubTitleNode as SubTitleNodeType } from '../../types';
import { useTemplateContext, useLocalizedText } from '../../context/template-context';
import { cn } from '@/lib/utils';

interface SubTitleNodeProps {
  node: SubTitleNodeType;
}

export function SubTitleNode({ node }: SubTitleNodeProps) {
  const { variant } = useTemplateContext();
  const text = useLocalizedText(node.title);

  return (
    <p
      className={cn(
        'text-sm sm:text-base text-[#5f5f5f]',
        variant === 'certificate' && 'text-[#69737c] text-center',
        variant === 'custom-certificate' && 'text-[#fcfafa] text-center',
        variant === 'information' && 'text-[#e1e1e1]',
        node.className
      )}
    >
      {text}
    </p>
  );
}
