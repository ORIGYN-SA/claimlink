import { useState } from "react";
import { Search, Grid, List, ChevronDown } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CollectionGridView } from "./collection-grid-view";
import { CollectionListView } from "./collection-list-view";
import { mockCollections } from "@/shared/data/collections";
import type { Collection, ViewMode, CollectionStatus } from "../types/collection.types";

export function CollectionsPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CollectionStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleCollectionClick = (collection: Collection) => {
    console.log('Collection clicked:', collection);
    // Navigate to collection detail page
    navigate({ to: `/collections/${collection.id}` });
  };

  const handleCreateCollection = () => {
    console.log('Create collection clicked');
    // Navigate to create collection page
    navigate({ to: '/collections/new' });
  };

  // Filter collections based on search and status
  const filteredCollections = mockCollections.filter(collection => {
    const matchesSearch = collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collection.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collection.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || collection.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCollections = filteredCollections.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-[#fcfafa] rounded-b-[20px] p-6 w-full">
      {/* Search and Filter Actions */}
      <div className="flex gap-4 items-center w-full mb-6">
        {/* Search and Dropdown Actions */}
        <div className="flex-1 flex gap-2 items-center">
          {/* Search */}
          <div className="flex-1 relative">
            <Input
              placeholder="Search for collections"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 rounded-full border-[#e1e1e1] bg-white h-12"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#69737c]" />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as CollectionStatus)}>
            <SelectTrigger className="w-[200px] rounded-full border-[#e1e1e1] bg-white h-12">
              <SelectValue placeholder="Status" />
              <ChevronDown className="w-2 h-2" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Create Collection Button */}
        <Button
          onClick={handleCreateCollection}
          className="bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full px-6 py-3 h-12 gap-2.5"
        >
          <span className="text-lg">+</span>
          Create Collection
        </Button>
      </div>

      {/* Collections List */}
      <div className="bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] border border-[#f2f2f2] rounded-[16px] overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-[#f2f2f2] p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-[18px] font-medium text-[#222526] leading-normal">
                Collections <span className="text-[#69737c]">({filteredCollections.length})</span>
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
            <CollectionGridView
              collections={paginatedCollections}
              onCollectionClick={handleCollectionClick}
              onAddCollection={handleCreateCollection}
            />
          ) : (
            <CollectionListView
              collections={paginatedCollections}
              onCollectionClick={handleCollectionClick}
              onAddCollection={handleCreateCollection}
            />
          )}
        </div>

        {/* Footer - Pagination */}
        <div className="bg-white border-t border-[#f2f2f2] px-10 py-4 rounded-b-[25px] flex items-center justify-between">
          {/* Lines per page */}
          <div className="flex gap-2.5 items-center">
            <span className="text-[13px] text-[#86858a] leading-normal">Lines per page</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(parseInt(value))}
            >
              <SelectTrigger className="w-auto min-w-[60px] h-8 rounded-full border-[#e1e1e1] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 h-8 w-8 rounded-full"
            >
              ←
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "h-7 w-7 rounded-[11px] text-[13px]",
                      currentPage === page
                        ? "bg-[rgba(205,233,236,0.4)] text-[#222526]"
                        : "text-[#69737c]"
                    )}
                  >
                    {page}
                  </Button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="text-[#69737c] text-[13px]">...</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    className="h-7 w-7 rounded-[11px] text-[13px] text-[#69737c]"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 h-8 w-8 rounded-full"
            >
              →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
