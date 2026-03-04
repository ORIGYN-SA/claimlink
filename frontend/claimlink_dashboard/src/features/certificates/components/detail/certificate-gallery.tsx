import { CanisterImage } from '@/components/common/canister-image/canister-image';

interface CertificateGalleryImage {
  url: string;
  legend: string;
}

interface CertificateGalleryProps {
  images: CertificateGalleryImage[];
  className?: string;
}

export function CertificateGallery({
  images,
  className = "",
}: CertificateGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div
      className={`bg-[#222526] flex gap-16 overflow-x-auto overflow-y-clip pb-16 pl-16 pr-0 rounded-bl-[24px] rounded-br-[24px] ${className}`}
    >
      {images.map((image, index) => (
        <div
          key={index}
          className={`flex flex-col gap-4 items-center shrink-0 ${
            index === images.length - 1 ? "pr-16" : ""
          }`}
        >
          {/* Image Container */}
          <div className="bg-[#181a1b] h-[587px] w-[436px] flex items-center justify-center overflow-hidden">
            <CanisterImage
              alt={image.legend}
              src={image.url}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Legend */}
          <p className="text-white text-[16px] font-light leading-8 text-center tracking-[0.8px] uppercase opacity-80 w-[286px]">
            {image.legend}
          </p>
        </div>
      ))}
    </div>
  );
}

