// src/features/collections/components/collection-detail-page.tsx
import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Grid, List, Info } from 'lucide-react'
import { StandardizedGridView, StandardizedListView, type ListColumn, SearchInput, FilterSelect, type FilterOption, Pagination, AddStorageDialog, TokenStatusBadge } from '@/components/common'
import { CanisterImage } from '@/components/common/canister-image/canister-image'
import type { Certificate } from '@/features/certificates/types/certificate.types'
import { useCollectionCertificates } from '@/features/certificates'
import { useFetchCollectionInfo } from '@/features/collections'

interface CollectionDetailPageProps {
  collectionId: string
}

export function CollectionDetailPage({ collectionId }: CollectionDetailPageProps) {
  const navigate = useNavigate()
  const [isAddStorageDialogOpen, setIsAddStorageDialogOpen] = React.useState(false)

  // Fetch collection metadata from ClaimLink backend
  const { data: collection, isLoading: isLoadingCollection, isError: isCollectionError } = useFetchCollectionInfo({
    canisterId: collectionId,
    enabled: !!collectionId
  });

  // Fetch real certificates from ORIGYN canister
  const { data: nfts = [], isLoading: isLoadingNfts } = useCollectionCertificates(collectionId);

  console.log('[CollectionDetailPage] NFTs fetched:', {
    count: nfts.length,
    nfts: nfts.map(nft => ({
      id: nft.id,
      title: nft.title,
      imageUrl: nft.imageUrl,
      status: nft.status
    }))
  });

  // Use real NFTs from ORIGYN canister
  const allCertificates = nfts;

  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)

  // Status filter options
  const statusFilterOptions: FilterOption[] = [
    { value: 'all', label: 'All Status' },
    { value: 'minted', label: 'Minted' },
    { value: 'waiting', label: 'Waiting' },
    { value: 'transferred', label: 'Transferred' },
    { value: 'burned', label: 'Burned' }
  ]

  // Apply filters (search and status)
  const filteredCertificates = React.useMemo(() => {
    return allCertificates.filter((cert) => {
      // Status filter
      const matchesStatus = statusFilter === 'all' || cert.status.toLowerCase() === statusFilter.toLowerCase()
      
      // Search filter
      const matchesSearch = searchQuery === '' || 
        cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.collectionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.id.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesStatus && matchesSearch
    })
  }, [allCertificates, statusFilter, searchQuery])

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCertificates = filteredCertificates.slice(startIndex, endIndex)

  // Show loading state while fetching collection or NFTs
  if (isLoadingCollection || (collection && isLoadingNfts)) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading collection...</p>
        </div>
      </div>
    );
  }

  // Show error state if collection not found
  if (isCollectionError || !collection) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-destructive">Collection not found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate({ to: '/collections' })}
          >
            Back to Collections
          </Button>
        </div>
      </div>
    );
  }

  const handleCertificateClick = (certificate: any) => {
    console.log('Certificate clicked:', certificate)
    // Navigate to certificate detail page with format: collectionId:tokenId
    navigate({
      to: '/mint_certificate/$certificateId',
      params: { certificateId: `${collectionId}:${certificate.id}` }
    })
  }

  const handleAddCertificate = () => {
    // Navigate to mint certificate page with collection ID pre-selected
    navigate({ to: '/mint_certificate/new', search: { collectionId } })
  }

  // List view columns configuration for certificates
  const certificateListColumns: ListColumn[] = [
    { key: 'ref', label: 'Ref', width: '50px' },
    { key: 'date', label: 'Date', width: '100px' },
    { 
      key: 'title', 
      label: 'Name', 
      width: '1fr',
      render: (certificate: Certificate) => (
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-[16px] overflow-hidden bg-[#f0f0f0] flex-shrink-0">
            {certificate.imageUrl && (
              <CanisterImage
                src={certificate.imageUrl}
                alt={certificate.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-base font-medium text-[#222526] truncate">
              {certificate.title}
            </div>
          </div>
        </div>
      )
    },
    { 
      key: 'collectionName', 
      label: 'Collection', 
      width: '1fr',
      render: (certificate: Certificate) => (
        <div className="text-[14px] font-medium text-[#69737c] truncate">
          {certificate.collectionName}
        </div>
      )
    },
    { 
      key: 'id', 
      label: 'Token ID', 
      width: '150px',
      render: (certificate: Certificate) => (
        <div className="text-[14px] font-normal text-[#69737c] font-mono">
          {certificate.id.length > 12
            ? `${certificate.id.slice(0, 12)}...`
            : certificate.id
          }
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      width: '150px',
      render: (certificate: Certificate) => (
        <div className="flex items-center">
          <TokenStatusBadge status={certificate.status} />
        </div>
      )
    }
  ]

  // Add reference numbers to certificates for list view (based on actual position, not paginated position)
  const certificatesWithRef = paginatedCertificates.map((cert, index) => ({
    ...cert,
    ref: `#${String(startIndex + index + 1).padStart(3, '0')}`
  }))

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Collections #{collectionId}
          </p>
          <h1 className="text-2xl font-medium text-foreground">
            {collection.title}
          </h1>
        </div>
      </div>

      {/* Recap Section */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Collection Image and Info */}
            <div className="flex gap-6 min-w-0 flex-1">
              <div className="w-32 h-32 bg-black rounded-lg overflow-hidden flex-shrink-0">
                {collection.imageUrl && (
                  <CanisterImage
                    src={collection.imageUrl}
                    alt={collection.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-medium text-foreground mb-3">
                  {collection.title}
                </h2>
                {collection.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {collection.description}
                  </p>
                )}
                <Badge variant="secondary" className="text-xs">
                  Deployed
                </Badge>
              </div>
            </div>

            {/* Canister ID */}
            <div className="flex-shrink-0">
              <h3 className="text-xs font-normal text-muted-foreground uppercase tracking-wider mb-2">
                Canister ID
              </h3>
              <p className="text-sm font-medium text-foreground font-mono">
                {collection.id.slice(0, 20)}...
              </p>
            </div>

            {/* TODO: Cycles - requires IC management canister query */}
            <div className="flex-shrink-0">
              <h3 className="text-xs font-normal text-muted-foreground uppercase tracking-wider mb-2">
                Cycles
              </h3>
              <p className="text-lg font-medium text-foreground">
                -
              </p>
            </div>

            {/* TODO: Storage - requires IC management canister query */}
            <div className="flex-shrink-0 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
                  Storage
                </h3>
                <Info className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-1">
                  <div
                    className="bg-primary h-1 rounded-full"
                    style={{ width: '0%' }}
                  />
                </div>
                <p className="text-xs font-medium text-foreground">
                  - / - GB
                </p>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  disabled
                >
                  Add more storage
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Section */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          {/* Header with search and controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 flex-1">
              <SearchInput
                placeholder="Search for an item"
                value={searchQuery}
                onChange={setSearchQuery}
                className="max-w-md"
              />
              <FilterSelect
                placeholder="Status"
                value={statusFilter}
                options={statusFilterOptions}
                onValueChange={setStatusFilter}
                width="w-[180px]"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-2"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* DISABLED: Collection editing has been removed. Collections are immutable after creation. */}
              {/* <Button
                variant="outline"
                className="gap-2"
                onClick={() => navigate({ to: '/collections/$collectionId/edit', params: { collectionId } })}
              >
                <Edit className="w-4 h-4" />
                Edit collection
              </Button> */}
            </div>
          </div>

          {/* Certificates Count */}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-foreground">
              Certificate <span className="text-muted-foreground">({filteredCertificates.length})</span>
            </h3>
          </div>

          {/* Certificates Grid/List */}
          <div className="space-y-4">
            {viewMode === 'grid' ? (
              <StandardizedGridView
                items={paginatedCertificates}
                showCertifiedBadge={true}
                onItemClick={handleCertificateClick}
                onAddItem={handleAddCertificate}
                addButtonText="Create a certificate"
                addButtonDescription="Create a new certificate"
                showAddButton={true}
              />
            ) : (
              <StandardizedListView
                items={certificatesWithRef}
                columns={certificateListColumns}
                onItemClick={handleCertificateClick}
                onAddItem={handleAddCertificate}
                addItemText="Create your first certificate"
              />
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            itemsPerPageOptions={[10, 25, 50]}
            className="mt-6"
          />
        </CardContent>
      </Card>

      {/* Add Storage Dialog */}
      <AddStorageDialog
        isOpen={isAddStorageDialogOpen}
        onOpenChange={setIsAddStorageDialogOpen}
        currentBalance={3800.02}
        currentStorage={{
          used: '1.56',
          total: '2.0',
          percentage: 78
        }}
      />
    </div>
  )
}
