import React from "react";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/common/search-input";
import { FeedCard } from "./feed-card";

interface CertificateOwner {
  title: string;
  date: string;
}

interface LastCertificateOwnersSectionProps {
  owners: CertificateOwner[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onViewAll?: () => void;
  className?: string;
}

export const LastCertificateOwnersSection: React.FC<LastCertificateOwnersSectionProps> = ({
  owners,
  searchQuery = "",
  onSearchChange,
  onViewAll,
  className = "",
}) => {
  const handleSearchChange = (value: string) => {
    onSearchChange?.(value);
  };

  return (
    <div className={`flex flex-col w-full shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] ${className}`}>
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
          <button 
            className="font-sans font-medium text-[#615bff] text-[13px] leading-normal pb-1"
            onClick={onViewAll}
          >
            View all
          </button>
        </div>
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for an item"
        />
      </Card>
      <div className="bg-white border-[#f2f2f2] border-l border-r border-b rounded-bl-2xl rounded-br-2xl px-4 pb-4">
        {owners.length > 0 ? (
          owners.map((owner, index) => (
            <FeedCard key={index} title={owner.title} />
          ))
        ) : (
          <div className="py-4 text-center text-[#69737c] text-sm">
            No owners found
          </div>
        )}
      </div>
    </div>
  );
};
