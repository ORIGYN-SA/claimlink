import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/search-input";

interface SentCertificate {
  title: string;
  date: string;
}

interface LastSentCertificatesSectionProps {
  certificates: SentCertificate[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onViewAll?: () => void;
  onCertificateClick?: (certificate: SentCertificate) => void;
  className?: string;
}

export const LastSentCertificatesSection: React.FC<LastSentCertificatesSectionProps> = ({
  certificates,
  searchQuery = "",
  onSearchChange,
  onViewAll,
  onCertificateClick,
  className = "",
}) => {
  const handleSearchChange = (value: string) => {
    onSearchChange?.(value);
  };

  const handleCertificateClick = (certificate: SentCertificate) => {
    onCertificateClick?.(certificate);
  };

  return (
    <div className={`flex flex-col w-full shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] ${className}`}>
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
          <Button 
            variant="link"
            className="h-auto p-0 font-sans font-medium text-[#615bff] text-[13px] leading-normal"
            onClick={onViewAll}
          >
            View all
          </Button>
        </div>
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for an item"
        />
      </Card>
      <div className="bg-white border-[#f2f2f2] border-l border-r border-b rounded-bl-2xl rounded-br-2xl px-4 pb-4">
        {certificates.length > 0 ? (
          certificates.map((cert, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between py-2 cursor-pointer hover:bg-[#fcfafa] rounded px-2 -mx-2"
              onClick={() => handleCertificateClick(cert)}
            >
              <div className="font-sans font-normal text-[#222526] text-sm leading-4">
                {cert.title}
              </div>
              <div className="font-sans font-normal text-[#69737c] text-[13px] leading-normal">
                {cert.date}
              </div>
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-[#69737c] text-sm">
            No certificates found
          </div>
        )}
      </div>
    </div>
  );
};
