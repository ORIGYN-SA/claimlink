import React from "react";
import { List } from "lucide-react";
import { SearchInput, FilterSelect } from "@/components/common";
import type { FilterOption } from "@/components/common";
import { Button } from "@/components/ui/button";

interface MintNFTActionsProps {
  searchQuery: string;
  statusFilter: string;
  rarityFilter: string;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string) => void;
  onRarityChange: (rarity: string) => void;
  onMintNFT: () => void;
}

const MintNFTActions: React.FC<MintNFTActionsProps> = ({
  searchQuery,
  statusFilter,
  rarityFilter,
  onSearchChange,
  onStatusChange,
  onRarityChange,
  onMintNFT,
}) => {
  // Filter options
  const statusOptions: FilterOption[] = [
    { value: 'all', label: 'All Status' },
    { value: 'Minted', label: 'Minted' },
    { value: 'Transferred', label: 'Transferred' },
    { value: 'Waiting', label: 'Waiting for minting' },
    { value: 'Burned', label: 'Burned' }
  ];

  const rarityOptions: FilterOption[] = [
    { value: 'all', label: 'All Rarity' },
    { value: 'Common', label: 'Common' },
    { value: 'Uncommon', label: 'Uncommon' },
    { value: 'Rare', label: 'Rare' },
    { value: 'Epic', label: 'Epic' },
    { value: 'Legendary', label: 'Legendary' }
  ];

  return (
    <div className="flex gap-4 items-center w-full">
      {/* Search and Dropdown Actions */}
      <div className="flex-1 flex gap-2 items-center">
        {/* Search */}
        <SearchInput
          placeholder="Search for an NFT"
          value={searchQuery}
          onChange={onSearchChange}
        />

        {/* Status Filter */}
        <FilterSelect
          placeholder="Status"
          value={statusFilter}
          options={statusOptions}
          onValueChange={onStatusChange}
          width="w-[180px]"
        />

        {/* Rarity Filter */}
        <FilterSelect
          placeholder="Rarity"
          value={rarityFilter}
          options={rarityOptions}
          onValueChange={onRarityChange}
          width="w-[150px]"
        />
      </div>

      {/* Mint NFT Button */}
      <Button
        onClick={onMintNFT}
        className="bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full px-6 py-3 h-12 gap-2.5"
      >
        <List className="w-2 h-2" />
        Mint a NFT
      </Button>
    </div>
  );
};

export { MintNFTActions };
