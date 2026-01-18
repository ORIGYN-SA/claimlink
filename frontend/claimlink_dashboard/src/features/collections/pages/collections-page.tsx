import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  SearchInput,
  FilterSelect,
  StandardizedGridListContainer,
  type ViewMode,
  type ListColumn,
  type ListAction,
} from "@/components/common";
import type { FilterOption } from "@/components/common";
import { CollectionStatusBadge } from "../components/collection-status-badge";
import { useListMyCollections } from "@/features/collections";
import type { Collection, CollectionStatus } from "../types/collection.types";
import { Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function CollectionsPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CollectionStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch collections from backend
  const { data, isLoading, isError, error } = useListMyCollections({
    offset: (currentPage - 1) * itemsPerPage,
    limit: itemsPerPage,
  });

  // Show error toast if fetch fails
  if (isError) {
    toast.error(
      `Failed to load collections: ${error?.message || "Unknown error"}`,
    );
  }

  // Status filter options
  const statusOptions: FilterOption[] = [
    { value: "all", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Draft", label: "Draft" },
  ];

  // List view columns configuration
  const listColumns: ListColumn[] = [
    { key: "ref", label: "Ref", width: "50px" },
    { key: "createdDate", label: "Created", width: "120px" },
    {
      key: "name",
      label: "Name",
      width: "1fr",
      render: (collection: Collection) => (
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-[16px] overflow-hidden bg-[#f0f0f0] flex-shrink-0">
            <img
              src={collection.imageUrl}
              alt={collection.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-base font-medium text-[#222526] truncate">
              {collection.title}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      width: "1fr",
      render: (collection: Collection) => (
        <div className="text-[14px] font-normal text-[#69737c] truncate">
          {collection.description}
        </div>
      ),
    },
    {
      key: "itemCount",
      label: "Items",
      width: "100px",
      render: (collection: Collection) => (
        <div className="text-[14px] font-medium text-[#69737c]">
          {collection.itemCount}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "120px",
      render: (collection: Collection) => (
        <div className="flex items-center">
          <CollectionStatusBadge backendStatus={collection.backendStatus} />
        </div>
      ),
    },
  ];

  const handleCollectionClick = (collection: Collection) => {
    console.log("Collection clicked:", collection);
    // Navigate to collection detail page
    navigate({ to: `/collections/${collection.id}` });
  };

  const handleCreateCollection = () => {
    console.log("Create collection clicked");
    // Navigate to create collection page
    navigate({ to: "/collections/new" });
  };

  const handleViewCollection = (collection: Collection) => {
    navigate({ to: `/collections/${collection.id}` });
  };

  const handleEditCollection = (collection: Collection) => {
    // TODO: Navigate to edit page when implemented
    toast.info(`Edit collection: ${collection.title}`);
    console.log("Edit collection:", collection);
  };

  const handleDeleteCollection = (collection: Collection) => {
    // TODO: Implement delete confirmation dialog
    toast.info(`Delete collection: ${collection.title}`);
    console.log("Delete collection:", collection);
  };

  // Define actions for list view dropdown menu
  const listActions: ListAction[] = [
    {
      label: "View Collection",
      icon: Eye,
      onClick: handleViewCollection,
    },
    {
      label: "Edit Collection",
      icon: Edit,
      onClick: handleEditCollection,
    },
    {
      label: "Delete Collection",
      icon: Trash2,
      onClick: handleDeleteCollection,
      variant: "destructive",
    },
  ];

  // Get collections from API or use empty array
  const collections = data?.collections || [];
  const totalCount = data?.totalCount || 0;

  // Filter collections based on search and status (client-side filtering)
  const filteredCollections = useMemo(() => {
    return collections.filter((collection) => {
      const matchesSearch =
        collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        collection.creator.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || collection.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [collections, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Add reference numbers for list view
  const paginatedCollectionsWithRef = filteredCollections.map(
    (collection, index) => ({
      ...collection,
      ref: `#${String(startIndex + index + 1).padStart(3, "0")}`,
    }),
  );

  return (
    <div className="bg-[#fcfafa] rounded-b-[20px] w-full">
      {/* Search and Filter Actions */}
      <div className="flex flex-wrap gap-2 md:gap-4 items-center w-full mb-6">
        {/* Search and Dropdown Actions */}
        <div className="flex-1 flex gap-2 items-center min-w-0">
          {/* Search */}
          <SearchInput
            placeholder="Search for collections"
            value={searchQuery}
            onChange={setSearchQuery}
            className="flex-1 min-w-0"
          />

          {/* Status Filter */}
          <FilterSelect
            placeholder="Status"
            value={statusFilter}
            options={statusOptions}
            onValueChange={(value) =>
              setStatusFilter(value as CollectionStatus)
            }
            width="w-[120px] md:w-[200px]"
          />
        </div>

        {/* Create Collection Button */}
        <Button
          onClick={handleCreateCollection}
          className="bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full px-3 md:px-6 py-3 h-12 gap-1 md:gap-2.5 text-sm md:text-base"
        >
          <span className="text-lg">+</span>
          <span className="hidden sm:inline">Create Collection</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>

      {/* Collections List */}
      <StandardizedGridListContainer
        title="Collections"
        totalCount={filteredCollections.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        items={isLoading ? [] : paginatedCollectionsWithRef}
        onItemClick={handleCollectionClick}
        onAddItem={handleCreateCollection}
        showCertifiedBadge={false}
        addButtonText="Create a collection"
        addButtonDescription="Create a new collection"
        listColumns={listColumns}
        listActions={listActions}
        addItemText={isLoading ? "Loading collections..." : "Create your first collection"}
        showMoreActions={true}
      />

      {/* Footer - Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
}
