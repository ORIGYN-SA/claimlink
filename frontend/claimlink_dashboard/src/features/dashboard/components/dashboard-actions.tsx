import React from "react";
import { SearchInput } from "@/components/common";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface DashboardActionsProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onCreateCertificate?: () => void;
  onCreateNFT?: () => void;
}

export const DashboardActions: React.FC<DashboardActionsProps> = ({
  searchQuery = "",
  onSearchChange,
  onCreateCertificate,
  onCreateNFT,
}) => {
  return (
    <div className="flex gap-4 items-center w-full">
      {/* Search */}
      <div className="flex-1">
        <SearchInput
          placeholder="Search certificates, collections, templates..."
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={onCreateCertificate}
          className="bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full px-6 py-3 h-12 gap-2.5"
        >
          <MoreHorizontal className="w-2 h-2" />
          Create Certificate
        </Button>
        
        <Button
          onClick={onCreateNFT}
          variant="outline"
          className="border-[#222526] text-[#222526] hover:bg-[#222526]/10 rounded-full px-6 py-3 h-12 gap-2.5"
        >
          <MoreHorizontal className="w-2 h-2" />
          Create NFT
        </Button>
      </div>
    </div>
  );
};
