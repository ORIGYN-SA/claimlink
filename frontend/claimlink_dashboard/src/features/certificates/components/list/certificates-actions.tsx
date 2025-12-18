import React from "react";
import { MoreHorizontal } from "lucide-react";
import { SearchInput, FilterSelect } from "@/components/common";
import type { FilterOption } from "@/components/common";
import { Button } from "@/components/ui/button";

interface CertificatesActionsProps {
  searchQuery: string;
  selectedStatus: string;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string) => void;
  onMintCertificate: () => void;
}

const CertificatesActions: React.FC<CertificatesActionsProps> = ({
  searchQuery,
  selectedStatus,
  onSearchChange,
  onStatusChange,
  onMintCertificate,
}) => {
  // Status filter options
  const statusOptions: FilterOption[] = [
    { value: 'all', label: 'All Status' },
    { value: 'Minted', label: 'Minted' },
    { value: 'Transferred', label: 'Transferred' },
    { value: 'Waiting', label: 'Waiting for minting' },
    { value: 'Burned', label: 'Burned' }
  ];

  return (
    <div className="flex gap-4 items-center w-full">
      {/* Search and Dropdown Actions */}
      <div className="flex-1 flex gap-2 items-center">
        {/* Search */}
        <SearchInput
          placeholder="Search for an item"
          value={searchQuery}
          onChange={onSearchChange}
        />

        {/* Status Filter */}
        <FilterSelect
          placeholder="Status"
          value={selectedStatus}
          options={statusOptions}
          onValueChange={onStatusChange}
          width="w-[250px]"
        />
      </div>

      {/* Mint Certificate Button */}
      <Button
        onClick={onMintCertificate}
        className="bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full px-6 py-3 h-12 gap-2.5"
      >
        <MoreHorizontal className="w-2 h-2" />
        Mint a certificate
      </Button>
    </div>
  );
};

export { CertificatesActions };
