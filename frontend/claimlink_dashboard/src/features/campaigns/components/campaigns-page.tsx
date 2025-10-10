import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CampaignsActions } from "./campaigns-actions";
import { Pagination, StandardizedGridListContainer, type ListColumn, type ViewMode } from "@/components/common";
import { CampaignCard } from "./campaign-card";
import type { Campaign, CampaignFilters } from "../types/campaign.types";
import { mockCampaigns, getFilteredCampaigns } from "@/shared/data/campaigns";

const CampaignsPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<CampaignFilters>({
    search: "",
    status: "all",
    duration: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [linesPerPage, setLinesPerPage] = useState(10);

  const handleCampaignClick = (campaign: Campaign) => {
    console.log("Campaign clicked:", campaign);
    // TODO: Navigate to campaign detail page when implemented
    // navigate({ to: `/campaigns/${campaign.id}` });
  };

  const handleCreateCampaign = () => {
    navigate({ to: '/campaigns/new' });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLinesPerPageChange = (lines: number) => {
    setLinesPerPage(lines);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Define columns for list view
  const listColumns: ListColumn[] = [
    {
      key: 'name',
      label: 'Campaign',
      width: 'w-[40%]',
      render: (campaign: Campaign) => {
        if (!campaign) return null;

        return (
          <div className="flex items-center gap-3">
            <img
              src={campaign.imageUrl || '/placeholder-image.jpg'}
              alt={campaign.name || 'Campaign'}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <div className="font-medium text-[#222526] text-sm">{campaign.name || 'Untitled Campaign'}</div>
              <div className="text-xs text-[#69737c]">
                {campaign.claimedCount || 0} / {campaign.totalCount || 0} claimed NFTs
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      width: 'w-[20%]',
      render: (campaign: Campaign) => {
        if (!campaign) return null;

        return (
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              campaign.status === 'Active' ? 'bg-[#c7f2e0] text-[#50be8f]' :
              campaign.status === 'Ready' ? 'bg-[#ffd4f0] text-[#ff55c5]' :
              campaign.status === 'Finished' ? 'bg-[#ccedff] text-[#00a2f7]' :
              'bg-[#f0f0f0] text-[#69737c]'
            }`}>
              {campaign.status || 'Active'}
            </span>
          </div>
        );
      },
    },
    {
      key: 'timer',
      label: 'Timer',
      width: 'w-[25%]',
      render: (campaign: Campaign) => {
        if (!campaign) return null;

        return (
          <div className="flex items-center gap-2">
            {campaign.timerText && campaign.timerType && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                campaign.timerType === 'Urgent' ? 'bg-[#ffe2db] text-[#e84c25]' :
                campaign.timerType === 'Ongoing' ? 'bg-[#c7f2e0] text-[#50be8f]' :
                campaign.timerType === 'Starting Soon' ? 'bg-[#ffedf9] text-[#993376]' :
                'bg-[#fcfafa] text-[#69737c]'
              }`}>
                {campaign.timerText}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: 'w-[15%]',
      render: (campaign: Campaign) => {
        if (!campaign) return null;

        return (
          <div className="text-sm text-[#69737c]">{campaign.createdAt || 'Unknown'}</div>
        );
      },
    },
  ];

  // Filter campaigns based on current filters
  const filteredCampaigns = getFilteredCampaigns(mockCampaigns, filters);

  // Paginate campaigns
  const totalPages = Math.ceil(filteredCampaigns.length / linesPerPage);
  const startIndex = (currentPage - 1) * linesPerPage;
  const endIndex = startIndex + linesPerPage;
  const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 max-w-none">
      <CampaignsActions
        filters={filters}
        onFiltersChange={setFilters}
        onCreateCampaign={handleCreateCampaign}
      />
      <StandardizedGridListContainer
        title="Campaigns"
        totalCount={filteredCampaigns.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle={true}
        items={paginatedCampaigns}
        onItemClick={handleCampaignClick}
        onAddItem={handleCreateCampaign}
        addButtonText="Launch campaign"
        addButtonDescription="Distribute your NFTs via claim links"
        gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        cardVariant="horizontal"
        customCardComponent={CampaignCard}
        listColumns={listColumns}
        addItemText="Create your first campaign"
        showMoreActions={true}
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

export { CampaignsPage };
