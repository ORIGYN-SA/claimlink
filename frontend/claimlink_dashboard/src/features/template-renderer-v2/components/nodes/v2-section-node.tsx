/**
 * V2 Section Node
 *
 * Collapsible accordion with title.
 */

import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { V2SectionNode as V2SectionNodeType, V2LayoutNode } from '../../types';
import { useV2LocalizedText } from '../../context/v2-template-context';
import { cn } from '@/lib/utils';

interface V2SectionNodeProps {
  node: V2SectionNodeType;
  renderNode: (node: V2LayoutNode, index: number) => React.ReactNode;
}

export function V2SectionNode({ node, renderNode }: V2SectionNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const title = useV2LocalizedText(node.title);

  return (
    <div className={cn('w-full', node.className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full h-[50px] sm:h-[70px] font-semibold text-sm sm:text-base leading-[16px] sm:leading-[18px]',
          'px-3 sm:px-5 bg-[#f2f3f5] rounded-[5px] text-[#8c7967]',
          'flex items-center justify-between',
          'hover:bg-[#e9eaec] transition-colors'
        )}
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </button>

      {isOpen && (
        <div className="w-full px-3 sm:px-5 py-2 sm:py-3 text-[#afafaf]">
          {node.children?.map((child, index) => renderNode(child, index))}
        </div>
      )}
    </div>
  );
}
