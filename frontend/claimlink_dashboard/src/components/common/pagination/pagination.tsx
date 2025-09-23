import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
  itemsPerPageOptions?: number[];
  showItemsPerPage?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 20, 50],
  showItemsPerPage = true,
  className,
}: PaginationProps) {
  const handlePreviousPage = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  };

  const renderPageNumbers = () => {
    const maxVisiblePages = 5;
    const pageNumbers = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first few pages with ellipsis logic
      for (let i = 1; i <= Math.min(maxVisiblePages, totalPages); i++) {
        pageNumbers.push(i);
      }
    }

    return (
      <>
        {pageNumbers.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "ghost"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={cn(
              "h-7 w-7 rounded-[11px] text-[13px] cursor-pointer transition-colors",
              currentPage === page
                ? "bg-[rgba(205,233,236,0.4)] text-[#222526] hover:bg-[rgba(205,233,236,0.6)]"
                : "text-[#69737c] hover:bg-[#f0f0f0] hover:text-[#222526]"
            )}
          >
            {page}
          </Button>
        ))}
        {totalPages > 5 && (
          <>
            <span className="text-[#69737c] text-[13px]">...</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="h-7 w-7 rounded-[11px] text-[13px] text-[#69737c] cursor-pointer hover:bg-[#f0f0f0] hover:text-[#222526] transition-colors"
            >
              {totalPages}
            </Button>
          </>
        )}
      </>
    );
  };

  return (
    <div className={cn(
      "bg-white border-t border-[#f2f2f2] px-10 py-4 rounded-b-[25px] flex items-center justify-between",
      className
    )}>
      {/* Lines per page */}
      {showItemsPerPage && (
        <div className="flex gap-2.5 items-center">
          <span className="text-[13px] text-[#86858a] leading-normal">Lines per page</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
          >
            <SelectTrigger className="cursor-pointer w-auto min-w-[60px] h-8 rounded-full border-[#e1e1e1] bg-white hover:bg-[#f9f9f9] transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={cn(
            "p-2 h-8 w-8 rounded-full transition-colors",
            currentPage === 1 
              ? "cursor-not-allowed opacity-50" 
              : "cursor-pointer hover:bg-[#f0f0f0]"
          )}
        >
          ←
        </Button>

        <div className="flex items-center gap-2">
          {renderPageNumbers()}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={cn(
            "p-2 h-8 w-8 rounded-full transition-colors",
            currentPage === totalPages 
              ? "cursor-not-allowed opacity-50" 
              : "cursor-pointer hover:bg-[#f0f0f0]"
          )}
        >
          →
        </Button>
      </div>
    </div>
  );
}
