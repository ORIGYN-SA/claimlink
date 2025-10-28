// Icon asset from Figma
const iconDownload = "http://localhost:3845/assets/bec182420f6dddf77097d0826a793c18e65bc2cc.svg";

interface CertificateEventRowProps {
  date: string;
  description: string;
  attachmentUrl?: string;
  isFirst?: boolean;
  isLast?: boolean;
}

export function CertificateEventRow({
  date,
  description,
  attachmentUrl,
  isFirst = false,
  isLast = false,
}: CertificateEventRowProps) {
  const handleDownload = () => {
    if (attachmentUrl) {
      window.open(attachmentUrl, "_blank");
    }
  };

  // Determine border classes based on position
  const getBorderClass = () => {
    if (isFirst && isLast) {
      return "border-t border-b border-[rgba(239,236,227,0.25)]";
    }
    if (isFirst) {
      return "border-t border-[rgba(239,236,227,0.25)]";
    }
    if (isLast) {
      return "border-t border-b border-[rgba(239,236,227,0.25)]";
    }
    return "border-t border-[rgba(239,236,227,0.25)]";
  };

  return (
    <div
      className={`flex items-start justify-between py-4 ${getBorderClass()}`}
    >
      {/* Date */}
      <p className="text-[#e1e1e1] text-[12px] font-normal leading-6 tracking-[1.2px] uppercase w-[159px] shrink-0">
        {date}
      </p>

      {/* Description and Download Button */}
      <div className="flex-1 flex gap-2 items-center justify-end">
        <p className="flex-1 text-white text-[16px] font-light leading-8 text-right">
          {description}
        </p>

        {/* Download Button */}
        {attachmentUrl && (
          <button
            onClick={handleDownload}
            className="bg-[#fcfafa] rounded-2xl p-3 size-8 flex items-center justify-center shrink-0 hover:bg-[#e1e1e1] transition-colors"
            aria-label="Download event attachment"
          >
            <img alt="" className="size-4" src={iconDownload} />
          </button>
        )}
      </div>
    </div>
  );
}

