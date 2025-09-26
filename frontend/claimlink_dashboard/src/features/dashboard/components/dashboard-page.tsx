import React from 'react';
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { type ViewMode } from "@/components/common";
import {
  TotalStatusSection,
  LastCertificateOwnersSection,
  LastSentCertificatesSection,
  LastMintedCertificatesSection,
  WelcomeCard
} from "./";
import {
  mockCertificates,
  getMintedCertificates
} from "@/shared/data/certificates";
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

  // Data preparation
  const mintedCertificates = getMintedCertificates().slice(0, 9);
  
  const certificateOwners = [
    { title: "John Doe", date: "20 Feb, 2024" },
    { title: "Jane Smith", date: "19 Feb, 2024" },
    { title: "Bob Johnson", date: "18 Feb, 2024" },
  ];

  const sentCertificates = mockCertificates.slice(0, 2).map(cert => ({
    title: cert.title,
    date: cert.date
  }));

  const statusData = {
    minted: { value: "235", trend: "56%", trendColor: "green" as const },
    awaiting: { value: "235", trend: "56%", trendColor: "green" as const },
    wallet: { value: "235", trend: "11%", trendColor: "red" as const },
    transferred: { value: "235", trend: "56%", trendColor: "green" as const },
  };

  const handleCertificateClick = (certificate: Certificate) => {
    console.log('Certificate clicked:', certificate);
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

  return (
    <div
      className={cn(
        "flex flex-col items-start justify-start w-full max-w-none space-y-6",
        className,
      )}
    >

      {/* Stats Section */}
      <TotalStatusSection statusData={statusData} />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-start w-full flex-1 min-w-0">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-6 items-start justify-start w-full lg:w-[346px] flex-shrink-0">
          <WelcomeCard />

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
        <LastMintedCertificatesSection
          certificates={mintedCertificates}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onCertificateClick={handleCertificateClick}
          onAddCertificate={handleAddCertificate}
          onViewAll={handleViewAllMinted}
        />
      </div>
    </div>
  );
}
