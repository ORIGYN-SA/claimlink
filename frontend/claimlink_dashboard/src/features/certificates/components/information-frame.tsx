import { CertificateGallery } from "./detail/certificate-gallery";

interface InformationFrameProps {
  /** Title shown in sticky left column */
  title?: {
    artistName?: string;
    artworkTitle?: string;
    year?: string;
  };
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
  children,
  galleryImages,
  className = "",
}: InformationFrameProps) {
  const hasTitle = title?.artistName || title?.artworkTitle;

  return (
    <div
      className={`bg-[#fcfafa] rounded-bl-[24px] rounded-br-[24px] w-full ${className}`}
    >
      {/* Main Content Section */}
      <div className="bg-[#222526] flex flex-col gap-16 w-full rounded-bl-[24px] rounded-br-[24px]">
        {/* Two-column layout: Title (sticky) + Content */}
        <div className="flex gap-16 px-16 py-10 w-full">
          {/* Left Column - Sticky Title */}
          {hasTitle && (
            <div className="w-[389px] shrink-0 sticky top-0 flex items-center justify-center py-10">
              <div className="w-full">
                {title?.artistName && (
                  <p className="text-[#e1e1e1] text-[16px] font-semibold leading-5 tracking-[2.24px] uppercase mb-0">
                    {title.artistName}
                  </p>
                )}
                {title?.artworkTitle && (
                  <p className="text-[#f9f8f4] mb-0">
                    <span className="font-extralight italic text-[38px] leading-[50px]">
                      {title.artworkTitle}
                    </span>
                    {title?.year && (
                      <span className="font-extralight text-[24px] leading-8">
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
          <div className={`flex-1 flex flex-col py-10 ${!hasTitle ? 'w-full' : ''}`}>
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
