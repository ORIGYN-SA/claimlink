import { TokenStatusBadge } from "@/components/common/token-status-badge";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CertificateQRCode } from "./certificate-qr-code";
import { QRCodeService } from "../api/qr.service";

interface CertificateLaunchpadProps {
  imageUrl: string;
  companyName: string;
  isVerified?: boolean;
  status: 'Minted' | 'Transferred' | 'Waiting' | 'Burned' | 'Unclaimed';
  title: string;
  description: string;
  issuerLogo?: string;
  issuerName: string;
  qrCodeUrl?: string; // Deprecated: kept for backward compatibility
  canisterId?: string; // Collection canister ID for QR generation
  tokenId?: string; // Token ID for QR generation
  className?: string;
}

export function CertificateLaunchpad({
  imageUrl,
  companyName,
  isVerified = false,
  status,
  title,
  description,
  issuerLogo,
  issuerName,
  qrCodeUrl, // Deprecated
  canisterId,
  tokenId,
  className,
}: CertificateLaunchpadProps) {
  // Generate QR code URL using new service (preferred method)
  const qrValue = canisterId && tokenId
    ? QRCodeService.getCertificateVerificationUrl(canisterId, tokenId)
    : qrCodeUrl; // Fallback to old prop for backward compatibility
  return (
    <div
      className={cn(
        "flex gap-16 items-center p-16",
        className
      )}
    >
      {/* Left Section: Certificate Image */}
      <div className="flex-1 bg-[rgba(225,225,225,0.5)] border border-[#e1e1e1] rounded-2xl p-16 flex items-center justify-center min-h-[443px]">
        <div className="flex-1 h-full flex items-center justify-center">
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      {/* Right Section: Certificate Details */}
      <div className="w-[443px] flex flex-col gap-10 items-center justify-center">
        {/* Certificate Info */}
        <div className="flex flex-col gap-2 items-start w-full">
          {/* Company Name & Status */}
          <div className="flex gap-6 items-center w-full">
            <div className="flex-1 flex gap-1 items-center">
              <p className="text-[14px] font-medium text-[#69737c] uppercase tracking-[0.7px]">
                {companyName}
              </p>
              {isVerified && (
                <CheckCircle2 className="w-4 h-4 text-[#061937] fill-[#061937]" />
              )}
            </div>
            <TokenStatusBadge status={status} className="h-8" />
          </div>

          {/* Certificate Title & Description */}
          <div className="flex flex-col gap-6 items-start w-full">
            <h1 className="text-[48px] font-light leading-[56px] text-[#222526] font-['General_Sans',_sans-serif] w-[365px]">
              {title}
            </h1>
            <p className="text-[16px] font-normal leading-[24px] text-[#69737c] tracking-[0.8px]">
              {description}
            </p>

            {/* Info Cards Row */}
            <div className="flex gap-4 items-start w-full">
              {/* Issued By Card */}
              <div className="flex-1 bg-white border border-[#e1e1e1] rounded-2xl p-4 flex gap-4 items-center cursor-pointer hover:shadow-sm transition-shadow">
                {issuerLogo && (
                  <div className="w-16 h-16 relative shrink-0">
                    <img
                      src={issuerLogo}
                      alt={issuerName}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1 items-start">
                  <p className="text-[12px] font-normal text-[#69737c] uppercase tracking-[1.2px]">
                    issued by
                  </p>
                  <p className="text-[16px] font-semibold text-[#222526] font-['DM_Sans',_sans-serif]">
                    {issuerName}
                  </p>
                </div>
              </div>

              {/* Claim Certificate Card */}
              <div className="flex-1 bg-white border border-[#e1e1e1] rounded-2xl p-4 flex gap-4 items-center">
                {qrValue && (
                  <div className="w-16 h-16 relative shrink-0">
                    <CertificateQRCode
                      value={qrValue}
                      size={64}
                      level="L"
                      showLogo={false} // No logo at small size
                      className="w-full h-full"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1 items-start">
                  <p className="text-[12px] font-normal text-[#69737c] uppercase tracking-[1.2px] whitespace-pre-wrap">
                    claim certificate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

