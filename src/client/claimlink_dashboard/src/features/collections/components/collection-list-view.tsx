import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CollectionStatusBadge } from "./collection-status-badge";
import type { Collection } from "../types/collection.types";

interface CollectionListViewProps {
  collections: Collection[];
  onCollectionClick: (collection: Collection) => void;
  onAddCollection: () => void;
}

export function CollectionListView({
  collections,
  onCollectionClick,
  onAddCollection
}: CollectionListViewProps) {
  return (
    <Card className="bg-white border border-[#e1e1e1] rounded-[25px] overflow-hidden shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)]">
      {/* Table Header */}
      <div className="bg-[#222526] border-b border-[#e1e1e1] px-6 py-4">
        <div className="grid grid-cols-[50px_120px_1fr_1fr_100px_120px_40px] gap-4 items-center">
          <div className="text-[13px] font-medium text-white">Ref</div>
          <div className="text-[13px] font-medium text-white">Created</div>
          <div className="text-[13px] font-medium text-white">Name</div>
          <div className="text-[13px] font-medium text-white">Description</div>
          <div className="text-[13px] font-medium text-white">Items</div>
          <div className="text-[13px] font-medium text-white">Status</div>
          <div className="flex justify-center">
            {/* More actions header - empty for now */}
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-[#e1e1e1]">
        {collections.map((collection, index) => (
          <div
            key={collection.id}
            className="px-6 py-4 hover:bg-[#f9f9f9] cursor-pointer transition-colors"
            onClick={() => onCollectionClick(collection)}
          >
            <div className="grid grid-cols-[50px_120px_1fr_1fr_100px_120px_40px] gap-4 items-center">
              {/* Reference Number */}
              <div className="text-[14px] font-normal text-[#69737c]">
                #{String(index + 1).padStart(3, '0')}
              </div>

              {/* Created Date */}
              <div className="text-[14px] font-normal text-[#69737c]">
                {collection.createdDate}
              </div>

              {/* Name with Image */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-[16px] overflow-hidden bg-[#f0f0f0] flex-shrink-0">
                  <img
                    src={collection.imageUrl}
                    alt={collection.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] font-medium text-[#222526] truncate">
                    {collection.title}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="text-[14px] font-normal text-[#69737c] truncate">
                {collection.description}
              </div>

              {/* Items Count */}
              <div className="text-[14px] font-medium text-[#69737c]">
                {collection.itemCount}
              </div>

              {/* Status */}
              <div className="flex items-center">
                <CollectionStatusBadge status={collection.status} />
              </div>

              {/* More Actions */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-full hover:bg-[#f0f0f0]"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle more actions
                    console.log('More actions for collection:', collection.id);
                  }}
                >
                  <MoreHorizontal className="w-4 h-4 text-[#69737c]" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {collections.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="text-[#69737c] text-[14px]">
            No collections found.{' '}
            <button
              onClick={onAddCollection}
              className="text-[#061937] font-medium hover:underline"
            >
              Create your first collection
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
