import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, ArrowRight } from "lucide-react";
import { X } from "lucide-react";

interface TransferOwnershipSuccessProps {
  onClose: () => void;
  recipientAddress?: string;
  currentBalance?: string;
}

export function TransferOwnershipSuccess({
  onClose,
  recipientAddress = "07537100b32fb7...6f6241e44b155e4c",
  currentBalance = "6,201.50 OGY",
}: TransferOwnershipSuccessProps) {
  return (
    <div className="flex flex-col">
      {/* Main Content Section */}
      <div className="bg-white border border-[#e1e1e1] rounded-t-[20px] flex flex-col gap-[40px] items-center justify-center px-5 pt-8 pb-8">
        {/* Top Section with Close Button */}
        <div className="flex flex-col items-start w-full">
          {/* Close Button */}
          <div className="flex justify-end w-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-6 h-6 p-0 text-[#69737c] hover:text-[#222526] hover:bg-transparent"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Success Icon and Title */}
          <div className="flex flex-col gap-2 items-center justify-center w-full">
            {/* Success Icon */}
            <div className="relative w-[120px] h-[120px] flex items-center justify-center">
              {/* Background circle */}
              <div className="absolute inset-0 rounded-full bg-[#c7f2e0]" />
              {/* Success checkmark icon */}
              <CheckCircle2 className="w-[68px] h-[68px] text-[#50BE8F] relative z-10" strokeWidth={2} />
            </div>
            
            {/* Success Message */}
            <p className="font-['General_Sans',sans-serif] font-medium text-[24px] leading-[32px] text-[#50BE8F] text-center whitespace-nowrap">
              Transfer was successful!
            </p>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="flex items-center justify-between w-full">
          {/* Index */}
          <div className="flex items-center gap-2">
            <span className="font-['General_Sans',sans-serif] font-medium text-[16px] leading-[24px] text-[#69737c]">
              Index:
            </span>
            <span className="font-['General_Sans',sans-serif] font-semibold text-[18px] leading-[24px] text-[#222526]">
              186876
            </span>
          </div>

          {/* Transfer Status Tag */}
          <div className="bg-white border border-[#e1e1e1] rounded-full flex items-center gap-1 pl-2 pr-1 py-1">
            <ArrowRight className="w-4 h-4 text-[#69737c]" />
            <span className="font-['DM_Sans',sans-serif] font-bold text-[12px] text-[#69737c]">
              Transfer
            </span>
            <div className="bg-[#c7f2e0] rounded-full px-2 py-0.5">
              <span className="font-['General_Sans',sans-serif] font-medium text-[10px] leading-[24px] text-[#061937] uppercase tracking-[0.5px]">
                completed
              </span>
            </div>
          </div>
        </div>

        {/* Recipient Address */}
        <div className="flex flex-col gap-4 items-center justify-center w-full">
          <div className="bg-[#fcfafa] border border-[#e1e1e1] rounded-full h-[47px] w-full flex items-center justify-between pl-1 pr-4 py-2">
            {/* IC Icon with Badge */}
            <div className="relative w-[39px] h-[39px]">
              <div className="absolute inset-0 bg-[#e1e1e1] rounded-full" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2L3 5V11L8 14L13 11V5L8 2Z" fill="#222526"/>
                </svg>
              </div>
            </div>

            {/* Address Text */}
            <p className="font-['DM_Sans',sans-serif] text-[14px] flex-1 text-right mr-2">
              <span className="font-normal text-[#69737c]">Sent to: </span>
              <span className="font-bold text-[#222526] text-[12px]">{recipientAddress}</span>
            </p>

            {/* Copy Button */}
            <Button
              variant="ghost"
              size="icon"
              className="w-4 h-4 p-0 text-[#69737c] hover:text-[#222526] hover:bg-transparent"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* View Certificate Button */}
        <Button
          onClick={onClose}
          className="w-[360px] h-[48px] bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full font-['DM_Sans',sans-serif] font-semibold text-[14px] leading-[48px]"
        >
          View certificate
        </Button>
      </div>

      {/* Current Balance Section */}
      <div className="bg-[#fcfafa] border-l border-r border-b border-[#e1e1e1] rounded-b-[16px] flex items-center justify-center p-4">
        <div className="flex items-center gap-2">
          <span className="font-['General_Sans',sans-serif] font-medium text-[10px] leading-[24px] text-[#69737c] uppercase tracking-wide">
            Current balance:
          </span>
          <div className="w-[8.25px] h-2 flex items-center justify-center">
            <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.25 4C8.25 6.07107 6.57107 7.75 4.5 7.75C2.42893 7.75 0.75 6.07107 0.75 4C0.75 1.92893 2.42893 0.25 4.5 0.25C6.57107 0.25 8.25 1.92893 8.25 4Z" fill="#615BFF"/>
            </svg>
          </div>
          <span className="font-['General_Sans',sans-serif] font-semibold text-[12px] leading-normal text-[#69737c] whitespace-nowrap">
            {currentBalance}
          </span>
        </div>
      </div>
    </div>
  );
}

