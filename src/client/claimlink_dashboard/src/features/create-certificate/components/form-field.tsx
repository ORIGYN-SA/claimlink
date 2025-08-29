import { Input } from "@/components/ui/input";

interface FormFieldProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
}

export function FormField({
  label,
  placeholder,
  value,
  onChange,
  type = "text"
}: FormFieldProps) {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-2 grow items-center justify-center min-h-px min-w-px relative shrink-0">
      <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative w-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-center ml-[2.221px] mt-0 relative w-[313.559px]">
          <div className="font-['DM_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#69737c] text-[13px] text-nowrap">
            <p className="leading-[normal] whitespace-pre">{label}</p>
          </div>
        </div>
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="bg-white box-border content-stretch flex gap-[30px] items-center justify-start ml-0 mt-[26px] px-6 py-2.5 relative rounded-[100px] w-[318px] border border-[#e1e1e1] h-auto"
        />
      </div>
    </div>
  );
}
