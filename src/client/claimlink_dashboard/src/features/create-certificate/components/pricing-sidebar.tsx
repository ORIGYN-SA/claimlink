import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PricingSidebar() {
  return (
    <Card className="bg-white border-[#e1e1e1] rounded-[25px] p-6 space-y-6 sticky top-0">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-[18px] font-medium text-[#222526] leading-[100]">
          General information
        </h2>
        <p className="text-[13px] font-normal text-[#69737c] leading-[100]">
          Vestibulum eu purus eu orci commodo elementum et et lorem. Curabitur pharetra velit ut facilisis ultrices.
        </p>
      </div>

      {/* Separator */}
      <div className="border-t border-[#e1e1e1]" />

      {/* Price Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Receipt className="w-4 h-4 text-[#69737c]" />
          <span className="text-[14px] font-medium text-[#222526] uppercase tracking-[0.7px] leading-[23px]">
            Price
          </span>
        </div>

        {/* Certificate Cost Card */}
        <Card className="bg-[rgba(205,223,236,0.15)] border-[#e1e1e1] rounded-[16px] p-4">
          <div className="space-y-3">
            <p className="text-[14px] font-normal text-[#69737c] leading-[16px]">
              Certificate cost:
            </p>

            <div className="flex items-center gap-2">
              {/* OGY Icon placeholder */}
              <div className="w-[19.9px] h-4 bg-[#615bff] rounded-sm flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-[18px] font-semibold text-[#222526] leading-[24px]">
                  8800 OGY
                </span>
                <span className="text-[14px] font-normal text-[#69737c] leading-[18px]">
                  (2500$)
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Description */}
        <p className="text-[13px] font-normal text-[#69737c] leading-[100]">
          When you mint a certificate, you will need to pay 17 OGY + 17 OGY as fees.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-[16px] pt-[16px]">
        <Button
          variant="outline"
          className="px-[25px] h-[48px] bg-[#e1e1e1] border-[#e1e1e1] text-[#222526] rounded-[100px] hover:bg-[#d1d1d1]"
        >
          Save draft
        </Button>
        <Button
          className="px-[25px] h-[48px] bg-[#222526] text-white rounded-[100px] hover:bg-[#1a1a1a]"
        >
          Mint for 8800 OGY
        </Button>
      </div>
    </Card>
  );
}
