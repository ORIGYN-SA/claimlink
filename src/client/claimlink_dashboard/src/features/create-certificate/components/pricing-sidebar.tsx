import { Button } from "@/components/ui/button";

export function PricingSidebar() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-6 items-start justify-center p-[24px] rounded-[25px] shrink-0 sticky top-0 w-[400px] border border-[#e1e1e1]">
      {/* Introduction */}
      <div className="content-stretch flex flex-col gap-2 items-start justify-start leading-[0] not-italic relative shrink-0">
        <div className="font-['General_Sans:Medium',_sans-serif] relative shrink-0 text-[18px] text-black text-nowrap">
          <p className="leading-[normal] whitespace-pre">General information</p>
        </div>
        <div className="font-['General_Sans:Regular',_sans-serif] relative shrink-0 text-[#69737c] text-[13px] w-[360px]">
          <p className="leading-[normal]">Vestibulum eu purus eu orci commodo elementum et et lorem. Curabitur pharetra velit ut facilisis ultrices.</p>
        </div>
      </div>

      {/* Separator */}
      <div className="h-0 relative shrink-0 w-[361px] border-t border-[#e1e1e1]"></div>

      {/* Price Section */}
      <div className="content-stretch flex flex-col gap-4 items-start justify-start relative w-full">
        <div className="content-stretch flex gap-2 items-center justify-start relative shrink-0">
          <div className="relative shrink-0 w-4 h-4">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2L14 6V14H2V6L8 2Z" stroke="#222526" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M6 8H10M6 10H10M6 12H10" stroke="#222526" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="font-['General_Sans:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#222526] text-[14px] text-nowrap tracking-[0.7px] uppercase">
            <p className="leading-[23px] whitespace-pre">Price</p>
          </div>
        </div>

        {/* Certificate Cost Box */}
        <div className="bg-[rgba(205,223,236,0.15)] box-border content-stretch flex flex-col gap-1 items-start justify-start p-[16px] relative rounded-[16px] w-full border border-[#e1e1e1]">
          <div className="font-['General_Sans:Medium',_sans-serif] h-5 leading-[0] not-italic relative shrink-0 text-[#69737c] text-[14px] w-[167px]">
            <p className="leading-[16px]">Certificate cost:</p>
          </div>
          <div className="content-stretch flex gap-2 items-start justify-start relative shrink-0">
            <div className="h-4 relative shrink-0 w-[19.9px]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="9" fill="#615BFF" stroke="#615BFF"/>
                <text x="10" y="13" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">O</text>
              </svg>
            </div>
            <div className="flex flex-col font-['DM_Sans:SemiBold',_sans-serif] font-semibold justify-end leading-[0] relative shrink-0 text-[#222526] text-[0px] w-[294px]">
              <p className="not-italic">
                <span className="font-['General_Sans:Semibold',_sans-serif] leading-[24px] text-[18px]">8800 OGY </span>
                <span className="font-['General_Sans:Regular',_sans-serif] leading-[18px] text-[#69737c] text-[14px]">(2500$)</span>
              </p>
            </div>
          </div>
        </div>

        <div className="font-['General_Sans:Regular',_sans-serif] leading-[0] min-w-full not-italic relative shrink-0 text-[#69737c] text-[13px]">
          <p className="leading-[normal]">When you mint a certificate, you will need to pay 17 OGY + 17 OGY as fees.</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="content-stretch flex gap-2 items-end justify-end relative w-full">
        <Button className="bg-[#e1e1e1] hover:bg-[#d1d1d1] text-[#222526] rounded-[100px] px-[25px] h-12">
          Save draft
        </Button>
        <Button className="bg-[#222526] hover:bg-[#1a1a1a] text-white rounded-[100px] px-[25px] h-12">
          Mint for 8800 OGY
        </Button>
      </div>
    </div>
  );
}