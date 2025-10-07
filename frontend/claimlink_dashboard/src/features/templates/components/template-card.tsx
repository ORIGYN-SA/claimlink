import React from 'react'
import { cn } from '@/lib/utils'
import type { TemplateCardProps } from '../types/template.types'
import { ScrollText } from "lucide-react";

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
            src={template.thumbnail} 
            alt={template.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="max-w-none size-full rounded-lg bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-xs">IMG</span>
          </div>
        )}
      </div>
      <div className="flex flex-row items-center self-stretch min-w-0 flex-1">
        <div className="content-stretch flex flex-col h-full items-start justify-center relative shrink-0 min-w-0 flex-1 gap-1" data-name="Description">
          <h3 
            className="w-full text-[18px] font-normal text-[#222526] leading-normal truncate" 
            title={template.name}
          >
            {template.name}
          </h3>
          {template.certificateCount ? (
            <div className="bg-white box-border flex gap-[4px] items-center px-0 py-[4px] relative rounded-[100px] min-w-0 w-full" data-name="certificates">
              <div className="opacity-40 relative shrink-0 size-[14px]" data-name="certif_ic_2">
                <ScrollText className="w-full h-full"/>
              </div>
              <div className="flex-1 min-w-0 font-sans font-medium text-[#061937] text-[10px] uppercase leading-[24px]">
                <h4 
                  className="truncate" 
                  title={`used on ${template.certificateCount} certificates`}
                >
                  used on {template.certificateCount} certificates
                </h4>
              </div>
            </div>
          ) : template.description ? (
            <p 
              className="w-full text-[12px] font-normal text-[#69737c] leading-normal line-clamp-2" 
              title={template.description}
            >
              {template.description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
export { TemplateCard }

