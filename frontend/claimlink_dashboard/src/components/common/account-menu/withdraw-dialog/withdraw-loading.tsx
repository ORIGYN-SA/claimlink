import icon from "@/assets/icon.svg"

export function WithdrawLoading() {
  return (
    <div className="bg-white border border-[#e1e1e1] rounded-[20px] h-[383px] flex flex-col items-center justify-center px-0 py-8 gap-6">
      {/* Loader */}
      <div className="relative w-[120px] h-[120px] flex items-center justify-center">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-[#e1e1e1]" />
        {/* Animated ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#50BE8F] animate-spin" />
        {/* Inner circle */}
        <div className="w-[116px] h-[116px] bg-[#fcfafa] rounded-full flex items-center justify-center">
          {/* OGY Logo */}
          <div className="w-[43px] h-[42px] flex items-center justify-center">
            <img src={icon} alt="OGY Logo" className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-[#222526] text-2xl font-light tracking-[1.2px] uppercase">
          Processing
        </h2>
        <p className="text-[#69737c] text-[13px] font-normal w-[353px]">
          This can take a few seconds
        </p>
      </div>
    </div>
  )
}
