import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListMyCollections } from "@/features/collections";
import { templateOptions } from "@/shared/data/templates";
import type { Template } from "@/shared/data/templates";
import { BulkImportDialog } from "@/components/common";

interface CollectionSectionProps {
  onTemplateChange?: (template: Template | null) => void;
  onCollectionChange?: (collectionId: string) => void;
  initialCollectionId?: string;
}

export function CollectionSection({
  onTemplateChange,
  onCollectionChange,
  initialCollectionId,
}: CollectionSectionProps) {
  const [selectedCollection, setSelectedCollection] = useState<string>(
    initialCollectionId || "",
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [bulkOpen, setBulkOpen] = useState(false);

  // Fetch collections from backend
  const { data: collectionsResult, isLoading, error } = useListMyCollections();
  const activeCollections = collectionsResult?.collections || [];

  // Use templateOptions (industry-specific templates) for the dropdown
  const availableTemplates = templateOptions;

  const handleCollectionChange = (value: string) => {
    setSelectedCollection(value);
    onCollectionChange?.(value);
  };

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);

    // Find the selected template and pass it to parent
    const template = availableTemplates.find((t) => t.id === value);
    onTemplateChange?.(template || null);
  };

  return (
    <div className="bg-white box-border flex flex-col gap-4 items-center justify-center px-5 py-6 rounded-[25px] w-full border border-[#efece3]">
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

        {/* Template Dropdown */}
        <div className="content-stretch flex flex-col gap-2 items-start justify-center relative w-full">
          <div className="font-sans font-medium leading-[0] not-italic relative shrink-0 text-[#6f6d66] text-[13px] text-nowrap">
            <p className="leading-[normal] whitespace-pre">Template</p>
          </div>
          <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
            <SelectTrigger className="bg-white border border-[#e1e1e1] rounded-[100px] h-12 px-4 text-[14px] font-semibold">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-[#e1e1e1] rounded-[16px]">
              {availableTemplates.map((template) => (
                <SelectItem
                  key={template.id}
                  value={template.id}
                  className="px-4 py-2 hover:bg-[#f5f5f5] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[8px] overflow-hidden bg-[#f0f0f0] flex-shrink-0">
                      <img
                        src={
                          template.thumbnail ||
                          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop"
                        }
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-[#222526] text-[14px]">
                        {template.name}
                        {Boolean(template.metadata?.premium) && (
                          <span className="ml-2 text-[#615bff] text-[10px] font-bold bg-[#615bff]/10 px-2 py-0.5 rounded-full">
                            PRO
                          </span>
                        )}
                      </span>
                      <span className="text-[#69737c] text-[12px]">
                        {template.description}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Import Button */}
        <div className="content-stretch flex gap-2 items-center justify-center relative shrink-0">
          <Button
            className="bg-[#69737c] hover:bg-[#5a5a5a] text-white rounded-[100px] px-[25px] h-12"
            onClick={() => setBulkOpen(true)}
          >
            Bulk import
          </Button>
        </div>

        <BulkImportDialog open={bulkOpen} onOpenChange={setBulkOpen} />
      </div>
    </div>
  );
}
