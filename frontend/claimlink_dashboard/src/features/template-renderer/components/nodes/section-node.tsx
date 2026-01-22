/**
 * Section Node Component
 *
 * Renders a collapsible accordion section with title and content.
 */

import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { SectionNode as SectionNodeType, TemplateNode } from '../../types';
import { useLocalizedText } from '../../context/template-context';
import { cn } from '@/lib/utils';

interface SectionNodeProps {
  node: SectionNodeType;
  renderNode: (node: TemplateNode, index: number) => React.ReactNode;
}

export function SectionNode({ node, renderNode }: SectionNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const title = useLocalizedText(node.title);

  return (
    <div className={cn('w-full', node.className)}>
      {/* Accordion Header */}
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

      {/* Accordion Content */}
      {isOpen && (
        <div className="w-full px-3 sm:px-5 py-2 sm:py-3 text-[#afafaf]">
          {node.content?.map((childNode, index) => renderNode(childNode, index))}
        </div>
      )}
    </div>
  );
}
