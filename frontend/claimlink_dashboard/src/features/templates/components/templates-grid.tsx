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

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
