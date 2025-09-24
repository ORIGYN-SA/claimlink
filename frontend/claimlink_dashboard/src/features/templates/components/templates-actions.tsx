import React from "react";
import { SearchInput } from "@/components/common/search-input";
import { Button } from "@/components/ui/button";

interface TemplatesActionsProps {
  searchQuery: string;
  selectedStatus: string;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string) => void;
  onCreateTemplate: () => void;
}

const TemplatesActions: React.FC<TemplatesActionsProps> = ({
  searchQuery,
  selectedStatus,
  onSearchChange,
  onStatusChange,
  onCreateTemplate,
}) => {
  return (
    <div className="flex gap-[16px] items-center">
      {/* Search Input */}
      <div className="flex-1 ">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>

      {/* Status Dropdown */}
      <div className="relative">
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-white border border-[#e1e1e1] rounded-full px-4 py-3 pr-8 text-[14px] font-semibold text-[#222526] focus:outline-none focus:ring-2 focus:ring-[#222526]/20 appearance-none cursor-pointer"
        >
          <option value="all">Status</option>
          <option value="existing">Existing</option>
          <option value="manual">Manual</option>
          <option value="ai">AI Generated</option>
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg viewBox="0 0 8 8" fill="currentColor" className="w-2 h-2 text-[#222526]">
            <path d="M2 3L4 5L6 3" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </div>
      </div>

      {/* Create Template Button */}
      <Button
        onClick={onCreateTemplate}
        className="bg-[#222526] hover:bg-[#222526]/90 text-white px-6 py-3 rounded-full font-semibold text-[14px]"
      >
        Create a template
      </Button>
    </div>
  );
};

export { TemplatesActions };
