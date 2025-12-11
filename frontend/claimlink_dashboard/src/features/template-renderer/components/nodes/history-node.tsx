/**
 * History Node Component
 *
 * Renders a timeline of events/history entries.
 */

import type { HistoryNode as HistoryNodeType } from '../../types';
import { cn } from '@/lib/utils';

interface HistoryNodeProps {
  node: HistoryNodeType;
}

export function HistoryNode({ node }: HistoryNodeProps) {
  // For now, show a basic minted event
  // TODO: Parse actual history records from metadata
  const currentDate = new Date().toDateString();

  return (
    <div className={cn('ml-5 pl-5 border-l border-[#afafaf]', node.className)}>
      <div className="relative">
        {/* Timeline dot */}
        <div className="absolute -left-[29.5px] top-0.5 w-3 h-3 bg-[#363636] rounded-full" />
        <div className="absolute -left-[35px] -top-[3px] w-6 h-6 bg-[#f7f7f7] rounded-full -z-10" />

        {/* Event content */}
        <h3 className="text-[#363636] font-semibold text-base leading-[18px] mb-3">
          {currentDate}
        </h3>
        <p className="font-bold text-[#363636] text-sm">Minted</p>
        <p className="text-[#afafaf] text-sm">NFT Minting date</p>
      </div>
    </div>
  );
}
