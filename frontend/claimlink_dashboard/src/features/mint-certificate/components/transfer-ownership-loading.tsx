import icon from "@/assets/icon.svg";

export function TransferOwnershipLoading() {
  return (
    <div className="bg-white border border-[#e1e1e1] rounded-[20px] h-[383px] flex flex-col items-center justify-center px-0 py-8 gap-6">
      {/* Loader */}
      <div className="relative w-[120px] h-[120px] flex items-center justify-center">
        {/* Outer ring with gradient animation effect */}
        <div className="absolute inset-0 rounded-full border-4 border-[#e1e1e1]" />
        {/* Animated gradient ring - using a conic gradient effect */}
        <div 
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            background: 'conic-gradient(from 180deg at 50% 50%, #85F1FF 0deg, #615BFF 90deg, #FF55C5 180deg, transparent 270deg, transparent 360deg)',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), white calc(100% - 3px))',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), white calc(100% - 3px))',
          }}
        />
        {/* Inner circle background */}
        <div className="w-[116px] h-[116px] bg-[#fcfafa] rounded-full flex items-center justify-center">
          {/* OGY Logo */}
          <div className="w-[43px] h-[42px] flex items-center justify-center">
            <img src={icon} alt="OGY Logo" className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-[#222526] text-2xl font-light tracking-[1.2px] uppercase leading-none">
          MINTING &<br />TRANSFERING CERTIFICATE
        </h2>
        <p className="text-[#69737c] text-[13px] font-normal w-[353px]">
          This can take a few seconds
        </p>
      </div>
    </div>
  );
}

