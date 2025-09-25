import React from "react";
import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TokenGridView } from "@/components/common/token-grid-view";
import type { Certificate } from "../../certificates/types/certificate.types";

interface CertificatesGridProps {
  certificates: Certificate[];
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onCertificateClick: (certificate: Certificate) => void;
  onAddCertificate: () => void;
}

const CertificatesGrid: React.FC<CertificatesGridProps> = ({
  certificates,
  viewMode,
  onViewModeChange,
  onCertificateClick,
  onAddCertificate,
}) => {
  return (
    <div className="bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] border border-[#f2f2f2] rounded-[16px] overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-[#f2f2f2] p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-medium text-[#222526] leading-normal">
              Certificate <span className="text-[#69737c]">({certificates.length})</span>
            </h2>
          </div>

          {/* View Toggle */}
          <div className="bg-[#fcfafa] border border-[#e1e1e1] rounded-full p-1 flex gap-0.5">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className={cn(
                "rounded-full p-1 w-8 h-8",
                viewMode === 'grid'
                  ? "bg-[#061937] text-white"
                  : "bg-[#fcfafa] text-[#69737c] hover:bg-[#f0f0f0]"
              )}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className={cn(
                "rounded-full p-1 w-8 h-8",
                viewMode === 'list'
                  ? "bg-[#061937] text-white"
                  : "bg-[#fcfafa] text-[#69737c] hover:bg-[#f0f0f0]"
              )}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-4">
        {viewMode === 'grid' ? (
          <TokenGridView
            tokens={certificates}
            showCertifiedBadge={true} // Certificates show ORIGYN badge
            onTokenClick={onCertificateClick}
            onAddToken={onAddCertificate}
            addButtonText="Create a certificate"
            addButtonDescription="Create a campaign to distribute your NFTs via claim links"
          />
        ) : (
          <div className="text-center py-8 text-[#69737c]">
            List view coming soon...
          </div>
        )}
      </div>
    </div>
  );
};

export { CertificatesGrid };
