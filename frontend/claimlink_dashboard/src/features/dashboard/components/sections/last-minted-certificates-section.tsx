import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StandardizedGridListContainer, type ViewMode, type ListColumn, type ListAction } from "@/components/common";
import type { Certificate } from "@/features/certificates/types/certificate.types";
import { Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
  // Define columns for list view
  const listColumns: ListColumn[] = [
    {
      key: 'certificate',
      label: 'Certificate',
      width: 'w-[40%]',
      render: (certificate: Certificate) => {
        if (!certificate) return null;

        return (
          <div className="flex items-center gap-3">
            <img
              src={certificate.imageUrl || '/placeholder-image.jpg'}
              alt={certificate.title || 'Certificate'}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <div className="font-medium text-[#222526] text-sm">{certificate.title || 'Untitled Certificate'}</div>
              <div className="text-xs text-[#69737c]">{certificate.collectionName || 'Unknown Collection'}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      width: 'w-[25%]',
      render: (certificate: Certificate) => {
        if (!certificate) return null;

        return (
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              certificate.status === 'Minted' ? 'bg-[#c7f2e0] text-[#50be8f]' :
              certificate.status === 'Transferred' ? 'bg-[#ccedff] text-[#00a2f7]' :
              certificate.status === 'Waiting' ? 'bg-[#ffd4f0] text-[#ff55c5]' :
              certificate.status === 'Burned' ? 'bg-[#f0f0f0] text-[#69737c]' :
              'bg-[#f0f0f0] text-[#69737c]'
            }`}>
              {certificate.status}
            </span>
          </div>
        );
      },
    },
    {
      key: 'date',
      label: 'Date',
      width: 'w-[35%]',
      render: (certificate: Certificate) => {
        if (!certificate) return null;

        return (
          <div className="text-sm text-[#69737c]">{certificate.date || 'Unknown'}</div>
        );
      },
    },
  ];

  // Define actions for list view dropdown menu
  const listActions: ListAction[] = [
    {
      label: 'View Certificate',
      icon: Eye,
      onClick: (certificate: Certificate) => {
        onCertificateClick(certificate);
      },
    },
    {
      label: 'Edit Certificate',
      icon: Edit,
      onClick: (certificate: Certificate) => {
        toast.info(`Edit certificate: ${certificate.title}`);
      },
    },
    {
      label: 'Delete Certificate',
      icon: Trash2,
      onClick: (certificate: Certificate) => {
        toast.info(`Delete certificate: ${certificate.title}`);
      },
      variant: 'destructive',
    },
  ];

  return (
    <Card className={`bg-white border border-[#f2f2f2] rounded-2xl shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] p-4 w-full md:flex-1 min-w-0 ${className}`}>
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
        {onViewAll && (
          <Button
            variant="link"
            className="h-auto p-0 font-sans font-medium text-[#615bff] text-[13px] leading-normal hover:underline"
            onClick={onViewAll}
          >
            View all
          </Button>
        )}
      </div>

      {/* Use standardized grid/list container - Mobile: 2 cols, Desktop: 3 cols */}
      <StandardizedGridListContainer
        title=""
        totalCount={certificates.length}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        showViewToggle={true}
        items={certificates}
        onItemClick={onCertificateClick}
        onAddItem={onAddCertificate}
        addButtonText="Create a certificate"
        addButtonDescription="Create your first certificate"
        gridCols="grid-cols-2 xl:grid-cols-3"
        showCertifiedBadge={true}
        listColumns={listColumns}
        listActions={listActions}
        addItemText="Create your first certificate"
        showMoreActions={true}
      />
    </Card>
  );
};
