import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface TransferOwnershipSuccessProps {
  onClose: () => void;
}

export function TransferOwnershipSuccess({
  onClose,
}: TransferOwnershipSuccessProps) {
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

        {/* Success Icon */}
        <div className="flex items-center justify-center w-full py-[20px]">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <CheckCircle2 className="w-20 h-20 text-[#50be8f]" strokeWidth={1.5} />
          </div>
        </div>

        {/* Success Message */}
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <p className="font-['General_Sans',sans-serif] font-semibold text-[18px] leading-[26px] text-[#222526] text-center">
            Transfer Successful!
          </p>
          <p className="font-['General_Sans',sans-serif] font-normal text-[14px] leading-[20px] text-[#69737c] text-center max-w-[280px]">
            Ownership has been successfully transferred to the new owner
          </p>
        </div>

        {/* Close Button */}
        <Button
          type="button"
          onClick={onClose}
          className="w-full h-[48px] bg-[#222526] text-white rounded-full px-[25px] font-['DM_Sans',sans-serif] font-semibold text-[14px] leading-[48px] hover:bg-[#222526]/90 transition-colors"
        >
          Close
        </Button>
      </div>

      {/* Bottom Section - Success Status */}
      <div className="bg-[#c7f2e0] border-l border-r border-b border-[#50be8f] rounded-bl-[16px] rounded-br-[16px] flex gap-2 items-center justify-center p-4">
        <div className="flex gap-2 items-center justify-center">
          <div className="flex gap-[5px] items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-[#50be8f]" strokeWidth={2} />
            <p className="font-['General_Sans',sans-serif] font-semibold text-[12px] leading-normal text-[#222526] whitespace-nowrap">
              Transaction completed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

