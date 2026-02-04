import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useListMyCollections,
  useCollectionTemplate,
} from "@/features/collections";
import type { Template } from "@/shared/data/templates";
import { mockTemplates } from "@/shared/data/templates";
import { BulkImportDialog } from "@/components/common";

interface CollectionSectionProps {
  onTemplateChange?: (template: Template | null) => void;
  onCollectionChange?: (collectionId: string) => void;
  initialCollectionId?: string;
  disabled?: boolean;
}

export function CollectionSection({
  onTemplateChange,
  onCollectionChange,
  initialCollectionId,
  disabled = false,
}: CollectionSectionProps) {
  const [selectedCollection, setSelectedCollection] = useState<string>(
    initialCollectionId || "",
  );
  const [bulkOpen, setBulkOpen] = useState(false);

  // Track the last template ID we passed to parent to avoid infinite loops
  const lastTemplateIdRef = useRef<string | null>(null);
  // Keep latest callback in ref to avoid dependency issues
  const onTemplateChangeRef = useRef(onTemplateChange);
  onTemplateChangeRef.current = onTemplateChange;

  // Fetch collections from backend
  const { data: collectionsResult, isLoading, error } = useListMyCollections();
  const activeCollections = collectionsResult?.collections || [];

  // Fetch template from selected collection's metadata
  const {
    data: collectionTemplate,
    isLoading: isLoadingTemplate,
    error: templateError,
  } = useCollectionTemplate({
    collectionId: selectedCollection,
    enabled: !!selectedCollection,
  });

  // When collection template is loaded, pass it to parent
  useEffect(() => {
    // Skip if still loading
    if (isLoadingTemplate) return;

    let template: Template | null = null;
    let templateId: string | null = null;

    if (collectionTemplate) {
      // Create a Template object from the TemplateStructure
      templateId = `collection-template-${selectedCollection}`;
      template = {
        id: templateId,
        name: "Collection Template",
        description: "Template from collection metadata",
        category: "existing",
        structure: collectionTemplate,
      };
    } else if (selectedCollection) {
      // Fallback: Try to find a matching template from mockTemplates
      // This handles legacy collections without stored templates
      const fallbackTemplate = mockTemplates.find((t) => t.structure);
      if (fallbackTemplate) {
        console.warn(
          `Collection ${selectedCollection} has no stored template, using fallback: ${fallbackTemplate.name}`,
        );
        template = fallbackTemplate;
        templateId = fallbackTemplate.id;
      }
    }

    // Only call if template changed to avoid infinite loops
    if (templateId !== lastTemplateIdRef.current) {
      lastTemplateIdRef.current = templateId;
      onTemplateChangeRef.current?.(template);
    }
  }, [collectionTemplate, selectedCollection, isLoadingTemplate]);

  const handleCollectionChange = (value: string) => {
    setSelectedCollection(value);
    onCollectionChange?.(value);
  };

  return (
    <div className="bg-white box-border flex flex-col gap-4 items-center justify-center px-4 py-4 sm:px-5 sm:py-6 rounded-[25px] w-full border border-[#efece3]">
      <div className="flex flex-col gap-4 items-start justify-center w-full">
        <div className="flex flex-col gap-2 items-start justify-center">
          <div className="font-sans font-semibold text-[#222526] text-base">
            Collection
          </div>
        </div>

        {/* Collection Dropdown */}
        <div className="content-stretch flex flex-col gap-2 items-start justify-center relative w-full">
          <div className="font-sans font-medium leading-[0] not-italic relative shrink-0 text-[#6f6d66] text-[13px] text-nowrap">
            <p className="leading-[normal] whitespace-pre">Collection</p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-[#69737c] text-sm py-2">
              Loading collections...
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-[16px] p-4">
              <p className="text-red-600 text-sm">
                Failed to load collections: {error.message}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && activeCollections.length === 0 && (
            <div className="bg-[#f5f5f5] rounded-[16px] p-4 text-center">
              <p className="text-[#69737c] text-sm mb-2">
                No collections found. Create a collection first.
              </p>
              <Link
                to="/collections/new"
                className="text-[#615bff] text-sm font-medium hover:underline"
              >
                Create Collection →
              </Link>
            </div>
          )}

          {/* Collection Dropdown - Only show if collections exist */}
          {!isLoading && !error && activeCollections.length > 0 && (
            <Select
              value={selectedCollection}
              onValueChange={handleCollectionChange}
              disabled={disabled}
            >
              <SelectTrigger className="bg-white border border-[#e1e1e1] rounded-[100px] h-12 px-4 text-[14px] font-semibold">
                <SelectValue placeholder="Select a collection" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#e1e1e1] rounded-[16px]">
                {activeCollections.map((collection) => (
                  <SelectItem
                    key={collection.id}
                    value={collection.id}
                    className="px-4 py-2 hover:bg-[#f5f5f5] cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[8px] overflow-hidden bg-[#f0f0f0] flex-shrink-0">
                        <img
                          src={collection.imageUrl}
                          alt={collection.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-[#222526] text-[14px]">
                          {collection.title}
                        </span>
                        <span className="text-[#69737c] text-[12px]">
                          {collection.itemCount} items
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Template Status - Auto-loaded from collection */}
        {selectedCollection && (
          <div className="content-stretch flex flex-col gap-2 items-start justify-center relative w-full">
            <div className="font-sans font-medium leading-[0] not-italic relative shrink-0 text-[#6f6d66] text-[13px] text-nowrap">
              <p className="leading-[normal] whitespace-pre">Template</p>
            </div>

            {isLoadingTemplate && (
              <div className="bg-[#f5f5f5] rounded-[16px] p-3 w-full">
                <p className="text-[#69737c] text-sm">Loading template...</p>
              </div>
            )}

            {templateError && (
              <div className="bg-red-50 border border-red-200 rounded-[16px] p-3 w-full">
                <p className="text-red-600 text-sm">
                  Failed to load template: {templateError.message}
                </p>
              </div>
            )}

            {!isLoadingTemplate && !templateError && collectionTemplate && (
              <div className="bg-[#f0fdf4] border border-[#86efac] rounded-[16px] p-3 w-full flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[#22c55e]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-[#166534] text-sm font-medium">
                  Template loaded from collection
                </p>
              </div>
            )}

            {!isLoadingTemplate && !templateError && !collectionTemplate && (
              <div className="bg-amber-50 border border-amber-200 rounded-[16px] p-3 w-full">
                <p className="text-amber-700 text-sm">
                  No template found in collection. Using default template.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bulk Import Button */}
        {/*<div className="content-stretch flex gap-2 items-center justify-center relative shrink-0">
          <Button
            className="bg-[#69737c] hover:bg-[#5a5a5a] text-white rounded-[100px] px-[25px] h-12"
            onClick={() => setBulkOpen(true)}
          >
            Bulk import
          </Button>
        </div>*/}

        <BulkImportDialog open={bulkOpen} onOpenChange={setBulkOpen} />
      </div>
    </div>
  );
}
