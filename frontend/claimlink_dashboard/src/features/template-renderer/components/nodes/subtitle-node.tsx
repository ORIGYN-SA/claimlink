/**
 * SubTitle Node Component
 *
 * Renders a subtitle/paragraph with localized text.
 */

import type { SubTitleNode as SubTitleNodeType } from '../../types';
import { useLocalizedText } from '../../context/template-context';
import { cn } from '@/lib/utils';

interface SubTitleNodeProps {
  node: SubTitleNodeType;
}

export function SubTitleNode({ node }: SubTitleNodeProps) {
  const text = useLocalizedText(node.title);

  return (
    <p className={cn('text-base text-[#5f5f5f]', node.className)}>
      {text}
    </p>
  );
}
