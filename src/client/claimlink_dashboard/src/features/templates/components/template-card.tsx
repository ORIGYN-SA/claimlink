import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { TemplateCardProps } from '../types/template.types'

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  variant, 
  onClick 
}) => {
  const isCreateCard = variant.startsWith('create-')

  const renderCreateCard = () => {
    const configs = {
      'create-manual': {
        title: 'Create manually',
        description: 'If you have experience with XX language',
        image: (
          <div className="grid grid-cols-1 place-items-start relative w-full h-[104px]">
            <div className="bg-[#cde9ec66] opacity-50 rounded-lg w-full h-full" />
            <div className="absolute bg-white border border-[#cde9ec]/16 rounded-t-2xl h-[91px] w-[279px] left-[28px] top-[13px]" />
            <div className="absolute font-['General_Sans'] font-medium text-[#69737c] text-xs left-[59px] top-[25px] w-[217px] leading-normal">
              <div>
                <p className="mb-0">{`{`}</p>
                <p className="mb-0">model": "Watch",</p>
                <p className="mb-0">"brand": "Example",</p>
                <p className="mb-0">"serial_number":</p>
                <p className="mb-0">{`}`}</p>
              </div>
            </div>
          </div>
        )
      },
      'create-ai': {
        title: 'Create using AI',
        description: 'Use Caffeine AI to generate your template',
        image: (
          <div className="relative w-full h-[104px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              caffeine
            </div>
          </div>
        )
      },
      'create-existing': {
        title: 'Use an existing template',
        description: 'From Art, watch, diamond to gold',
        image: (
          <div className="grid grid-cols-1 place-items-start relative w-full h-[104px]">
            <div className="bg-[#cde9ec66] opacity-50 rounded-lg w-full h-full" />
            {/* Multiple template overlays */}
            <div className="absolute h-[77px] w-[244px] left-[46px] top-[9px]">
              <div className="w-full h-full bg-white rounded-lg shadow-sm border" />
            </div>
            <div className="absolute h-[83px] w-[262px] left-[36px] top-[14px]">
              <div className="w-full h-full bg-white rounded-lg shadow-sm border opacity-90" />
            </div>
            <div className="absolute h-[82px] w-[277px] left-[29px] top-[22px]">
              <div className="w-full h-full bg-white rounded-lg shadow-sm border opacity-80" />
            </div>
          </div>
        )
      }
    }

    const config = configs[variant as keyof typeof configs]

    return (
      <Card 
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md border-[#e1e1e1] rounded-2xl h-[200px] w-full",
          "flex flex-col gap-4 p-3"
        )}
        onClick={onClick}
      >
        <div className="flex-1">
          {config.image}
        </div>
        <CardContent className="p-1 space-y-1">
          <h3 className="font-['General_Sans'] font-medium text-[#222526] text-lg leading-normal">
            {config.title}
          </h3>
          <p className="font-['General_Sans'] font-normal text-[#69737c] text-sm leading-[18px]">
            {config.description}
          </p>
        </CardContent>
      </Card>
    )
  }

  const renderTemplateCard = () => {
    if (!template) return null

    return (
      <Card 
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md border-[#e1e1e1] rounded-2xl",
          "flex items-center gap-4 p-3 h-[94px]"
        )}
        onClick={onClick}
      >
        <div className="w-[76px] h-[76px] bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
          {template.thumbnail ? (
            <img 
              src={template.thumbnail} 
              alt={template.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xs">IMG</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-['General_Sans'] font-normal text-[#222526] text-lg leading-normal">
              {template.name}
            </h3>
            {template.certificateCount && (
              <Badge 
                variant="outline" 
                className="text-[#061937] border-0 bg-white px-0 py-1 text-xs uppercase font-medium tracking-wide"
              >
                <div className="w-3.5 h-3.5 opacity-40 mr-1">
                  <svg viewBox="0 0 14 14" fill="currentColor" className="w-full h-full">
                    <path d="M7 1L8.5 5L13 5L9.5 8L11 12L7 9.5L3 12L4.5 8L1 5L5.5 5L7 1Z" />
                  </svg>
                </div>
                used on {template.certificateCount} certificates
              </Badge>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return isCreateCard ? renderCreateCard() : renderTemplateCard()
}

export { TemplateCard }
