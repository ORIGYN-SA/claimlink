import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface CertificateLedgerPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export function CertificateLedgerPagination({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: CertificateLedgerPaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("...");
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="bg-white flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 px-4 sm:px-10 py-3 sm:py-4 rounded-bl-[16px] sm:rounded-bl-[25px] rounded-br-[16px] sm:rounded-br-[25px]">
      {/* Lines per page */}
      <div className="flex gap-2 sm:gap-2.5 items-center">
        <p className="text-[#69737c] text-[11px] sm:text-[13px] font-normal leading-normal">
          Lines per page
        </p>
        <button
          className="bg-white border border-[#e1e1e1] flex gap-1 sm:gap-1.5 items-center px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full hover:bg-[#f9f8f4] transition-colors"
          onClick={() => {
            // Toggle between common page sizes
            const sizes = [5, 10, 20, 50];
            const currentIndex = sizes.indexOf(itemsPerPage);
            const nextIndex = (currentIndex + 1) % sizes.length;
            onItemsPerPageChange(sizes[nextIndex]);
          }}
        >
          <p className="text-[#222526] text-[11px] sm:text-[13px] font-medium leading-normal">
            {itemsPerPage}
          </p>
          <ChevronDown className="size-2.5 sm:size-3 text-[#222526]" />
        </button>
      </div>

      {/* Pagination */}
      <div className="flex gap-1.5 sm:gap-2 items-center">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="size-3 sm:size-3.5 flex items-center justify-center disabled:opacity-30 hover:opacity-70 transition-opacity"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-full text-[#222526]" />
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1.5 sm:gap-3 items-center relative">
          {renderPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="text-[#69737c] text-[11px] sm:text-[13px] font-normal"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`relative min-w-[24px] sm:min-w-[28px] h-6 sm:h-7 flex items-center justify-center rounded-[11px] transition-colors ${
                  isActive
                    ? "bg-[#f1f6f9] text-[#222526] font-medium"
                    : "text-[#69737c] font-normal hover:bg-[#f9f8f4]"
                }`}
              >
                <span className="text-[11px] sm:text-[13px]">{page}</span>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="size-3 sm:size-3.5 flex items-center justify-center disabled:opacity-30 hover:opacity-70 transition-opacity"
          aria-label="Next page"
        >
          <ChevronRight className="size-full text-[#222526]" />
        </button>
      </div>
    </div>
  );
}

