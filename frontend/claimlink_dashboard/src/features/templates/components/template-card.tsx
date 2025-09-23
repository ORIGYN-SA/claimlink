import React from 'react'
import { cn } from '@/lib/utils'
import type { TemplateCardProps } from '../types/template.types'

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onClick
}) => {
  return (
    <div
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        "bg-white box-border content-stretch flex gap-[16px] items-center px-[12px] py-[9px] relative rounded-[16px]"
      )}
      onClick={onClick}
      data-name="Card"
    >
      <div aria-hidden="true" className="absolute border border-[#e1e1e1] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="h-[76px] relative shrink-0 w-[76px]" data-name="IMG">
        {template.thumbnail ? (
          <img
            alt=""
            className="block max-w-none size-full rounded-lg object-cover"
            src={template.thumbnail}
          />
        ) : (
          <div className="block max-w-none size-full rounded-lg bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-xs">IMG</span>
          </div>
        )}
      </div>
      <div className="flex flex-row items-center self-stretch min-w-0 flex-1">
        <div className="content-stretch flex flex-col h-full items-start relative shrink-0 min-w-0 flex-1" data-name="Description">
          <div className="font-['General_Sans:Regular',_sans-serif] leading-[0] min-w-full not-italic relative shrink-0 text-[#222526] text-[18px]" style={{ width: "min-content" }}>
            <p className="leading-[normal] truncate">{template.name}</p>
          </div>
          {template.certificateCount && (
            <div className="bg-white box-border content-stretch flex gap-[4px] items-center px-0 py-[4px] relative rounded-[100px] shrink-0" data-name="certificates">
              <div className="opacity-40 relative shrink-0 size-[14px]" data-name="certif_ic_2">
                <div className="absolute contents inset-0">
                  <svg viewBox="0 0 14 14" fill="currentColor" className="w-full h-full text-[#061937]">
                    <path d="M7 1L8.5 5L13 5L9.5 8L11 12L7 9.5L3 12L4.5 8L1 5L5.5 5L7 1Z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col font-['General_Sans:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#061937] text-[10px] text-nowrap uppercase">
                <p className="leading-[24px] whitespace-pre">used on {template.certificateCount} certificates</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { TemplateCard }
