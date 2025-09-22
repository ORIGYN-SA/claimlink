import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TemplateCard } from "./template-card";
import type { Template } from "../types/template.types";
// import { mockTemplates } from "@/shared/data/templates";

// Mock data for demonstration - this would come from API in real implementation
const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Template name",
    description: "Sample template",
    category: "existing",
    certificateCount: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Template name",
    description: "Sample template",
    category: "existing",
    certificateCount: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Template name",
    description: "Sample template",
    category: "existing",
    certificateCount: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const TemplatesPage: React.FC = () => {
  const [linesPerPage] = useState(10);

  const handleCreateManual = () => {
    console.log("Create manual template");
  };

  const handleCreateAI = () => {
    console.log("Create AI template");
  };

  const handleCreateExisting = () => {
    console.log("Use existing template");
  };

  const handleTemplateClick = (template: Template) => {
    console.log("Template clicked:", template);
  };

  return (
    <div className="space-y-6 max-w-none">
      {/* Page Description */}
      <div>
        <p className="font-['General_Sans'] font-light text-[#69737c] text-base leading-8">
          You can manage your organization's collections that hosts your
          certificates
        </p>
      </div>

      {/* Create Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[200px]">
        <div className="w-full">
          <TemplateCard variant="create-manual" onClick={handleCreateManual} />
        </div>
        <div className="w-full">
          <TemplateCard variant="create-ai" onClick={handleCreateAI} />
        </div>
        <div className="w-full">
          <TemplateCard
            variant="create-existing"
            onClick={handleCreateExisting}
          />
        </div>
      </div>

      {/* My Templates Section */}
      <div className="flex-1 flex flex-col w-full">
        <Card className="flex-1 border-[#f2f2f2] border-t border-l border-r border-b-0 rounded-t-2xl rounded-b-none shadow-none">
          <CardContent className="p-4 space-y-4">
            {/* Title */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-['General_Sans'] font-medium text-[#222526] text-lg leading-normal">
                  My template{" "}
                  <span className="text-[#69737c]">
                    ({mockTemplates.length})
                  </span>
                </h2>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockTemplates.map((template) => (
                <div key={template.id} className="w-full">
                  <TemplateCard
                    template={template}
                    variant="template"
                    onClick={() => handleTemplateClick(template)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer with Pagination */}
        <div className="bg-white border border-[#f2f2f2] rounded-b-[25px] px-10 py-4 flex items-center justify-between shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2.5">
            <span className="font-['General_Sans'] font-normal text-[#86858a] text-[13px]">
              Lines per page
            </span>
            <div className="bg-white border border-[#e1e1e1] rounded-full px-2.5 py-[5px] flex items-center gap-[5px]">
              <span className="font-['General_Sans'] font-medium text-[#222526] text-[13px]">
                {linesPerPage}
              </span>
              <div className="w-2 h-2 rotate-90">
                <svg
                  viewBox="0 0 8 8"
                  fill="currentColor"
                  className="w-full h-full text-gray-400"
                >
                  <path
                    d="M2 3L4 5L6 3"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            {/* Current page highlight */}
            <div className="absolute bg-[#cde9ec66] rounded-[11px] w-7 h-7 left-[29px]" />

            <button className="w-3.5 h-3.5 rotate-180">
              <svg
                viewBox="0 0 14 14"
                fill="currentColor"
                className="w-full h-full text-gray-400"
              >
                <path
                  d="M5 3L8 6L5 9"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </button>

            <div className="flex items-center gap-4 font-['General_Sans'] text-[13px]">
              <span className="font-medium text-[#222526] bg-[#cde9ec66] rounded-[11px] w-7 h-7 flex items-center justify-center">
                1
              </span>
              <span className="font-normal text-[#69737c]">2</span>
              <span className="font-normal text-[#69737c]">3</span>
              <span className="font-normal text-[#69737c]">...</span>
              <span className="font-normal text-[#69737c]">10</span>
              <span className="font-normal text-[#69737c]">11</span>
              <span className="font-normal text-[#69737c]">12</span>
            </div>

            <button className="w-3.5 h-3.5">
              <svg
                viewBox="0 0 14 14"
                fill="currentColor"
                className="w-full h-full text-gray-400"
              >
                <path
                  d="M5 3L8 6L5 9"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TemplatesPage };
