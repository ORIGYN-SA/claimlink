import { type Template } from '@/shared/data';

interface EditTemplateStepProps {
  selectedTemplate: Template | null;
  onNext?: () => void;
  onBack?: () => void;
}

export function EditTemplateStep({ selectedTemplate, onNext, onBack }: EditTemplateStepProps) {
  return (
    <div className="bg-white border border-[#e1e1e1] border-solid box-border content-stretch flex flex-col gap-[24px] items-center justify-center pb-[40px] pt-[32px] px-[24px] relative rounded-[16px] shrink-0 w-[714px]">
      {/* Title Section */}
      <div className="content-stretch flex flex-col gap-[4px] items-center justify-center relative shrink-0 w-full">
        <p className="font-['General_Sans:Regular',_sans-serif] leading-[32px] not-italic relative shrink-0 text-[#222526] text-[24px] text-center text-nowrap tracking-[1.2px] whitespace-pre">
          Edit your template
        </p>
        <div className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0 w-full">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
            <div className="box-border content-stretch flex flex-col gap-[8px] items-start justify-center ml-0 mt-0 relative w-[353px]">
              <p className="font-['General_Sans:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#69737c] text-[13px] text-center w-full">
                Customize your selected template: {selectedTemplate?.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder content for editing */}
      <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0 w-full">
        <p className="text-[#69737c] text-center">
          Template editing interface will be implemented here
        </p>
        <p className="text-[#69737c] text-sm text-center">
          This will include form fields to customize the template content, styling, and metadata
        </p>
      </div>

      {/* Navigation buttons */}
      <div className="content-stretch flex gap-[16px] items-center justify-center relative shrink-0">
        <button
          className="bg-white border border-[#e1e1e1] border-solid box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center px-[25px] py-0 relative rounded-[100px] shrink-0 text-[#222526] hover:bg-gray-50 transition-colors"
          onClick={onBack}
        >
          <p className="font-['DM_Sans:SemiBold',_sans-serif] font-semibold leading-[48px] relative shrink-0 text-[14px] text-center text-nowrap text-black whitespace-pre">
            Back
          </p>
        </button>
        <button
          className="bg-[#222526] box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center px-[25px] py-0 relative rounded-[100px] shrink-0 w-[120px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#333333] transition-colors"
          onClick={onNext}
        >
          <p className="font-['DM_Sans:SemiBold',_sans-serif] font-semibold leading-[48px] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">
            Next
          </p>
        </button>
      </div>
    </div>
  );
}
