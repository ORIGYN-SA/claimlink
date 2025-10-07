import { useState } from 'react';
import { TemplateCard } from './template-card';
import { templateOptions, manualTemplateOption, type Template } from '@/shared/data';

interface ChooseTemplateStepProps {
  onNext?: (selectedTemplate: Template) => void;
}

export function ChooseTemplateStep({ onNext }: ChooseTemplateStepProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleNext = () => {
    if (selectedTemplate) {
      onNext?.(selectedTemplate);
    }
  };

  return (
    <div className="bg-white border border-[#e1e1e1] border-solid box-border content-stretch flex flex-col gap-[24px] items-center justify-center pb-[40px] pt-[32px] px-[24px] relative rounded-[16px] shrink-0 w-[714px]">
      {/* Title Section */}
      <div className="content-stretch flex flex-col gap-[4px] items-center justify-center relative shrink-0 w-full">
        <p className="font-['General_Sans:Regular',_sans-serif] leading-[32px] not-italic relative shrink-0 text-[#222526] text-[24px] text-center text-nowrap tracking-[1.2px] whitespace-pre">
          Choose template
        </p>
        <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0 w-full">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
            <div className="box-border content-stretch flex flex-col gap-[8px] items-start justify-center ml-0 mt-0 relative w-[353px]">
              <p className="font-['General_Sans:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#69737c] text-[13px] text-center w-full">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Template Listing */}
      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
        {/* Grid with 2 columns */}
        <div className="grid grid-cols-2 gap-2 w-full">
          {templateOptions.map((template) => (
            <div
              key={template.id}
              className={`rounded-[16px] ${
                selectedTemplate?.id === template.id ? 'ring-2 ring-[#615bff]' : ''
              }`}
            >
              <TemplateCard
                template={template}
                onClick={() => handleTemplateSelect(template)}
              />
            </div>
          ))}
        </div>

        {/* Code It Option */}
        <div
          className={`bg-[rgba(205,223,236,0.15)] border border-[#cde9ec] border-solid box-border content-stretch flex flex-col gap-[4px] items-center justify-center leading-[normal] not-italic p-[16px] relative rounded-[16px] shrink-0 text-center w-full cursor-pointer hover:bg-[rgba(205,223,236,0.25)] transition-colors ${
            selectedTemplate?.id === manualTemplateOption.id ? 'ring-2 ring-[#615bff]' : ''
          }`}
          onClick={() => handleTemplateSelect(manualTemplateOption)}
        >
          <p className="[text-underline-position:from-font] decoration-solid font-['General_Sans:Medium',_sans-serif] h-[19px] relative shrink-0 text-[#615bff] text-[14px] underline w-[280px]">
            {manualTemplateOption.name}
          </p>
          <p className="font-['General_Sans:Regular',_sans-serif] h-[19px] relative shrink-0 text-[#69737c] text-[12px] w-[280px]">
            {manualTemplateOption.description}
          </p>
        </div>
      </div>

      {/* Next Button */}
      <button
        className="bg-[#222526] box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center px-[25px] py-0 relative rounded-[100px] shrink-0 w-[360px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#333333] transition-colors"
        onClick={handleNext}
        disabled={!selectedTemplate}
      >
        <p className="font-['DM_Sans:SemiBold',_sans-serif] font-semibold leading-[48px] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">
          Next
        </p>
      </button>
    </div>
  );
}
