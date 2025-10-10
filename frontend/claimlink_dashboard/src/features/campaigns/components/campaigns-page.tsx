import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CampaignsActions } from "./campaigns-actions";
import { Pagination, GridOnlyContainer } from "@/components/common";
import { CampaignCard } from "./campaign-card";
import type { Campaign, CampaignFilters } from "../types/campaign.types";
import { mockCampaigns, getFilteredCampaigns } from "@/shared/data/campaigns";

const CampaignsPage: React.FC = () => {
  const navigate = useNavigate();
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
      <GridOnlyContainer
        title="Campaigns"
        totalCount={filteredCampaigns.length}
      >
        {/* Grid with standardized spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Create Campaign Card */}
          <div className="md:col-span-1">
            <div
              className="bg-white box-border content-stretch flex flex-col gap-[16px] items-center justify-center px-[12px] py-[9px] relative rounded-[16px] cursor-pointer hover:shadow-md transition-all duration-200 min-h-[94px]"
              onClick={handleCreateCampaign}
            >
              <div className="absolute border border-[#e1e1e1] border-dashed inset-0 pointer-events-none rounded-[16px]" />
              <div className="content-stretch flex flex-col gap-[14px] items-center relative shrink-0 w-full px-4">
                <div className="relative shrink-0 size-[40px]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#222526]">
                      <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-start relative min-w-0 w-full">
                  <div className="font-sans font-medium leading-[0] not-italic relative min-w-0 text-[#061937] text-[14px] text-center tracking-[0.7px] uppercase w-full">
                    <p className="leading-[23px] truncate" title="Launch campaign">Launch campaign</p>
                  </div>
                  <div className="font-sans font-light leading-[normal] not-italic relative min-w-0 text-[#69737c] text-[13px] text-center w-full">
                    <p className="leading-[normal]">Distribute your NFTs via claim links</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Cards */}
          {paginatedCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onClick={() => handleCampaignClick(campaign)}
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

export { CampaignsPage };
