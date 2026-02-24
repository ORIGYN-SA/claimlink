import stampStandard from "@assets/stamp_standard.svg";
import logoTransparent from "@assets/logo_transparent.svg";
import { CanisterImage } from "@/components/common/canister-image/canister-image";

interface CertificateDisplayProps {
  companyLogo: string;
  tokenId: string;
  certificateTitle: string;
  /** The asset name displayed prominently (e.g., "250g Gold") */
  companyName: string;
  certifiedBy: string;
  /** Date of certification (e.g., "2024") */
  validUntil: string;
  vatNumber: string;
  signatureImage: string;
  signerName: string;
  signerTitle: string;
  className?: string;
}

export function CertificateDisplay({
  companyLogo,
  tokenId,
  certificateTitle,
  companyName,
  certifiedBy,
  validUntil,
  vatNumber,
  signatureImage,
  signerName,
  signerTitle,
  className = "",
}: CertificateDisplayProps) {
  return (
    <div
      className={`bg-[#fcfafa] rounded-bl-[24px] rounded-br-[24px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-full ${className}`}
    >
      {/* Certificate Content Wrapper */}
      <div className="bg-[#222526] px-16 py-10 rounded-bl-[24px] rounded-br-[24px] w-full">
        {/* Certificate Paper */}
        <div className="w-[950px] mx-auto relative rounded-2xl overflow-hidden">
          {/* Background with Gradient */}
          <div className="bg-[#fcfafa] rounded-2xl relative">
            {/* Navy Header Background - positioned behind header content */}
            <div className="absolute top-0 left-0 right-0 h-[156px] bg-[#061937] rounded-t-2xl" />

            {/* Gradient Background at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[400px] overflow-hidden opacity-60">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center bottom, rgba(168,237,234,0.4) 0%, rgba(254,214,227,0.3) 30%, rgba(210,153,194,0.2) 50%, transparent 70%)",
                }}
              />
            </div>

            {/* Certificate Content */}
            <div className="relative z-10 px-16 pt-16 pb-10 flex flex-col items-center">
              {/* Header */}
              <div className="flex justify-between items-start w-full mb-[100px]">
                {/* Company Logo */}
                <div className="flex-1 border-b border-[rgba(255,255,255,0.2)] pb-4">
                  <CanisterImage
                    alt="Company Logo"
                    src={companyLogo}
                    className="h-12 object-contain brightness-0 invert"
                  />
                </div>

                {/* Spacer for stamp */}
                <div className="w-[200px]" />

                {/* Token ID */}
                <div className="flex-1 border-b border-[rgba(255,255,255,0.2)] pb-4 flex items-center justify-end">
                  <div className="text-right">
                    <p className="text-[12px] font-light leading-5 text-white/70 tracking-[3px] uppercase">
                      token id
                    </p>
                    <p className="text-[12px] font-semibold leading-5 text-white tracking-[3px] uppercase">
                      {tokenId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex flex-col gap-10 items-center justify-center w-full">
                {/* Certificate Title */}
                <p className="text-[20px] font-semibold leading-5 text-[#061937] text-center tracking-[5px] uppercase">
                  {certificateTitle}
                </p>

                {/* Certificate Details */}
                <div className="flex flex-col gap-10 items-center w-full">
                  {/* Asset (Company Name) */}
                  <div className="flex flex-col gap-4 items-center text-center w-full py-2">
                    <p className="text-[14px] font-normal leading-6 text-[#69737c] tracking-[1.4px] uppercase">
                      asset
                    </p>
                    <p className="text-[72px] font-light leading-[56px] text-[#222526]">
                      {companyName}
                    </p>
                  </div>

                  {/* Certified By */}
                  <div className="flex flex-col gap-1 items-center text-center w-full">
                    <p className="text-[14px] font-normal leading-6 text-[#69737c] tracking-[1.4px] uppercase">
                      certified by
                    </p>
                    <p className="text-[24px] font-medium leading-8 text-[#222526]">
                      {certifiedBy}
                    </p>
                  </div>

                  {/* Date of Certification */}
                  <div className="flex flex-col gap-1 items-center text-center w-full">
                    <p className="text-[14px] font-normal leading-6 text-[#69737c] tracking-[1.4px] uppercase">
                      date of certification
                    </p>
                    <p className="text-[24px] font-medium leading-8 text-[#222526]">
                      {validUntil}
                    </p>
                  </div>

                  {/* VAT Number */}
                  <div className="flex flex-col gap-1 items-center text-center w-full">
                    <p className="text-[14px] font-normal leading-6 text-[#69737c] tracking-[1.4px] uppercase">
                      vat number
                    </p>
                    <p className="text-[24px] font-medium leading-8 text-[#222526]">
                      {vatNumber}
                    </p>
                  </div>
                </div>

                {/* Signature Section */}
                <div className="flex flex-col gap-2 items-center w-full py-4 mt-6">
                  {/* Signature Image with Line */}
                  <div className="relative inline-grid place-items-start">
                    {/* Signature line */}
                    <div className="w-[251px] h-0 border-b border-[#69737c] mt-[78px]" />
                    {/* Signature Image */}
                    <CanisterImage
                      alt="Signature"
                      src={signatureImage}
                      className="h-[100px] w-[178px] object-contain mix-blend-darken absolute top-0 left-[29.5px]"
                    />
                  </div>

                  {/* Signer Info */}
                  <div className="flex flex-col gap-1 items-center text-center w-full">
                    <p className="text-[22px] font-medium leading-8 text-[#222526]">
                      {signerName}
                    </p>
                    <p className="text-[14px] font-normal leading-6 text-[#69737c] tracking-[1.4px] uppercase">
                      {signerTitle}
                    </p>
                  </div>
                </div>

                {/* ORIGYN Logo Bottom */}
                <div className="flex flex-col gap-4 items-center mt-10 mb-6">
                  <img
                    alt="ORIGYN"
                    src={logoTransparent}
                    className="h-[90px] w-[92px] object-contain"
                  />
                  <p className="text-[10px] font-extralight leading-5 text-[#69737c] tracking-[2.5px] uppercase text-center">
                    Powered by origyn
                  </p>
                </div>
              </div>
            </div>

            {/* Stamp - Positioned at top center overlapping header */}
            <div className="absolute top-4 left-0 right-0 z-20 flex justify-center">
              <img
                alt="Blockchain Certified"
                src={stampStandard}
                className="w-[124px] h-[124px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
