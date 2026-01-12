import { Download } from "lucide-react";

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
      className={`flex flex-col sm:flex-row items-start sm:justify-between gap-1 sm:gap-0 py-3 sm:py-4 ${getBorderClass()}`}
    >
      {/* Date */}
      <p className="text-[#e1e1e1] text-[10px] sm:text-[12px] font-normal leading-5 sm:leading-6 tracking-[1px] sm:tracking-[1.2px] uppercase w-full sm:w-[159px] shrink-0">
        {date}
      </p>

      {/* Description and Download Button */}
      <div className="flex-1 flex gap-2 items-center justify-start sm:justify-end w-full">
        <p className="flex-1 text-white text-[14px] sm:text-[16px] font-light leading-6 sm:leading-8 text-left sm:text-right">
          {description}
        </p>

        {/* Download Button */}
        {attachmentUrl && (
          <button
            onClick={handleDownload}
            className="bg-[#fcfafa] rounded-2xl p-2 sm:p-3 size-7 sm:size-8 flex items-center justify-center shrink-0 hover:bg-[#e1e1e1] transition-colors"
            aria-label="Download event attachment"
          >
            <Download className="size-3.5 sm:size-4 text-[#222526]" />
          </button>
        )}
      </div>
    </div>
  );
}

