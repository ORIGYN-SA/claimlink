import React from 'react';
import { StatCard } from "./stat-card";
import { WelcomeCard } from "./welcome-card";
import { FeedCard } from "./feed-card";
import {
  MintedCertificatesIcon,
  AwaitingCertificatesIcon,
  WalletCertificatesIcon,
  TransferredCertificatesIcon,
  SearchIcon,
  GridIcon,
  LineIcon
} from "./icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CertificateCard,
  CertificateListView
} from "@/features/certificates";
import {
  mockCertificates,
  getMintedCertificates
} from "@/shared/data/certificates";

interface DashboardPageProps {
  className?: string;
}

export function DashboardPage({ className }: DashboardPageProps) {
  // Use shared certificate data
  const mintedCertificates = getMintedCertificates().slice(0, 9); // Get first 9 minted certificates

  // Mock certificate owners data (could be derived from certificates if needed)
  const certificateOwners = [
    { title: "John Doe", date: "20 Feb, 2024" },
    { title: "Jane Smith", date: "19 Feb, 2024" },
    { title: "Bob Johnson", date: "18 Feb, 2024" },
  ];

  // Use actual certificate data for sent certificates
  const sentCertificates = mockCertificates.slice(0, 2).map(cert => ({
    title: cert.title,
    date: cert.date
  }));

  // Add view mode state for grid/list toggle
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  return (
    <div
      className={cn(
        "flex flex-col items-start justify-start w-full max-w-none space-y-6",
        className,
      )}
    >
      {/* Header - Using existing HeaderBar component */}

      {/* Stats Section */}
      <div className="w-full">
        <Card className="bg-white border border-[#f2f2f2] rounded-2xl shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] p-4 w-full">
          <div className="font-sans font-medium text-black text-sm leading-4 mb-4">
            Total certificate status
          </div>
          <div className="flex gap-4 items-start justify-start shadow-[0_3px_4px_0_rgba(0,0,0,0.05)] w-full">
            <StatCard
              title="Minted Certificates"
              value="235"
              trend="56%"
              trendColor="green"
              icon={<MintedCertificatesIcon />}
              className="flex-1"
            />
            <StatCard
              title="Awaiting Certificates"
              value="235"
              trend="56%"
              trendColor="green"
              icon={<AwaitingCertificatesIcon />}
              className="flex-1"
            />
            <StatCard
              title="Certificate in my wallet"
              value="235"
              trend="11%"
              trendColor="red"
              icon={<WalletCertificatesIcon />}
              className="flex-1"
            />
            <StatCard
              title="Transferred Certificates"
              value="235"
              trend="56%"
              trendColor="green"
              icon={<TransferredCertificatesIcon />}
              className="flex-1"
            />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-start w-full flex-1 min-w-0">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-6 items-start justify-start w-full lg:w-[346px] flex-shrink-0">
          <WelcomeCard />

          {/* Last Certificate Owners */}
          <div className="flex flex-col shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]">
            <Card className="bg-white border-[#f2f2f2] border-t border-l border-r border-b-0 rounded-t-2xl rounded-b-none p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex flex-col gap-1">
                  <div className="font-sans font-medium text-[#222526] text-sm leading-4">
                    Last Certificate Owners
                  </div>
                  <div className="font-sans font-normal text-[#69737c] text-[13px] leading-normal">
                    Last 7 days
                  </div>
                </div>
                <button className="font-sans font-medium text-[#615bff] text-[13px] leading-normal pb-1">
                  View all
                </button>
              </div>
              <div className="bg-white border border-[#e1e1e1] rounded-full px-4 py-3 flex items-center justify-between">
                <span className="font-sans font-light text-[#69737c] text-[13px] leading-normal">
                  Search for an item
                </span>
                <div className="w-4 h-4">
                  <SearchIcon />
                </div>
              </div>
            </Card>
            <div className="bg-white border-[#f2f2f2] border-l border-r border-b rounded-bl-2xl rounded-br-2xl px-4 pb-4">
              {certificateOwners.map((owner, index) => (
                <FeedCard key={index} title={owner.title} />
              ))}
            </div>
          </div>

          {/* Last Sent Certificates */}
          <div className="flex flex-col shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]">
            <Card className="bg-white border-[#f2f2f2] border-t border-l border-r border-b-0 rounded-t-2xl rounded-b-none p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex flex-col gap-1">
                  <div className="font-sans font-medium text-[#222526] text-sm leading-4">
                    Last Sent certificates
                  </div>
                  <div className="font-sans font-normal text-[#69737c] text-[13px] leading-normal">
                    Last 7 days
                  </div>
                </div>
                <button className="font-sans font-medium text-[#615bff] text-[13px] leading-normal pb-1">
                  View all
                </button>
              </div>
              <div className="bg-white border border-[#e1e1e1] rounded-full px-4 py-3 flex items-center justify-between">
                <span className="font-sans font-light text-[#69737c] text-[13px] leading-normal">
                  Search for an item
                </span>
                <div className="w-4 h-4">
                  <SearchIcon />
                </div>
              </div>
            </Card>
            <div className="bg-white border-[#f2f2f2] border-l border-r border-b rounded-bl-2xl rounded-br-2xl px-4 pb-4">
              {sentCertificates.map((cert, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="font-sans font-normal text-[#222526] text-sm leading-4">
                    {cert.title}
                  </div>
                  <div className="font-sans font-normal text-[#69737c] text-[13px] leading-normal">
                    {cert.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <Card className="bg-white border border-[#f2f2f2] rounded-2xl shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] p-4 w-full lg:flex-1 min-w-0">
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
              <button className="font-sans font-medium text-[#615bff] text-[13px] leading-normal pb-1">
                View all
              </button>
              <div className="bg-[#fcfafa] border border-[#e1e1e1] rounded-full p-1 flex gap-0.5">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "rounded-[21.5px] p-1 h-auto w-auto",
                    viewMode === 'grid' ? "bg-[#061937] text-white" : "text-[#69737c]"
                  )}
                >
                  <div className="w-4 h-4">
                    <GridIcon />
                  </div>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "rounded-[21.5px] p-1 h-auto w-auto",
                    viewMode === 'list' ? "bg-[#061937] text-white" : "text-[#69737c]"
                  )}
                >
                  <div className="w-4 h-4">
                    <LineIcon />
                  </div>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {viewMode === 'grid' ? (
              <>
                {/* First Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {mintedCertificates.slice(0, 3).map((certificate) => (
                    <CertificateCard
                      key={certificate.id}
                      certificate={certificate}
                      onClick={() => console.log('Certificate clicked:', certificate)}
                    />
                  ))}
                </div>
                {/* Second Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {mintedCertificates.slice(3, 6).map((certificate) => (
                    <CertificateCard
                      key={certificate.id}
                      certificate={certificate}
                      onClick={() => console.log('Certificate clicked:', certificate)}
                    />
                  ))}
                </div>
                {/* Third Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {mintedCertificates.slice(6, 9).map((certificate) => (
                    <CertificateCard
                      key={certificate.id}
                      certificate={certificate}
                      onClick={() => console.log('Certificate clicked:', certificate)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <CertificateListView
                certificates={mintedCertificates}
                onCertificateClick={(certificate) => console.log('Certificate clicked:', certificate)}
                onAddCertificate={() => console.log('Add certificate clicked')}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
