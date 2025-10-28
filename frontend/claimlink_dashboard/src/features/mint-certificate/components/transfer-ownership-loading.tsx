
export function TransferOwnershipLoading() {
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

        {/* Loading Spinner */}
        <div className="flex items-center justify-center w-full py-[40px]">
          <div className="relative w-16 h-16">
            {/* Spinner Circle */}
            <div className="absolute inset-0 border-4 border-[#e1e1e1] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#615bff] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <p className="font-['General_Sans',sans-serif] font-medium text-[16px] leading-[24px] text-[#222526] text-center">
            Processing transfer...
          </p>
          <p className="font-['General_Sans',sans-serif] font-normal text-[14px] leading-[20px] text-[#69737c] text-center">
            Please wait while we process your transfer
          </p>
        </div>
      </div>

      {/* Bottom Section - Current Balance */}
      <div className="bg-[#fcfafa] border-l border-r border-b border-[#e1e1e1] rounded-bl-[16px] rounded-br-[16px] flex gap-2 items-center justify-center p-4">
        <div className="flex gap-2 items-center justify-center opacity-50">
          <div className="flex gap-[5px] items-center justify-end">
            <p className="font-['General_Sans',sans-serif] font-medium text-[10px] leading-[24px] text-[#69737c] uppercase tracking-wide">
              Current balance:
            </p>
            <div className="w-[8.25px] h-2 flex items-center justify-center">
              <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.25 4C8.25 6.07107 6.57107 7.75 4.5 7.75C2.42893 7.75 0.75 6.07107 0.75 4C0.75 1.92893 2.42893 0.25 4.5 0.25C6.57107 0.25 8.25 1.92893 8.25 4Z" fill="#615BFF"/>
              </svg>
            </div>
            <p className="font-['General_Sans',sans-serif] font-semibold text-[12px] leading-normal text-[#69737c] whitespace-nowrap">
              Processing...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

