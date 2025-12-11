/**
 * Separator Node Component
 *
 * Renders a horizontal divider line.
 */

import type { SeparatorNode as SeparatorNodeType } from '../../types';
import { cn } from '@/lib/utils';

interface SeparatorNodeProps {
  node: SeparatorNodeType;
}

export function SeparatorNode({ node }: SeparatorNodeProps) {
  return (
    <hr
      className={cn(
        'border-t border-[#f2f3f5] my-4',
        node.className
      )}
    />
  );
}
