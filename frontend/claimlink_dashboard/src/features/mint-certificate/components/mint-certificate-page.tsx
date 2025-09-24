import { useState } from "react";
import { Grid, List, ChevronDown, MoreHorizontal } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Pagination, SearchInput } from "@/components/common";
import { TokenGridView } from "@/components/common/token-grid-view";
import { mockCertificates } from "@/shared/data/certificates";
import type { Certificate } from "../../certificates/types/certificate.types";

export function MintCertificatePage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleCertificateClick = (certificate: Certificate) => {
    console.log('Certificate clicked:', certificate);
  };

  const handleAddCertificate = () => {
    console.log('Add certificate clicked');
  };

  const handleMintCertificate = () => {
    navigate({ to: '/mint_certificate/new' });
  };

  // Filter certificates based on search and status
  const filteredCertificates = mockCertificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.collectionName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCertificates = filteredCertificates.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-[#fcfafa] rounded-b-[20px] p-6 w-full">
      {/* Search and Filter Actions */}
      <div className="flex gap-4 items-center w-full mb-6">
        {/* Search and Dropdown Actions */}
        <div className="flex-1 flex gap-2 items-center">
          {/* Search */}
          <SearchInput
            placeholder="Search for an item"
            value={searchQuery}
            onChange={setSearchQuery}
          />

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[250px] rounded-full border-[#e1e1e1] bg-white h-12">
              <SelectValue placeholder="Status" />
              <ChevronDown className="w-2 h-2" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Minted">Minted</SelectItem>
              <SelectItem value="Transferred">Transferred</SelectItem>
              <SelectItem value="Waiting">Waiting for minting</SelectItem>
              <SelectItem value="Burned">Burned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mint Certificate Button */}
        <Button
          onClick={handleMintCertificate}
          className="bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full px-6 py-3 h-12 gap-2.5"
        >
          <MoreHorizontal className="w-2 h-2" />
          Mint a certificate
        </Button>
      </div>

      {/* Certificate List */}
      <div className="bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] border border-[#f2f2f2] rounded-[16px] overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-[#f2f2f2] p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium text-[#222526] leading-normal">
                Certificate <span className="text-[#69737c]">({filteredCertificates.length})</span>
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
            <TokenGridView
              tokens={paginatedCertificates}
              showCertifiedBadge={true} // Certificates show ORIGYN badge
              onTokenClick={handleCertificateClick}
              onAddToken={handleAddCertificate}
              addButtonText="Create a certificate"
              addButtonDescription="Create a campaign to distribute your NFTs via claim links"
            />
          ) : (
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
