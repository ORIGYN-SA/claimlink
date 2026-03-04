import { CertificateGallery } from "./detail/certificate-gallery";

interface InformationFrameProps {
  /** Title shown in sticky left column */
  title?: {
    artistName?: string;
    artworkTitle?: string;
    year?: string;
  };
  /** Custom section heading (e.g., "Made In Italy" instead of "Information") */
  sectionTitle?: string;
  /** Dynamic content from TemplateRenderer */
  children: React.ReactNode;
  /** Gallery images to display below content */
  galleryImages?: Array<{ url: string; legend: string }>;
  /** Additional CSS classes */
  className?: string;
}

/**
 * InformationFrame provides the visual styling wrapper for the Information tab:
 * - Dark background (#222526)
 * - Two-column layout: sticky title on left, content on right
 * - Gallery section at bottom
 *
 * The `children` slot is where dynamic TemplateRenderer content is placed.
 */
export function InformationFrame({
  title,
  sectionTitle,
  children,
  galleryImages,
  className = "",
}: InformationFrameProps) {
  const hasTitle = title?.artistName || title?.artworkTitle || sectionTitle;

  return (
    <div
      className={`bg-[#fcfafa] rounded-bl-[24px] rounded-br-[24px] w-full ${className}`}
    >
      {/* Main Content Section */}
      <div className="bg-[#222526] flex flex-col gap-8 sm:gap-16 w-full rounded-bl-[24px] rounded-br-[24px]">
        {/* Two-column layout: Title (sticky) + Content */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-16 px-4 sm:px-16 py-6 sm:py-10 w-full">
          {/* Left Column - Sticky Title */}
          {hasTitle && (
            <div className="w-full lg:w-[389px] shrink-0 lg:sticky lg:top-0 flex items-center justify-center py-4 sm:py-10">
              <div className="w-full">
                {sectionTitle && (
                  <p className="text-[#85f1ff] text-[12px] sm:text-[14px] font-semibold leading-5 tracking-[2px] sm:tracking-[3px] uppercase mb-2">
                    {sectionTitle}
                  </p>
                )}
                {title?.artistName && (
                  <p className="text-[#e1e1e1] text-[14px] sm:text-[16px] font-semibold leading-5 tracking-[1.5px] sm:tracking-[2.24px] uppercase mb-0">
                    {title.artistName}
                  </p>
                )}
                {title?.artworkTitle && (
                  <p className="text-[#f9f8f4] mb-0">
                    <span className="font-extralight italic text-[24px] sm:text-[38px] leading-[32px] sm:leading-[50px]">
                      {title.artworkTitle}
                    </span>
                    {title?.year && (
                      <span className="font-extralight text-[16px] sm:text-[24px] leading-6 sm:leading-8">
                        {" "}
                        {title.year}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Right Column - Dynamic Content */}
          <div className={`flex-1 flex flex-col py-4 sm:py-10 ${!hasTitle ? 'w-full' : ''}`}>
            {children}
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      {galleryImages && galleryImages.length > 0 && (
        <CertificateGallery images={galleryImages} />
      )}
    </div>
  );
}
