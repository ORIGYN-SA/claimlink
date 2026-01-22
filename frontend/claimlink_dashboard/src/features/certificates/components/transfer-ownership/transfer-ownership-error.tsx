import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface TransferOwnershipErrorProps {
  errorMessage: string;
  onRetry: () => void;
  onClose: () => void;
}

export function TransferOwnershipError({
  errorMessage,
  onRetry,
  onClose,
}: TransferOwnershipErrorProps) {
  return (
    <div className="flex flex-col">
      {/* Top Section */}
      <div className="bg-white border border-[#e1e1e1] rounded-tl-[20px] rounded-tr-[20px] flex flex-col gap-[40px] items-center justify-center pt-[32px] pb-[40px] px-[20px]">
        {/* Title */}
        <div className="flex flex-col gap-1 items-center justify-center w-full">
          <h2 className="font-['General_Sans',sans-serif] font-medium text-[24px] leading-[32px] text-[#222526] text-center whitespace-nowrap">
            Transfer Ownership
          </h2>
        </div>

        {/* Error Icon */}
        <div className="flex items-center justify-center w-full py-[20px]">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <AlertCircle className="w-20 h-20 text-[#ff55c5]" strokeWidth={1.5} />
          </div>
        </div>

        {/* Error Message */}
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <p className="font-['General_Sans',sans-serif] font-semibold text-[18px] leading-[26px] text-[#222526] text-center">
            Transfer Failed
          </p>
          <p className="font-['General_Sans',sans-serif] font-normal text-[14px] leading-[20px] text-[#69737c] text-center max-w-[280px]">
            {errorMessage || "An error occurred while processing your transfer. Please try again."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <Button
            type="button"
            onClick={onRetry}
            className="w-full h-[48px] bg-[#222526] text-white rounded-full px-[25px] font-['DM_Sans',sans-serif] font-semibold text-[14px] leading-[48px] hover:bg-[#222526]/90 transition-colors"
          >
            Try Again
          </Button>
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="w-full h-[48px] bg-white text-[#222526] border-[#e1e1e1] rounded-full px-[25px] font-['DM_Sans',sans-serif] font-semibold text-[14px] leading-[48px] hover:bg-[#fcfafa] transition-colors"
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Bottom Section - Error Status */}
      <div className="bg-[#ffd4f0] border-l border-r border-b border-[#ff55c5] rounded-bl-[16px] rounded-br-[16px] flex gap-2 items-center justify-center p-4">
        <div className="flex gap-2 items-center justify-center">
          <div className="flex gap-[5px] items-center justify-center">
            <AlertCircle className="w-4 h-4 text-[#ff55c5]" strokeWidth={2} />
            <p className="font-['General_Sans',sans-serif] font-semibold text-[12px] leading-normal text-[#222526] whitespace-nowrap">
              Transaction failed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

