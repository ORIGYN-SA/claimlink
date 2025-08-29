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
    <div className="space-y-2">
      <label className="text-[13px] font-medium text-[#69737c] leading-[100]">
        {label}
      </label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-[44px] px-[16px] rounded-[100px] border-[#e1e1e1] bg-white placeholder:text-[#69737c] text-[14px]"
      />
    </div>
  );
}
