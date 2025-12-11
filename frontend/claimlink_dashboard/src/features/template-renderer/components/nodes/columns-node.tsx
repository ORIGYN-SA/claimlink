/**
 * Columns Node Component
 *
 * Renders a grid layout container with configurable columns.
 * Supports responsive columns via smColumns property.
 */

import type { ColumnsNode as ColumnsNodeType, TemplateNode } from '../../types';
import { cn } from '@/lib/utils';

interface ColumnsNodeProps {
  node: ColumnsNodeType;
  renderNode: (node: TemplateNode, index: number) => React.ReactNode;
}

export function ColumnsNode({ node, renderNode }: ColumnsNodeProps) {
  const columns = parseInt(node.columns?.columns || '1', 10);
  const smColumns = parseInt(node.columns?.smColumns || '1', 10);

  // Build grid classes based on column count
  const getGridClass = (cols: number) => {
    switch (cols) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-3';
      case 4:
        return 'grid-cols-4';
      default:
        return 'grid-cols-1';
    }
  };

  const getSmGridClass = (cols: number) => {
    switch (cols) {
      case 1:
        return 'sm:grid-cols-1';
      case 2:
        return 'sm:grid-cols-2';
      case 3:
        return 'sm:grid-cols-3';
      case 4:
        return 'sm:grid-cols-4';
      default:
        return 'sm:grid-cols-1';
    }
  };

  // Handle centered className for special layout
  const isCentered = node.className?.includes('centered');

  return (
    <div
      className={cn(
        'grid gap-2',
        getSmGridClass(smColumns),
        getGridClass(columns),
        isCentered && 'justify-center gap-6 sm:gap-3',
        node.className
      )}
    >
      {node.content?.map((childNode, index) => renderNode(childNode, index))}
    </div>
  );
}
