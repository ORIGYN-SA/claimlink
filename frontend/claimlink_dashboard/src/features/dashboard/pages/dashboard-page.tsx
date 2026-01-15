import React from 'react';
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { type ViewMode } from "@/components/common";
import {
  TotalStatusSection,
  LastCertificateOwnersSection,
  LastSentCertificatesSection,
  LastMintedCertificatesSection,
} from "../components/sections";
import {
  WelcomeCard,
} from "../components/cards";
import {
  StatusSectionSkeleton,
  StatusSectionError,
  CertificatesSectionSkeleton,
  CertificatesSectionError,
} from "../components/dashboard-skeletons";
import {
  useDashboardStatusCounts,
  useDashboardRecentCertificates,
} from "../api/dashboard.queries";
import type { Certificate } from "@/features/certificates/types/certificate.types";

interface DashboardPageProps {
  className?: string;
}

export function DashboardPage({ className }: DashboardPageProps) {
  const navigate = useNavigate();

  // State management for all interactions
  const [ownersSearchQuery, setOwnersSearchQuery] = React.useState('');
  const [sentSearchQuery, setSentSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');

  // Fetch real data from IC
  const {
    data: statusData,
    isLoading: isLoadingStatus,
    error: statusError,
  } = useDashboardStatusCounts();

  const {
    data: recentCertificates = [],
    isLoading: isLoadingCertificates,
    error: certificatesError,
  } = useDashboardRecentCertificates(9);

  // Mock data for sections we're not touching (Last Certificate Owners and Last Sent Certificates)
  const certificateOwners = [
    { title: "John Doe", date: "20 Feb, 2024" },
    { title: "Jane Smith", date: "19 Feb, 2024" },
    { title: "Bob Johnson", date: "18 Feb, 2024" },
  ];

  const sentCertificates = [
    { title: "Sample Certificate 1", date: "20 Feb, 2024" },
    { title: "Sample Certificate 2", date: "19 Feb, 2024" },
  ];

  const handleCertificateClick = (certificate: Certificate) => {
    // Navigate to certificate detail page with format: collectionId:tokenId
    navigate({
      to: '/mint_certificate/$certificateId',
      params: { certificateId: `${certificate.canisterId}:${certificate.id}` }
    });
  };

  const handleAddCertificate = () => {
    console.log('Add certificate clicked');
  };

  const handleViewAllOwners = () => {
    console.log('View all owners clicked');
  };

  const handleViewAllSent = () => {
    console.log('View all sent certificates clicked');
  };

  const handleViewAllMinted = () => {
    navigate({ to: '/mint_certificate' });
  };

  const handleSentCertificateClick = (certificate: { title: string; date: string }) => {
    console.log('Sent certificate clicked:', certificate);
  };

  const handleMintClick = () => {
    navigate({ to: '/mint_certificate' });
  };

  return (
    <div
      className={cn(
        "flex flex-col items-start justify-start w-full max-w-none space-y-6",
        className,
      )}
    >
      {/* Stats Section - Always first on both mobile and desktop */}
      {isLoadingStatus ? (
        <StatusSectionSkeleton />
      ) : statusError ? (
        <StatusSectionError error={statusError as Error} />
      ) : statusData ? (
        <TotalStatusSection statusData={statusData} />
      ) : null}

      {/* Mobile Layout (below md): Stats → Welcome → Certificates → Owners → Sent */}
      <div className="flex flex-col gap-6 w-full md:hidden">
        <WelcomeCard onMintClick={handleMintClick} />

        {isLoadingCertificates ? (
          <CertificatesSectionSkeleton />
        ) : certificatesError ? (
          <CertificatesSectionError error={certificatesError as Error} />
        ) : (
          <LastMintedCertificatesSection
            certificates={recentCertificates}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onCertificateClick={handleCertificateClick}
            onAddCertificate={handleAddCertificate}
            onViewAll={handleViewAllMinted}
          />
        )}

        <LastCertificateOwnersSection
          owners={certificateOwners}
          searchQuery={ownersSearchQuery}
          onSearchChange={setOwnersSearchQuery}
          onViewAll={handleViewAllOwners}
        />

        <LastSentCertificatesSection
          certificates={sentCertificates}
          searchQuery={sentSearchQuery}
          onSearchChange={setSentSearchQuery}
          onViewAll={handleViewAllSent}
          onCertificateClick={handleSentCertificateClick}
        />
      </div>

      {/* Desktop Layout (md and above): Sidebar + Main content */}
      <div className="hidden md:flex md:flex-row gap-6 items-start justify-start w-full flex-1 min-w-0">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-6 items-start justify-start w-[346px] flex-shrink-0">
          <WelcomeCard onMintClick={handleMintClick} />

          <LastCertificateOwnersSection
            owners={certificateOwners}
            searchQuery={ownersSearchQuery}
            onSearchChange={setOwnersSearchQuery}
            onViewAll={handleViewAllOwners}
          />

          <LastSentCertificatesSection
            certificates={sentCertificates}
            searchQuery={sentSearchQuery}
            onSearchChange={setSentSearchQuery}
            onViewAll={handleViewAllSent}
            onCertificateClick={handleSentCertificateClick}
          />
        </div>

        {/* Main Content Area */}
        {isLoadingCertificates ? (
          <CertificatesSectionSkeleton />
        ) : certificatesError ? (
          <CertificatesSectionError error={certificatesError as Error} />
        ) : (
          <LastMintedCertificatesSection
            certificates={recentCertificates}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onCertificateClick={handleCertificateClick}
            onAddCertificate={handleAddCertificate}
            onViewAll={handleViewAllMinted}
          />
        )}
      </div>
    </div>
  );
}
