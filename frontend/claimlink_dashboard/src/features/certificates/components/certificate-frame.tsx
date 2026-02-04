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
 * CertificateFrame provides the visual "certificate" styling wrapper.
 *
 * Standard background layout:
 * - Dark outer wrapper with rounded corners
 * - 950px white certificate paper with navy header badge
 * - Stamp positioned at top center
 * - Company logo left, token ID right in header
 * - ORIGYN logo at bottom
 * - Gradient at bottom
 *
 * Custom background layout (Figma design):
 * - Full-bleed background image/video covering entire component
 * - Glass panel overlay (semi-transparent dark) with rounded corners
 * - Company logo centered at top inside panel
 * - Stamp floats above the glass panel
 * - Footer with white ORIGYN logo + "POWERED BY ORIGYN" + token ID
 * - No navy curved badge
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

  // Custom background layout - completely different structure per Figma design
  if (hasCustomBackground) {
    return (
      <div
        className={`rounded-bl-[24px] rounded-br-[24px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-full ${className}`}
      >
        {/* Full-bleed background wrapper */}
        <div className="relative w-[950px] h-[1350px] mx-auto">
          {/* Background media - full bleed */}
          <div className="absolute inset-0 rounded-bl-[24px] rounded-br-[24px] overflow-hidden">
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
          </div>

          {/* Content container with padding */}
          <div className="relative p-[64px] flex flex-col items-center h-full">
            {/* Glass panel overlay */}
            <div
              className="w-full rounded-[32px] sm:rounded-[48px] p-[64px] flex flex-col justify-between items-center relative flex-1"
              style={{
                background: 'rgba(2, 2, 2, 0.2)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {/* Stamp - floats above the glass panel */}
              <div className="absolute -top-[35px] sm:-top-[55px] left-0 right-0 z-20 flex justify-center">
                <img
                  alt="Blockchain Certified"
                  src={stampStandard}
                  className="w-[70px] h-[70px] sm:w-[110px] sm:h-[110px]"
                />
              </div>

              {/* Company Logo - centered at top inside panel */}
              <div className="flex justify-center w-full mb-8 sm:mb-12 mt-8 sm:mt-10">
                {companyLogo ? (
                  <img
                    alt="Company Logo"
                    src={companyLogo}
                    className="h-[32px] sm:h-[48px] object-contain brightness-0 invert"
                  />
                ) : (
                  <div className="h-[32px] sm:h-[48px]" />
                )}
              </div>

              {/* Dynamic Content Slot */}
              <div className="flex flex-col gap-8 sm:gap-10 items-center justify-center w-full flex-1">
                {children}
              </div>

              {/* Footer: ORIGYN logo + Token ID */}
              <div className="flex flex-col gap-2 sm:gap-3 items-center mt-10 sm:mt-14 mb-2 sm:mb-4">
                <img
                  alt="ORIGYN"
                  src={logoTransparent}
                  className="h-[40px] w-[42px] sm:h-[56px] sm:w-[58px] object-contain brightness-0 invert"
                />
                <p className="text-[8px] sm:text-[10px] font-light leading-4 sm:leading-5 text-white/80 tracking-[2px] sm:tracking-[3px] uppercase text-center">
                  Powered by origyn
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-[10px] sm:text-[12px] font-normal leading-5 text-white/60 tracking-[2px] sm:tracking-[3px] uppercase">
                    token id:
                  </p>
                  <p className="text-[12px] sm:text-[14px] font-semibold leading-5 text-white tracking-[1.5px] sm:tracking-[2px] uppercase">
                    {tokenId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard background layout - original design
  return (
    <div
      className={`bg-[#fcfafa] rounded-bl-[24px] rounded-br-[24px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-full ${className}`}
    >
      {/* Certificate Content Wrapper */}
      <div className="bg-[#222526] px-4 sm:px-16 py-6 sm:py-10 rounded-bl-[24px] rounded-br-[24px] w-full">
        {/* Certificate Paper - fixed dimensions */}
        <div className="w-[950px] h-[1350px] mx-auto relative rounded-2xl overflow-hidden">
          {/* Background with Gradient */}
          <div className="bg-[#fcfafa] rounded-2xl relative h-full">
            {/* Standard Gradient Background at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[300px] sm:h-[400px] overflow-hidden opacity-60">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center bottom, rgba(168,237,234,0.4) 0%, rgba(254,214,227,0.3) 30%, rgba(210,153,194,0.2) 50%, transparent 70%)",
                }}
              />
            </div>

            {/* Navy curved badge holder from Figma */}
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 312 156"
                fill="none"
                className="w-[200px] h-[100px] sm:w-[312px] sm:h-[156px]"
              >
                <path
                  d="M156 0H0C43.0793 0 78 34.9207 78 78C78 121.079 112.921 156 156 156C199.079 156 234 121.079 234 78C234 34.9207 268.928 0 312.007 0H156.007H156Z"
                  fill="#061937"
                />
              </svg>
            </div>

            {/* Certificate Content */}
            <div className="relative z-10 p-[64px] flex flex-col justify-between items-center h-full">
              {/* Header - Logo and Token ID aligned with stamp */}
              <div className="flex justify-between w-full">
                {/* Company Logo */}
                <div className="flex items-center pb-4 flex-1 border-b border-[rgba(105,115,124,0.2)]">
                  {companyLogo ? (
                    <img
                      alt="Company Logo"
                      src={companyLogo}
                      className="h-[28px] sm:h-[40px] object-contain"
                    />
                  ) : (
                    <div className="h-[28px] sm:h-[40px]" />
                  )}
                </div>

                {/* Spacer for stamp badge */}
                <div className="w-[160px] sm:w-[280px] shrink-0" />

                {/* Token ID */}
                <div className="flex items-center justify-end pb-4 flex-1 border-b border-[rgba(105,115,124,0.2)]">
                  <div className="text-right">
                    <p className="text-[10px] sm:text-[12px] font-normal leading-5 text-[#69737c] tracking-[2px] sm:tracking-[3px] uppercase mb-1">
                      token id
                    </p>
                    <p className="text-[12px] sm:text-[14px] font-semibold leading-5 text-[#222526] tracking-[1.5px] sm:tracking-[2px] uppercase">
                      {tokenId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Content Slot */}
              <div className="flex flex-col gap-8 items-center justify-center w-full">
                {children}
              </div>

              {/* ORIGYN Logo Bottom */}
              <div className="flex flex-col gap-2 sm:gap-3 items-center">
                <img
                  alt="ORIGYN"
                  src={logoTransparent}
                  className="h-[50px] w-[52px] sm:h-[70px] sm:w-[72px] object-contain"
                />
                <p className="text-[8px] sm:text-[10px] font-light leading-4 sm:leading-5 text-[#9ca3af] tracking-[2px] sm:tracking-[3px] uppercase text-center">
                  Powered by origyn
                </p>
              </div>
            </div>

            {/* Stamp - Positioned at top center within navy curved area */}
            <div className="absolute top-[15px] sm:top-[22px] left-0 right-0 z-20 flex justify-center">
              <img
                alt="Blockchain Certified"
                src={stampStandard}
                className="w-[70px] h-[70px] sm:w-[110px] sm:h-[110px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
