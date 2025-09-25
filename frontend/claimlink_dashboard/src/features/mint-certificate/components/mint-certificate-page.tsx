import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Pagination } from "@/components/common";
import { CertificatesActions } from "./certificates-actions";
import { CertificatesGrid } from "./certificates-grid";
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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing page size
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
    <div className="space-y-6 max-w-none">
      <CertificatesActions
        searchQuery={searchQuery}
        selectedStatus={statusFilter}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onMintCertificate={handleMintCertificate}
      />
      <CertificatesGrid
        certificates={paginatedCertificates}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onCertificateClick={handleCertificateClick}
        onAddCertificate={handleAddCertificate}
      />
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
