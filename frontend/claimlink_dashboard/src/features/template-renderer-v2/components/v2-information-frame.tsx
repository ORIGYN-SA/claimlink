/**
 * V2 Information Frame
 *
 * Visual wrapper for information view with sticky title column and gallery.
 * Reads config from V2InformationFrameConfig via context.
 * Reuses CertificateGallery for the gallery section.
 */

import type { V2InformationFrameConfig, V2LayoutNode } from '../types';
import { useV2Context } from '../context/v2-template-context';
import { V2ContentRenderer } from './v2-content-renderer';
import { CertificateGallery } from '@/features/certificates/components/detail/certificate-gallery';

interface V2InformationFrameProps {
  config?: V2InformationFrameConfig;
  content: V2LayoutNode[];
}

export function V2InformationFrame({ config, content }: V2InformationFrameProps) {
  const { getFieldValue, getFileArray, resolveAssetUrl } = useV2Context();

  // Resolve title fields from config
  const companyName = config?.companyNameField ? getFieldValue(config.companyNameField) : null;
  const certificateTitle = config?.certificateTitleField ? getFieldValue(config.certificateTitleField) : null;
  const dateValue = config?.dateField ? getFieldValue(config.dateField) : null;
  const sectionTitle = config?.sectionTitleField ? getFieldValue(config.sectionTitleField) : null;

  const hasTitle = companyName || certificateTitle || sectionTitle;

  // Build gallery images from field reference
  const galleryImages: Array<{ url: string; legend: string }> = [];
  if (config?.galleryField) {
    const files = getFileArray(config.galleryField);
    for (const file of files) {
      galleryImages.push({
        url: resolveAssetUrl(file.path),
        legend: file.id || '',
      });
    }
  }

  return (
    <div className="bg-[#fcfafa] rounded-bl-[24px] rounded-br-[24px] w-full">
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
                {companyName && (
                  <p className="text-[#e1e1e1] text-[14px] sm:text-[16px] font-semibold leading-5 tracking-[1.5px] sm:tracking-[2.24px] uppercase mb-0">
                    {companyName}
                  </p>
                )}
                {certificateTitle && (
                  <p className="text-[#f9f8f4] mb-0">
                    <span className="font-extralight italic text-[24px] sm:text-[38px] leading-[32px] sm:leading-[50px]">
                      {certificateTitle}
                    </span>
                    {dateValue && (
                      <span className="font-extralight text-[16px] sm:text-[24px] leading-6 sm:leading-8">
                        {' '}{dateValue}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Right Column - Dynamic Content */}
          <div className={`flex-1 flex flex-col py-4 sm:py-10 ${!hasTitle ? 'w-full' : ''}`}>
            <V2ContentRenderer content={content} variant="information" />
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <CertificateGallery images={galleryImages} />
      )}
    </div>
  );
}
