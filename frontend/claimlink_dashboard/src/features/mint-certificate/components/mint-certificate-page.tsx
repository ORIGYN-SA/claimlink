import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Pagination, StandardizedGridListContainer, type ViewMode, type ListColumn, type ListAction, TokenStatusBadge } from "@/components/common";
import { CertificatesActions } from "./certificates-actions";
import { mockCertificates } from "@/shared/data/certificates";
import type { Certificate } from "../../certificates/types/certificate.types";
import { Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function MintCertificatePage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleCertificateClick = (certificate: Certificate) => {
    console.log('Certificate clicked:', certificate);
    // Navigate to certificate detail page
    navigate({ to: `/mint_certificate/${certificate.id}` });
  };

  const handleAddCertificate = () => {
    console.log('Add certificate clicked');
    // Navigate to create certificate page
    navigate({ to: '/mint_certificate/new' });
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

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Define columns for list view
  const listColumns: ListColumn[] = [
    {
      key: 'title',
      label: 'Certificate',
      width: 'w-[45%]',
      render: (certificate: Certificate) => {
        if (!certificate) return null;

        return (
          <div className="flex items-center gap-3">
            <img
              src={certificate.imageUrl || '/placeholder-image.jpg'}
              alt={certificate.title || 'Certificate'}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <div className="font-medium text-[#222526] text-sm">{certificate.title || 'Untitled Certificate'}</div>
              <div className="text-xs text-[#69737c]">{certificate.collectionName || 'Unknown Collection'}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      width: 'w-[25%]',
      render: (certificate: Certificate) => {
        if (!certificate) return null;
        return (
          <TokenStatusBadge status={certificate.status} />
        );
      },
    },
    {
      key: 'date',
      label: 'Created',
      width: 'w-[15%]',
      render: (certificate: Certificate) => {
        if (!certificate) return null;
        return (
          <div className="text-sm text-[#69737c]">{certificate.date || 'Unknown'}</div>
        );
      },
    },
  ];

  // Define actions for list view dropdown menu
  const listActions: ListAction[] = [
    {
      label: 'View Details',
      icon: Eye,
      onClick: (certificate: Certificate) => {
        handleCertificateClick(certificate);
      },
    },
    {
      label: 'Create from Template',
      icon: Edit,
      onClick: () => {
        handleMintCertificate();
      },
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: (certificate: Certificate) => {
        toast.info(`Delete certificate: ${certificate.title}`);
      },
      variant: 'destructive',
    },
  ];

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
      <StandardizedGridListContainer
        title="Certificate"
        totalCount={filteredCertificates.length}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        showViewToggle={true}
        items={paginatedCertificates}
        onItemClick={handleCertificateClick}
        onAddItem={handleAddCertificate}
        showCertifiedBadge={true}
        addButtonText="Create a certificate"
        addButtonDescription="Create a campaign to distribute your NFTs via claim links"
        listColumns={listColumns}
        listActions={listActions}
        showMoreActions={true}
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
