/**
 * V2 Group Node
 *
 * Vertical flex-column stack with optional title and configurable gap.
 */

import type { V2GroupNode as V2GroupNodeType, V2LayoutNode } from '../../types';
import { useV2LocalizedText } from '../../context/v2-template-context';
import { cn } from '@/lib/utils';

interface V2GroupNodeProps {
  node: V2GroupNodeType;
  renderNode: (node: V2LayoutNode, index: number) => React.ReactNode;
}

export function V2GroupNode({ node, renderNode }: V2GroupNodeProps) {
  const title = useV2LocalizedText(node.title);
  const gapClass = node.gap !== undefined ? undefined : 'gap-2';
  const gapStyle = node.gap !== undefined ? { gap: `${node.gap}px` } : undefined;

  return (
    <div className={cn('flex flex-col', gapClass, node.className)} style={gapStyle}>
      {title && (
        <h4 className="text-sm font-medium text-[#5f5f5f] mb-1">{title}</h4>
      )}
      {node.children?.map((child, index) => renderNode(child, index))}
    </div>
  );
}
