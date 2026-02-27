/**
 * V2 Separator Node
 *
 * Horizontal divider line.
 */

import type { V2SeparatorNode as V2SeparatorNodeType } from '../../types';
import { cn } from '@/lib/utils';

interface V2SeparatorNodeProps {
  node: V2SeparatorNodeType;
  variant: 'certificate' | 'custom-certificate' | 'information' | 'default';
}

export function V2SeparatorNode({ node, variant }: V2SeparatorNodeProps) {
  return (
    <hr
      className={cn(
        'my-4',
        variant === 'certificate' && 'border-t border-[rgba(105,115,124,0.2)]',
        variant === 'custom-certificate' && 'border-t border-white/20',
        variant === 'information' && 'border-t border-[rgba(239,236,227,0.25)]',
        variant === 'default' && 'border-t border-[#f2f3f5]',
        node.className
      )}
    />
  );
}
