/**
 * Elements Node Component
 *
 * Renders a flex column container for vertical stacking of child elements.
 */

import type { ElementsNode as ElementsNodeType, TemplateNode } from '../../types';
import { cn } from '@/lib/utils';

interface ElementsNodeProps {
  node: ElementsNodeType;
  renderNode: (node: TemplateNode, index: number) => React.ReactNode;
}

export function ElementsNode({ node, renderNode }: ElementsNodeProps) {
  return (
    <div className={cn('flex flex-col gap-2', node.className)}>
      {node.content?.map((childNode, index) => renderNode(childNode, index))}
    </div>
  );
}
