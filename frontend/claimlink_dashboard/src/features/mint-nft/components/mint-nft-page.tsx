import { useState } from "react";
// import { useNavigate } from "@tanstack/react-router";
import { Pagination } from "@/components/common";
import { MintNFTActions } from "./mint-nft-actions";
import { MintNFTGrid } from "./mint-nft-grid";
import { useNFTs } from "../../nfts/api/nfts.queries";
import type { NFT } from "../../nfts/types/nft.types";

export function MintNFTPage() {
  // const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleRarityChange = (rarity: string) => {
    setRarityFilter(rarity);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing page size
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
    <div className="space-y-6 max-w-none">
      {/* Search and Filter Actions */}
      <MintNFTActions
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        rarityFilter={rarityFilter}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onRarityChange={handleRarityChange}
        onMintNFT={handleMintNFT}
      />

      {/* NFT Grid */}
      <MintNFTGrid
        nfts={paginatedNFTs}
        totalCount={filteredNFTs.length}
        onNFTClick={handleNFTClick}
        onMintNFT={handleMintNFT}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}
