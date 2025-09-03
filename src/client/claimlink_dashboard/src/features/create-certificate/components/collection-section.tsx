import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CollectionSection() {
  return (
    <div className="bg-white box-border flex flex-col gap-4 items-center justify-center px-5 py-6 rounded-[25px] w-full border border-[#efece3]">
      <div className="flex flex-col gap-4 items-start justify-center w-full">
        <div className="flex flex-col gap-2 items-start justify-center">
          <div className="font-['DM_Sans'] font-semibold text-[#222526] text-[16px]">
            Collection
          </div>
        </div>

        {/* Collection Dropdown */}
        <div className="content-stretch flex flex-col gap-2 items-start justify-center relative w-full">
          <div className="font-['General_Sans:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#6f6d66] text-[13px] text-nowrap">
            <p className="leading-[normal] whitespace-pre">Collection</p>
          </div>
          <button className="box-border content-stretch cursor-pointer flex flex-col items-start justify-start overflow-visible p-0 relative rounded-[100px] w-full">
            <div className="bg-white box-border content-stretch flex items-center justify-between p-[16px] relative rounded-[100px] w-full border border-[#e1e1e1]">
              <div className="font-['DM_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#222526] text-[14px] text-nowrap">
                <p className="leading-[normal] whitespace-pre">Collection 1</p>
              </div>
              <ChevronDown className="w-4 h-4 text-[#69737c]" />
            </div>
          </button>
        </div>

        {/* Template Dropdown */}
        <div className="content-stretch flex flex-col gap-2 items-start justify-center relative w-full">
          <div className="font-['General_Sans:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#6f6d66] text-[13px] text-nowrap">
            <p className="leading-[normal] whitespace-pre">Template</p>
          </div>
          <button className="box-border content-stretch cursor-pointer flex flex-col items-start justify-start overflow-visible p-0 relative rounded-[100px] w-full">
            <div className="bg-white box-border content-stretch flex items-center justify-between p-[16px] relative rounded-[100px] w-full border border-[#e1e1e1]">
              <div className="font-['DM_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#222526] text-[14px] text-nowrap">
                <p className="leading-[normal] whitespace-pre">Template 52</p>
              </div>
              <ChevronDown className="w-4 h-4 text-[#69737c]" />
            </div>
          </button>
        </div>

        {/* Bulk Import Button */}
        <div className="content-stretch flex gap-2 items-center justify-center relative shrink-0">
          <Button className="bg-[#69737c] hover:bg-[#5a5a5a] text-white rounded-[100px] px-[25px] h-12">
            Bulk import
          </Button>
        </div>
      </div>
    </div>
  );
}
