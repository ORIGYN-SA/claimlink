import stampStandard from "@assets/stamp_standard.svg";
import logoTransparent from "@assets/logo_transparent.svg";
import type { TemplateBackground } from "@/features/templates/types/template.types";

interface CertificateFrameProps {
  /** Company logo URL (displayed in header, inverted to white) */
  companyLogo?: string;
  /** Token ID displayed in header */
  tokenId: string;
  /** Dynamic content from TemplateRenderer */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Background configuration (custom image/video or standard gradient) */
  background?: TemplateBackground;
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
  background,
}: CertificateFrameProps) {
  const hasCustomBackground = background?.type === 'custom' && background.dataUri;
  const isVideoBackground = hasCustomBackground && background.mediaType === 'video';
  return (
    <div
      className={`bg-[#fcfafa] rounded-bl-[24px] rounded-br-[24px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-full ${className}`}
    >
      {/* Certificate Content Wrapper */}
      <div className="bg-[#222526] px-4 sm:px-16 py-6 sm:py-10 rounded-bl-[24px] rounded-br-[24px] w-full">
        {/* Certificate Paper */}
        <div className="w-full max-w-[950px] mx-auto relative rounded-2xl overflow-hidden">
          {/* Background with Gradient */}
          <div className="bg-[#fcfafa] rounded-2xl relative">
            {/* Navy Header Background - positioned behind header content */}
            <div className="absolute top-0 left-0 right-0 h-[100px] sm:h-[156px] bg-[#061937] rounded-t-2xl" />

            {/* Background - Custom image/video or standard gradient */}
            {hasCustomBackground ? (
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                {isVideoBackground ? (
                  <video
                    src={background.dataUri}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    autoPlay
                  />
                ) : (
                  <img
                    src={background.dataUri}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30" />
              </div>
            ) : (
              /* Standard Gradient Background at Bottom */
              <div className="absolute bottom-0 left-0 right-0 h-[300px] sm:h-[400px] overflow-hidden opacity-60">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at center bottom, rgba(168,237,234,0.4) 0%, rgba(254,214,227,0.3) 30%, rgba(210,153,194,0.2) 50%, transparent 70%)",
                  }}
                />
              </div>
            )}

            {/* Certificate Content */}
            <div className="relative z-10 px-4 sm:px-16 pt-10 sm:pt-16 pb-6 sm:pb-10 flex flex-col items-center">
              {/* Header */}
              <div className="flex justify-between items-start w-full mb-[30px] sm:mb-[60px]">
                {/* Company Logo */}
                <div className="flex-1 border-b border-[rgba(255,255,255,0.2)] pb-2 sm:pb-4">
                  {companyLogo ? (
                    <img
                      alt="Company Logo"
                      src={companyLogo}
                      className="h-8 sm:h-12 object-contain brightness-0 invert"
                    />
                  ) : (
                    <div className="h-8 sm:h-12" /> // Placeholder for logo
                  )}
                </div>

                {/* Spacer for stamp */}
                <div className="w-[80px] sm:w-[200px]" />

                {/* Token ID */}
                <div className="flex-1 border-b border-[rgba(255,255,255,0.2)] pb-2 sm:pb-4 flex items-center justify-end">
                  <div className="text-right">
                    <p className="text-[10px] sm:text-[12px] font-light leading-4 sm:leading-5 text-white/70 tracking-[2px] sm:tracking-[3px] uppercase">
                      token id
                    </p>
                    <p className="text-[10px] sm:text-[12px] font-semibold leading-4 sm:leading-5 text-white tracking-[2px] sm:tracking-[3px] uppercase truncate max-w-[80px] sm:max-w-none">
                      {tokenId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Content Slot */}
              <div className="flex flex-col gap-6 sm:gap-10 items-center justify-center w-full">
                {children}
              </div>

              {/* ORIGYN Logo Bottom */}
              <div className="flex flex-col gap-2 sm:gap-4 items-center mt-6 sm:mt-10 mb-4 sm:mb-6">
                <img
                  alt="ORIGYN"
                  src={logoTransparent}
                  className="h-[60px] w-[62px] sm:h-[90px] sm:w-[92px] object-contain"
                />
                <p className="text-[8px] sm:text-[10px] font-extralight leading-4 sm:leading-5 text-[#69737c] tracking-[1.5px] sm:tracking-[2.5px] uppercase text-center">
                  Powered by origyn
                </p>
              </div>
            </div>

            {/* Stamp - Positioned at top center overlapping header */}
            <div className="absolute top-2 sm:top-4 left-0 right-0 z-20 flex justify-center">
              <img
                alt="Blockchain Certified"
                src={stampStandard}
                className="w-[80px] h-[80px] sm:w-[124px] sm:h-[124px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
