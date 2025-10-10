import React from "react";
import { SearchInput, FilterSelect } from "@/components/common";
import type { FilterOption } from "@/components/common";
import { Button } from "@/components/ui/button";
import type { CampaignFilters } from "../types/campaign.types";

interface CampaignsActionsProps {
  filters: CampaignFilters;
  onFiltersChange: (filters: CampaignFilters) => void;
  onCreateCampaign: () => void;
}

const CampaignsActions: React.FC<CampaignsActionsProps> = ({
  filters,
  onFiltersChange,
  onCreateCampaign,
}) => {
  // Status filter options
  const statusOptions: FilterOption[] = [
    { value: 'all', label: 'Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Ready', label: 'Ready' },
    { value: 'Finished', label: 'Finished' },
    { value: 'Draft', label: 'Draft' },
  ];

  // Duration filter options
  const durationOptions: FilterOption[] = [
    { value: 'all', label: 'Duration' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'active', label: 'Active' },
    { value: 'ended', label: 'Ended' },
  ];

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({ ...filters, status: status as CampaignFilters['status'] });
  };

  const handleDurationChange = (duration: string) => {
    onFiltersChange({ ...filters, duration: duration as CampaignFilters['duration'] });
  };

  return (
    <div className="flex gap-[16px] items-center">
      {/* Search Input */}
      <div className="flex-1">
        <SearchInput
          placeholder="Search for an item"
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Status Filter */}
      <FilterSelect
        placeholder="Status"
        value={filters.status}
        options={statusOptions}
        onValueChange={handleStatusChange}
        width="w-[160px]"
      />

      {/* Duration Filter */}
      <FilterSelect
        placeholder="Duration"
        value={filters.duration}
        options={durationOptions}
        onValueChange={handleDurationChange}
        width="w-[160px]"
      />

      {/* Create Campaign Button */}
      <Button
        size={"lg"}
        onClick={onCreateCampaign}
        className="bg-[#222526] hover:bg-[#222526]/90 text-white px-6 py-3 rounded-full font-semibold text-[14px]"
      >
        Launch a campaign
      </Button>
    </div>
  );
};

export { CampaignsActions };
