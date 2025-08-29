import { cn } from "@/lib/utils";
import type { CertificateStatus } from "../types/certificate.types";

interface CertificateStatusBadgeProps {
  status: CertificateStatus;
  className?: string;
}

export function CertificateStatusBadge({ status, className }: CertificateStatusBadgeProps) {
  const getStatusConfig = (status: CertificateStatus) => {
    switch (status) {
      case 'Minted':
        return {
          text: 'Minted',
          className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
          dotColor: 'bg-[#50be8f]',
          dotBorder: 'border-[#c7f2e0]'
        };
      case 'Transferred':
        return {
          text: 'Transferred',
          className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
          dotColor: 'bg-[#615bff]',
          dotBorder: 'border-[#dddbff]'
        };
      case 'Waiting':
        return {
          text: 'Waiting for minting',
          className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
          dotColor: 'bg-[#ff55c5]',
          dotBorder: 'border-[#ffd4f0]'
        };
      case 'Burned':
        return {
          text: 'Burned',
          className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
          dotColor: 'bg-red-500',
          dotBorder: 'border-red-200'
        };
      default:
        return {
          text: status,
          className: 'bg-white border-[rgba(225,225,225,0.5)] text-[#222526]',
          dotColor: 'bg-gray-500',
          dotBorder: 'border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={cn(
      "flex items-center gap-2 px-2 py-1 rounded-full border border-solid",
      config.className,
      className
    )}>
      <div className={cn(
        "w-2.5 h-2.5 rounded-full border",
        config.dotColor,
        config.dotBorder
      )} />
      <span className="text-[12px] font-medium leading-normal whitespace-nowrap">
        {config.text}
      </span>
    </div>
  );
}
