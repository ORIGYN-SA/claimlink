import React, { useState } from "react";
import { TemplatesActions } from "./templates-actions";
import { TemplatesGrid } from "./templates-grid";
import { Pagination } from "@/components/common";
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
      <TemplatesGrid
        templates={paginatedTemplates}
        onTemplateClick={handleTemplateClick}
      />
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
