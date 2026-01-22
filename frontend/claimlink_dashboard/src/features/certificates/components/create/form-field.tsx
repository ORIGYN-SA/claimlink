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
    <div className="flex flex-col gap-2 flex-1 min-w-0">
      <label className="text-[13px] font-medium text-[#69737c]">
        {label}
      </label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="bg-white px-6 py-2.5 rounded-[100px] border border-[#e1e1e1] h-auto text-base placeholder:text-[#69737c]"
      />
    </div>
  );
}
