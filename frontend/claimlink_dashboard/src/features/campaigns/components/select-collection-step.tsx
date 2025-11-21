import { useState } from 'react';
import { mockCollections, getActiveCollections } from '@/shared/data/collections';
import type { Collection } from '@/features/collections/types/collection.types';

interface SelectCollectionStepProps {
  onNext?: (selectedCollection: Collection) => void;
}

export function SelectCollectionStep({ onNext }: SelectCollectionStepProps) {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  // Only show active collections for campaign creation
  const availableCollections = getActiveCollections();

  const handleCollectionSelect = (collection: Collection) => {
    setSelectedCollection(collection);
  };

  const handleNext = () => {
    if (selectedCollection) {
      onNext?.(selectedCollection);
    }
  };

  return (
    <div className="bg-white border border-[#e1e1e1] border-solid box-border content-stretch flex flex-col gap-[24px] items-center justify-center pb-[40px] pt-[32px] px-[24px] relative rounded-[16px] shrink-0 w-[714px]">
      {/* Title Section */}
      <div className="content-stretch flex flex-col gap-[4px] items-center justify-center relative shrink-0 w-full">
        <p className="font-['General_Sans:Regular',_sans-serif] leading-[32px] not-italic relative shrink-0 text-[#222526] text-[24px] text-center text-nowrap tracking-[1.2px] whitespace-pre">
          Select collection
        </p>
        <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0 w-full">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
            <div className="box-border content-stretch flex flex-col gap-[8px] items-start justify-center ml-0 mt-0 relative w-[353px]">
              <p className="font-['General_Sans:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#69737c] text-[13px] text-center w-full">
                Choose a collection to create your campaign. Only active collections are available for campaign creation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Listing */}
      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
        {/* Grid with 2 columns */}
        <div className="grid grid-cols-2 gap-2 w-full">
          {availableCollections.map((collection) => (
            <div
              key={collection.id}
              className={`rounded-[16px] transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                selectedCollection?.id === collection.id
                  ? 'ring-2 ring-[#615bff] shadow-lg'
                  : 'ring-0 hover:shadow-md'
              }`}
              onClick={() => handleCollectionSelect(collection)}
            >
              <div className="relative pointer-events-none">
                <div className="bg-white border border-[#e1e1e1] rounded-[16px] p-4 flex flex-col gap-3">
                  <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={collection.imageUrl}
                      alt={collection.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-[#222526] text-sm leading-tight">
                      {collection.title}
                    </h3>
                    <p className="text-xs text-[#69737c] leading-tight line-clamp-2">
                      {collection.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[#69737c]">
                      <span>{collection.itemCount} items</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        collection.status === 'Active' ? 'bg-[#c7f2e0] text-[#50be8f]' : 'bg-[#f0f0f0] text-[#69737c]'
                      }`}>
                        {collection.status}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Checkmark overlay for selected state */}
                {selectedCollection?.id === collection.id && (
                  <div className="absolute top-2 right-2 bg-[#615bff] rounded-full p-1 shadow-md animate-in fade-in zoom-in duration-200">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.3334 4L6.00002 11.3333L2.66669 8"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Button */}
      <button
        className="bg-[#222526] box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center px-[25px] py-0 relative rounded-[100px] shrink-0 w-[360px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#333333] transition-colors"
        onClick={handleNext}
        disabled={!selectedCollection}
      >
        <p className="font-['DM_Sans:SemiBold',_sans-serif] font-semibold leading-[48px] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">
          Next
        </p>
      </button>
    </div>
  );
}
