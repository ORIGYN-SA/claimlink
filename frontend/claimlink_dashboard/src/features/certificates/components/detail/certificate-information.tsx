import { Copy, Download } from "lucide-react";
import { CertificateMetadataRow } from "./certificate-metadata-row";
import { CertificateGallery } from "./certificate-gallery";

export interface CertificateInformationData {
  artistName: string;
  artworkTitle: string;
  year: string;
  description: string[];
  productionYear: string;
  objectType: string;
  edition: string;
  medium: string;
  assetType: string;
  location: string;
  contractAddress: string;
  contractAddressShort: string;
  contractAddressUrl: string;
  galleryImages: Array<{
    url: string;
    legend: string;
  }>;
}

interface CertificateInformationProps {
  data: CertificateInformationData;
  className?: string;
}

export function CertificateInformation({
  data,
  className = "",
}: CertificateInformationProps) {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(data.contractAddress);
  };

  const handleDownloadReport = () => {
    // TODO: Implement download report functionality
    console.log("Download report");
  };

  return (
    <div
      className={`bg-[#fcfafa] rounded-bl-[24px] rounded-br-[24px] w-full ${className}`}
    >
      {/* Main Description Section */}
      <div className="bg-[#222526] flex flex-col gap-16 w-full">
        {/* Two-column layout: Title (sticky) + Content */}
        <div className="flex gap-16 px-16 py-10 w-full">
          {/* Left Column - Sticky Title */}
          <div className="w-[389px] shrink-0 sticky top-0 flex items-center justify-center py-10">
            <div className="w-full">
              <p className="text-[#e1e1e1] text-[16px] font-semibold leading-5 tracking-[2.24px] uppercase mb-0">
                {data.artistName}
              </p>
              <p className="text-[#f9f8f4] mb-0">
                <span className="font-['Gestura_Display_TRIAL'] font-extralight italic text-[38px] leading-[50px]">
                  {data.artworkTitle}
                </span>
                <span className="font-extralight text-[24px] leading-8">
                  {" "}
                  {data.year}
                </span>
              </p>
            </div>
          </div>

          {/* Right Column - Description and Metadata */}
          <div className="flex-1 flex flex-col py-10">
            {/* Description Section */}
            <div className="flex flex-col gap-4 pb-16">
              <p className="text-[#e1e1e1] text-[12px] font-medium leading-normal tracking-[1.2px] uppercase">
                Description
              </p>
              <div className="text-white text-[16px] font-light leading-8">
                {data.description.map((paragraph, index) => (
                  <p key={index} className={index < data.description.length - 1 ? "mb-4" : "mb-0"}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Metadata Rows */}
            <div className="flex flex-col w-full">
              <CertificateMetadataRow
                label="Production year"
                value={data.productionYear}
              />
              <CertificateMetadataRow
                label="Object type"
                value={data.objectType}
                hasBorder
              />
              <CertificateMetadataRow
                label="Edition"
                value={data.edition}
                hasBorder
              />
              <CertificateMetadataRow
                label="Medium"
                value={data.medium}
                hasBorder
              />
              <CertificateMetadataRow
                label="Asset type"
                value={data.assetType}
                hasBorder
              />
              <CertificateMetadataRow
                label="Location"
                value={data.location}
                hasBorder
              />

              {/* Contract Address Row (special case with link and copy) */}
              <div className="flex items-start justify-between py-4 border-t border-[rgba(239,236,227,0.25)]">
                <p className="text-[#e1e1e1] text-[12px] font-normal leading-6 tracking-[1.2px] uppercase w-[159px] shrink-0">
                  Contract address
                </p>
                <div className="flex-1 flex gap-2 items-center justify-end">
                  <a
                    href={data.contractAddressUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-[16px] font-light leading-8 text-right underline decoration-solid hover:text-[#85f1ff] transition-colors"
                  >
                    {data.contractAddressShort}
                  </a>
                  <button
                    onClick={handleCopyAddress}
                    className="shrink-0 size-4 cursor-pointer hover:opacity-70 transition-opacity"
                    aria-label="Copy contract address"
                  >
                    <Copy className="size-full text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Download Report Button */}
            <div className="flex gap-4 mt-0 w-full">
              <button
                onClick={handleDownloadReport}
                className="flex-1 bg-white text-[#222526] h-14 rounded-[20px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.15)] hover:bg-[#e1e1e1] transition-colors pl-6 pr-3 py-3 flex items-center justify-center gap-2.5"
              >
                <span className="text-[14px] font-normal leading-4 text-center">
                  Download report
                </span>
                <div className="bg-[#222526] rounded-2xl p-3 size-8 flex items-center justify-center shrink-0">
                  <Download className="size-4 text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <CertificateGallery images={data.galleryImages} />
    </div>
  );
}

