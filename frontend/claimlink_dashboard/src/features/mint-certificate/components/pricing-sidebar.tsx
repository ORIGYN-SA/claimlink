import { Button } from "@/components/ui/button";

export function PricingSidebar() {
  return (
    <div className="bg-white box-border flex flex-col gap-6 items-start justify-center p-6 rounded-[25px] w-full border border-[#e1e1e1]">
      {/* Introduction */}
      <div className="flex flex-col gap-2 items-start justify-start w-full">
        <div className="font-['General_Sans'] font-medium text-[18px] text-black">
          General information
        </div>
        <div className="font-['General_Sans'] text-[#69737c] text-[13px] w-full">
          <p className="leading-normal">
            Vestibulum eu purus eu orci commodo elementum et et lorem.
            Curabitur pharetra velit ut facilisis ultrices.
          </p>
        </div>
      </div>

      {/* Separator */}
      <div className="h-0 w-full border-t border-[#e1e1e1]"></div>

      {/* Price Section */}
      <div className="flex flex-col gap-4 items-start justify-start w-full">
        {/* Price header */}
        <div className="flex gap-2 items-center justify-start">
          {/* Icon SVG */}
          <div className="font-['General_Sans'] font-medium text-[#222526] text-[14px] uppercase tracking-[0.7px]">
            Price
          </div>
        </div>

        {/* Certificate Cost Box */}
        <div className="bg-[rgba(205,223,236,0.15)] box-border flex flex-col gap-1 items-start justify-start p-4 rounded-[16px] w-full border border-[#e1e1e1]">
          <div className="font-['General_Sans'] font-medium text-[#69737c] text-[14px]">
            Certificate cost:
          </div>
          <div className="flex gap-2 items-start justify-start">
            {/* OGY Icon */}
            <div className="flex items-center gap-2">
              <span className="font-['General_Sans'] font-semibold text-[18px] text-[#222526]">
                8800 OGY
              </span>
              <span className="font-['General_Sans'] text-[14px] text-[#69737c]">
                (2500$)
              </span>
            </div>
          </div>
        </div>

        <div className="font-['General_Sans'] text-[#69737c] text-[13px]">
          <p>When you mint a certificate, you will need to pay 17 OGY + 17 OGY as fees.</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 items-end justify-end w-full">
        <Button className="bg-[#e1e1e1] hover:bg-[#d1d1d1] text-[#222526] rounded-[100px] px-6 h-12">
          Save draft
        </Button>
        <Button className="bg-[#222526] hover:bg-[#1a1a1a] text-white rounded-[100px] px-6 h-12">
          Mint for 8800 OGY
        </Button>
      </div>
    </div>
  );
}
