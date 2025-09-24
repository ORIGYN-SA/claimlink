import { useState } from "react";
import { Grid, List } from "lucide-react";
// import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pagination, SearchInput, FilterSelect } from "@/components/common";
import type { FilterOption } from "@/components/common";
import { NFTList } from "../../nfts/components/nft-list";
import { useNFTs } from "../../nfts/api/nfts.queries";
import type { NFT } from "../../nfts/types/nft.types";

export function MintNFTPage() {
  // const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Fetch NFTs using React Query
  const { data: nfts = [] } = useNFTs();
  // const { isLoading } = useNFTs();


  const handleNFTClick = (nft: NFT) => {
    console.log('NFT clicked:', nft);
    // TODO: Navigate to NFT detail page
    // navigate({ to: '/nfts/$nftId', params: { nftId: nft.id } });
  };

  const handleMintNFT = () => {
    console.log('Mint NFT clicked');
    // TODO: Navigate to mint NFT form
    // navigate({ to: '/mint_nft/new' });
  };

  // Filter NFTs based on search and filters
  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nft.collectionName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || nft.status === statusFilter;
    const matchesRarity = rarityFilter === 'all' || nft.rarity === rarityFilter;
    return matchesSearch && matchesStatus && matchesRarity;
  });

  // Pagination
  const totalPages = Math.ceil(filteredNFTs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNFTs = filteredNFTs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-[#fcfafa] rounded-b-[20px] p-6 w-full">
      {/* Search and Filter Actions */}
      <div className="flex gap-4 items-center w-full mb-6">
        {/* Search and Dropdown Actions */}
        <div className="flex-1 flex gap-2 items-center">
          {/* Search */}
          <SearchInput
            placeholder="Search for an NFT"
            value={searchQuery}
            onChange={setSearchQuery}
          />

          {/* Status Filter */}
          <FilterSelect
            placeholder="Status"
            value={statusFilter}
            options={statusOptions}
            onValueChange={setStatusFilter}
            width="w-[180px]"
          />

          {/* Rarity Filter */}
          <FilterSelect
            placeholder="Rarity"
            value={rarityFilter}
            options={rarityOptions}
            onValueChange={setRarityFilter}
            width="w-[150px]"
          />
        </div>

        {/* Mint NFT Button */}
        <Button
          onClick={handleMintNFT}
          className="bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full px-6 py-3 h-12 gap-2.5"
        >
          <List className="w-2 h-2" />
          Mint a NFT
        </Button>
      </div>

      {/* NFT List */}
      <div className="bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] border border-[#f2f2f2] rounded-[16px] overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-[#f2f2f2] p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium text-[#222526] leading-normal">
                NFTs <span className="text-[#69737c]">({filteredNFTs.length})</span>
              </h2>
            </div>

            {/* View Toggle */}
            <div className="bg-[#fcfafa] border border-[#e1e1e1] rounded-full p-1 flex gap-0.5">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
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
                onClick={() => setViewMode('list')}
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
            <NFTList
              nfts={paginatedNFTs}
              onNFTClick={handleNFTClick}
              onMintNFT={handleMintNFT}
            />
          ) : (
            // TODO: Implement NFT list view
            <div className="text-center py-8 text-[#69737c]">
              List view coming soon...
            </div>
          )}
        </div>

        {/* Footer - Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
}
