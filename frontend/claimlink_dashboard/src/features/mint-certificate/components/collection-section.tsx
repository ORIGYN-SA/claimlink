import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getActiveCollections } from "@/shared/data/collections";
import { mockTemplates } from "@/shared/data/templates";

export function CollectionSection() {
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  // Only show active collections in the dropdown
  const activeCollections = getActiveCollections();

  const handleCollectionChange = (value: string) => {
    setSelectedCollection(value);
  };

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
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
          <Select value={selectedCollection} onValueChange={handleCollectionChange}>
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
              {mockTemplates.map((template) => (
                <SelectItem
                  key={template.id}
                  value={template.id}
                  className="px-4 py-2 hover:bg-[#f5f5f5] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[8px] overflow-hidden bg-[#f0f0f0] flex-shrink-0">
                      <img
                        src={template.thumbnail || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop"}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-[#222526] text-[14px]">
                        {template.name}
                        {template.metadata?.premium && (
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
          <Button className="bg-[#69737c] hover:bg-[#5a5a5a] text-white rounded-[100px] px-[25px] h-12">
            Bulk import
          </Button>
        </div>
      </div>
    </div>
  );
}
