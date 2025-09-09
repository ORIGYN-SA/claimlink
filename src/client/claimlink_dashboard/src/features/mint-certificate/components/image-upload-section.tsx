import { ImageIcon } from "lucide-react";

export function ImageUploadSection() {
  return (
    <div className="content-stretch flex gap-4 items-start justify-start relative w-full">
      <div className="bg-[#e1e1e1] relative rounded-[10px] w-[130px] h-[130px] flex items-center justify-center">
        <ImageIcon className="w-10 h-10 text-[#222526]" />
      </div>
      <div className="basis-0 content-stretch flex flex-col gap-2 grow items-start justify-start min-h-px min-w-px overflow-clip relative self-stretch shrink-0">
        <div className="bg-[rgba(205,223,236,0.15)] box-border content-stretch flex flex-col gap-2 grow items-center justify-center min-h-px min-w-px px-3 py-6 relative rounded-[4px] w-full border border-[#e1e1e1] border-dashed">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
            <div className="[grid-area:1_/_1] h-10 ml-0 mt-0 relative w-[38.776px]">
              <div className="absolute inset-0 rounded-full border-2 border-[#cde9ec] flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#cde9ec]"></div>
              </div>
            </div>
          </div>
          <div className="font-['General_Sans:Medium',_sans-serif] leading-[0] min-w-full not-italic relative shrink-0 text-[#69737c] text-[0px] text-center w-full">
            <p className="leading-[24px] text-[16px]">
              <span className="font-['General_Sans:Medium',_sans-serif] not-italic text-[#615bff]">Upload</span>
              <span className="font-['General_Sans:Medium',_sans-serif] not-italic"> your products image or drag it here</span>
            </p>
          </div>
          <div className="font-['General_Sans:Semibold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#69737c] text-[12px] text-nowrap">
            <p className="leading-[normal] whitespace-pre">JPEG, PNG, SVG, PDF</p>
          </div>
        </div>
      </div>
    </div>
  );
}
