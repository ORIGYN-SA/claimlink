/**
 * V2 Columns Node
 *
 * CSS grid columns with responsive override.
 */

import type { V2ColumnsNode as V2ColumnsNodeType, V2LayoutNode } from '../../types';
import { cn } from '@/lib/utils';

interface V2ColumnsNodeProps {
  node: V2ColumnsNodeType;
  renderNode: (node: V2LayoutNode, index: number) => React.ReactNode;
}

const GRID_CLASSES: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

const SM_GRID_CLASSES: Record<number, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
};

export function V2ColumnsNode({ node, renderNode }: V2ColumnsNodeProps) {
  const cols = node.columns || 1;
  const smCols = node.smColumns || 1;

  return (
    <div
      className={cn(
        'grid gap-2',
        SM_GRID_CLASSES[smCols] || 'sm:grid-cols-1',
        GRID_CLASSES[cols] || 'grid-cols-1',
        node.className
      )}
    >
      {node.children?.map((child, index) => renderNode(child, index))}
    </div>
  );
}
