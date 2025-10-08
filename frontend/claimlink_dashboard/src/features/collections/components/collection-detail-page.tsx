// src/features/collections/components/collection-detail-page.tsx
import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Grid, List, Info, Edit, Wallet, User } from 'lucide-react'
import { getCollectionById, mockCollections } from '@/shared/data/collections'
import { getCertificatesForCollection, mockCertificates } from '@/shared/data/certificates'
import { StandardizedGridView, StandardizedListView, type ListColumn } from '@/components/common'
import { CertificateStatusBadge } from '@/features/certificates'
import type { Certificate } from '@/features/certificates/types/certificate.types'

interface CollectionDetailPageProps {
  collectionId: string
}

export function CollectionDetailPage({ collectionId }: CollectionDetailPageProps) {
  // Get collection data from shared mock data
  const collection = getCollectionById(collectionId) || mockCollections[0] // fallback to first collection if not found

  // Get certificates for this specific collection from shared data
  const collectionCertificates = getCertificatesForCollection(collectionId, mockCollections)

  // Fallback to first few certificates if no specific collection certificates found
  const certificatesToShow = collectionCertificates.length > 0
    ? collectionCertificates.slice(0, 4) // Show first 4 certificates for the collection
    : mockCertificates.slice(0, 4) // Fallback to first 4 general certificates

  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')

  const handleCertificateClick = (certificate: any) => {
    console.log('Certificate clicked:', certificate)
    // TODO: Navigate to certificate detail or open modal
  }

  const handleAddCertificate = () => {
    console.log('Add certificate clicked')
    // TODO: Navigate to create certificate page or open modal
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
            <img
              src={certificate.imageUrl}
              alt={certificate.title}
              className="w-full h-full object-cover"
            />
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
          <CertificateStatusBadge status={certificate.status} />
        </div>
      )
    }
  ]

  // Add reference numbers to certificates for list view
  const certificatesWithRef = certificatesToShow.map((cert, index) => ({
    ...cert,
    ref: `#${String(index + 1).padStart(3, '0')}`
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
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Wallet className="w-4 h-4" />
            1,256 OGY
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <User className="w-4 h-4" />
            My Account: 55vo...3dfa
          </Button>
        </div>
      </div>

      {/* Recap Section */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Collection Image and Info */}
            <div className="flex gap-6 min-w-0 flex-1">
              <div className="w-32 h-32 bg-black rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={collection.imageUrl}
                  alt={collection.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-medium text-foreground mb-3">
                  {collection.title}
                </h2>
                <Badge variant="secondary" className="text-xs">
                  Deployed
                </Badge>
              </div>
            </div>

            {/* Data Structure */}
            <div className="flex-shrink-0">
              <h3 className="text-xs font-normal text-muted-foreground uppercase tracking-wider mb-2">
                Data Structure
              </h3>
              <p className="text-lg font-medium text-foreground">
                65a10e1c187f6afe9c993527
              </p>
            </div>

            {/* Cycles */}
            <div className="flex-shrink-0">
              <h3 className="text-xs font-normal text-muted-foreground uppercase tracking-wider mb-2">
                Cycles
              </h3>
              <p className="text-lg font-medium text-foreground">
                656,503,874,712
              </p>
            </div>

            {/* Storage */}
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
                    style={{ width: '78%' }}
                  />
                </div>
                <p className="text-xs font-medium text-foreground">
                  1.56 / 2.0 GB
                </p>
                <Button variant="default" size="sm" className="w-full">
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
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search for an item"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="minted">Minted</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                  <SelectItem value="burned">Burned</SelectItem>
                </SelectContent>
              </Select>
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

              <Button variant="outline" className="gap-2">
                <Edit className="w-4 h-4" />
                Edit template
              </Button>
            </div>
          </div>

          {/* Certificates Count */}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-foreground">
              Certificate <span className="text-muted-foreground">({collection.itemCount})</span>
            </h3>
          </div>

          {/* Certificates Grid/List */}
          <div className="space-y-4">
            {viewMode === 'grid' ? (
              <StandardizedGridView
                items={certificatesToShow}
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
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Lines per page</span>
              <Select defaultValue="10">
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <div className="flex items-center gap-1">
                <Button variant="default" size="sm" className="w-8 h-8 p-0">1</Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">2</Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">3</Button>
                <span className="text-muted-foreground">...</span>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">12</Button>
              </div>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
