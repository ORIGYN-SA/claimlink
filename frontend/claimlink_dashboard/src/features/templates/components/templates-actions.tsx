import React from "react";
import { SearchInput, FilterSelect } from "@/components/common";
import type { FilterOption } from "@/components/common";
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
  // Status filter options
  const statusOptions: FilterOption[] = [
    { value: 'all', label: 'Status' },
    { value: 'existing', label: 'Existing' },
    { value: 'manual', label: 'Manual' },
    { value: 'ai', label: 'AI Generated' }
  ];
  return (
    <div className="flex gap-[16px] items-center">
      {/* Search Input */}
      <div className="flex-1 ">
        <SearchInput
          placeholder="Search for templates"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>

      {/* Status Filter */}
      <FilterSelect
        placeholder="Status"
        value={selectedStatus}
        options={statusOptions}
        onValueChange={onStatusChange}
        width="w-[160px]"
      />

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
