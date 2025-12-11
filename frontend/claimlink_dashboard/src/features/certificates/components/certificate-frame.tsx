import stampStandard from "@assets/stamp_standard.svg";
import logoTransparent from "@assets/logo_transparent.svg";

interface CertificateFrameProps {
  /** Company logo URL (displayed in header, inverted to white) */
  companyLogo?: string;
  /** Token ID displayed in header */
  tokenId: string;
  /** Dynamic content from TemplateRenderer */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * CertificateFrame provides the visual "certificate" styling wrapper:
 * - Dark outer wrapper with rounded corners
 * - 950px white certificate paper with navy header
 * - Stamp positioned at top center
 * - ORIGYN logo at bottom
 * - Gradient at bottom
 *
 * The `children` slot is where dynamic TemplateRenderer content is placed.
 */
export function CertificateFrame({
  companyLogo,
  tokenId,
  children,
  className = "",
}: CertificateFrameProps) {
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
              <div className="flex justify-between items-start w-full mb-[60px]">
                {/* Company Logo */}
                <div className="flex-1 border-b border-[rgba(255,255,255,0.2)] pb-4">
                  {companyLogo ? (
                    <img
                      alt="Company Logo"
                      src={companyLogo}
                      className="h-12 object-contain brightness-0 invert"
                    />
                  ) : (
                    <div className="h-12" /> // Placeholder for logo
                  )}
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

              {/* Dynamic Content Slot */}
              <div className="flex flex-col gap-10 items-center justify-center w-full">
                {children}
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
