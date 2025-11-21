import React from "react";
import { TemplateCard } from "./template-card";
import type { Template } from "@/shared/data/templates";

interface TemplatesGridProps {
  templates: Template[];
  onTemplateClick: (template: Template) => void;
}

const TemplatesGrid: React.FC<TemplatesGridProps> = ({
  templates,
  onTemplateClick,
}) => {
  return (
    <div className="bg-white border border-[#f2f2f2] rounded-t-2xl rounded-b-none shadow-none">
      <div className="p-4 space-y-4">
        {/* Title */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-sans font-medium text-[#222526] text-lg leading-normal">
              My template{" "}
              <span className="text-[#69737c]">
                ({templates.length})
              </span>
            </h2>
          </div>
        </div>

        {/* Create Template Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <div
              className="bg-white box-border content-stretch flex flex-col gap-[16px] items-center justify-center px-[12px] py-[9px] relative rounded-[16px] cursor-pointer hover:shadow-md transition-all duration-200 min-h-[94px]"
              onClick={() => onTemplateClick({} as Template)}
            >
              <div className="absolute border border-[#e1e1e1] border-dashed inset-0 pointer-events-none rounded-[16px]" />
              <div className="content-stretch flex flex-col gap-[14px] items-center relative shrink-0 w-[226px]">
                <div className="relative shrink-0 size-[40px]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#222526]">
                      <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                  <div className="font-['General_Sans:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#061937] text-[14px] text-center tracking-[0.7px] uppercase w-full">
                    <p className="leading-[23px]">Create a template</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Template Cards */}
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onClick={() => onTemplateClick(template)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { TemplatesGrid };
