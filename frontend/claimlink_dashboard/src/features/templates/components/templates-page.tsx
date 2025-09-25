import React, { useState } from "react";
import { TemplatesActions } from "./templates-actions";
import { Pagination, GridOnlyContainer } from "@/components/common";
import { TemplateCard } from "./template-card";
import type { Template } from "@/shared/data/templates";
import { mockTemplates } from "@/shared/data/templates";

const TemplatesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [linesPerPage, setLinesPerPage] = useState(10);

  const handleTemplateClick = (template: Template) => {
    console.log("Template clicked:", template);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleCreateTemplate = () => {
    console.log("Create template clicked");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLinesPerPageChange = (lines: number) => {
    setLinesPerPage(lines);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Filter templates based on search and status
  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || template.category === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Paginate templates
  const totalPages = Math.ceil(filteredTemplates.length / linesPerPage);
  const startIndex = (currentPage - 1) * linesPerPage;
  const endIndex = startIndex + linesPerPage;
  const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 max-w-none">
      <TemplatesActions
        searchQuery={searchQuery}
        selectedStatus={selectedStatus}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onCreateTemplate={handleCreateTemplate}
      />
      <GridOnlyContainer
        title="My template"
        totalCount={filteredTemplates.length}
      >
        {/* Grid with standardized spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Create Template Card */}
          <div className="md:col-span-1">
            <div
              className="bg-white box-border content-stretch flex flex-col gap-[16px] items-center justify-center px-[12px] py-[9px] relative rounded-[16px] cursor-pointer hover:shadow-md transition-all duration-200 min-h-[94px]"
              onClick={() => handleTemplateClick({} as Template)}
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
          {paginatedTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onClick={() => handleTemplateClick(template)}
            />
          ))}
        </div>
      </GridOnlyContainer>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={linesPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleLinesPerPageChange}
      />
    </div>
  );
};

export { TemplatesPage };
