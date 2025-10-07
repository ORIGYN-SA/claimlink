import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StandardizedGridView, ViewToggle, type ViewMode } from "@/components/common";
import type { Certificate } from "@/features/certificates/types/certificate.types";

interface LastMintedCertificatesSectionProps {
  certificates: Certificate[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onCertificateClick: (certificate: Certificate) => void;
  onAddCertificate: () => void;
  onViewAll?: () => void;
  className?: string;
}

export const LastMintedCertificatesSection: React.FC<LastMintedCertificatesSectionProps> = ({
  certificates,
  viewMode,
  onViewModeChange,
  onCertificateClick,
  onAddCertificate,
  onViewAll,
  className = "",
}) => {
  return (
    <Card className={`bg-white border border-[#f2f2f2] rounded-2xl shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] p-4 w-full lg:flex-1 min-w-0 ${className}`}>
      {/* Custom header with subtitle and view toggle */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-1">
          <div className="font-sans font-medium text-[#222526] text-sm leading-4">
            Last minted Certificate
          </div>
          <div className="font-sans font-normal text-[#69737c] text-[13px] leading-normal">
            Last 30 days
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {onViewAll && (
            <Button 
              variant="link"
              className="h-auto p-0 font-sans font-medium text-[#615bff] text-[13px] leading-normal hover:underline"
              onClick={onViewAll}
            >
              View all
            </Button>
          )}
          <ViewToggle
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            showListView={true}
          />
        </div>
      </div>

      {/* Use standardized grid/list views */}
      <div className="flex flex-col gap-4">
        {viewMode === 'grid' ? (
          <StandardizedGridView
            items={certificates}
            showCertifiedBadge={true}
            onItemClick={onCertificateClick}
            onAddItem={onAddCertificate}
            addButtonText="Create a certificate"
            addButtonDescription="Create your first certificate"
            showAddButton={certificates.length === 0}
            gridCols="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            compact={true}
          />
        ) : (
          <div className="text-center py-8 text-[#69737c]">
            List view coming soon...
          </div>
        )}
      </div>
    </Card>
  );
};
