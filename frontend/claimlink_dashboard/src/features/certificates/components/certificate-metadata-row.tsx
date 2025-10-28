interface CertificateMetadataRowProps {
  label: string;
  value: string;
  hasBorder?: boolean;
}

export function CertificateMetadataRow({
  label,
  value,
  hasBorder = false,
}: CertificateMetadataRowProps) {
  return (
    <div
      className={`flex items-start justify-between py-4 ${
        hasBorder ? "border-t border-[rgba(239,236,227,0.25)]" : ""
      }`}
    >
      <p className="text-[#e1e1e1] text-[12px] font-normal leading-6 tracking-[1.2px] uppercase w-[159px] shrink-0">
        {label}
      </p>
      <p className="flex-1 text-white text-[16px] font-light leading-8 text-right">
        {value}
      </p>
    </div>
  );
}

