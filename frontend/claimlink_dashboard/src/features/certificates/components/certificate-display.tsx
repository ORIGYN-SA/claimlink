// Image assets from Figma design
const imgGradient1 = "http://localhost:3845/assets/e61e1045d1911dd859b227a4c935e869315934c1.svg";
const imgGradient3 = "http://localhost:3845/assets/682663fcb95a58325d7d2d87a3be082466f303c7.svg";
const imgGradient4 = "http://localhost:3845/assets/074f04533fe0faa6abf0aaaa997c71a22b5d477d.svg";
const imgGradient5 = "http://localhost:3845/assets/29efa52fa5ffa8a9f0411613af6865d6368184c1.svg";
const imgOrigynIcon1 = "http://localhost:3845/assets/2eb8358fc870f3dd58d99fda656c3cf8d1a59bab.svg";
const imgOrigynIcon2 = "http://localhost:3845/assets/980a458467a394cf03af82c6be4f66c6193b6049.svg";
const imgOrigynIcon3 = "http://localhost:3845/assets/f21a0a2506482f40242d586e3d255f4503edc074.svg";
const imgOrigynIcon4 = "http://localhost:3845/assets/7209f135dd84cc50c8a0fa4ca8bf5337dad357f3.svg";
const imgBgStamp = "http://localhost:3845/assets/a7a8537fcb68be215d74acb3c651ca62d8ca0974.svg";

interface CertificateDisplayProps {
  companyLogo: string;
  tokenId: string;
  certificateTitle: string;
  companyName: string;
  certifiedBy: string;
  validUntil: string;
  vatNumber: string;
  signatureImage: string;
  signerName: string;
  signerTitle: string;
  stampContent?: React.ReactNode;
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
  stampContent,
  className = "",
}: CertificateDisplayProps) {
  return (
    <div
      className={`bg-[#fcfafa] rounded-bl-[24px] rounded-br-[24px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-full ${className}`}
    >
      {/* Certificate Content Wrapper */}
      <div className="bg-[#222526] px-16 py-10 rounded-bl-4 rounded-br-4 w-full">
        {/* Certificate Paper */}
        <div className="h-[1350px] w-[950px] mx-auto relative rounded-2xl overflow-hidden">
          {/* Background with Gradient */}
          <div className="absolute inset-0 bg-[#fcfafa] rounded-2xl">
            {/* Gradient Background */}
            <div className="absolute h-[796px] left-[-33px] top-[847px] w-[1016px] mix-blend-darken opacity-75">
              <div className="absolute inset-0">
                <img alt="" className="absolute inset-0 w-full h-full" src={imgGradient1} />
              </div>
              <div className="absolute inset-0">
                <img alt="" className="absolute inset-0 w-full h-full" src={imgGradient3} />
              </div>
              <div className="absolute inset-0">
                <img alt="" className="absolute inset-0 w-full h-full" src={imgGradient4} />
              </div>
              <div className="absolute inset-0">
                <img alt="" className="absolute inset-0 w-full h-full" src={imgGradient5} />
              </div>
            </div>

            {/* ORIGYN Logo Bottom */}
            <div className="absolute left-[405px] top-[1172px] w-[139px] flex flex-col gap-4 items-center">
              <div className="h-[90px] w-[92px] relative overflow-hidden">
                <div className="absolute inset-[24.34%_70.73%_17.94%_8.28%]">
                  <img alt="" className="w-full h-full" src={imgOrigynIcon1} />
                </div>
                <div className="absolute inset-[64.28%_17.16%_0.15%_8.3%]">
                  <img alt="" className="w-full h-full" src={imgOrigynIcon2} />
                </div>
                <div className="absolute inset-[0.15%_0.17%_60.03%_0.15%]">
                  <img alt="" className="w-full h-full" src={imgOrigynIcon3} />
                </div>
                <div className="absolute inset-[17.97%_0.14%_0.15%_65.81%]">
                  <img alt="" className="w-full h-full" src={imgOrigynIcon4} />
                </div>
              </div>
              <p className="text-[10px] font-extralight leading-5 text-[#69737c] tracking-[2.5px] uppercase text-right w-full">
                Powered by origyn
              </p>
            </div>
          </div>

          {/* Certificate Content */}
          <div className="absolute inset-0 p-16 flex flex-col items-center justify-between">
            {/* Header */}
            <div className="flex gap-[200px] items-start w-full">
              {/* Company Logo */}
              <div className="flex-1 border-b border-[rgba(105,115,124,0.2)] pb-4">
                <img
                  alt="Company Logo"
                  src={companyLogo}
                  className="h-12 object-contain"
                />
              </div>

              {/* Token ID */}
              <div className="flex-1 border-b border-[rgba(105,115,124,0.2)] pb-4 flex items-center justify-end">
                <div className="text-right">
                  <p className="text-[12px] font-light leading-5 text-[#222526] tracking-[3px] uppercase">
                    token id
                  </p>
                  <p className="text-[12px] font-semibold leading-5 text-[#222526] tracking-[3px] uppercase">
                    {tokenId}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-10 items-center justify-center py-16 w-full">
              {/* Certificate Title */}
              <p className="text-[20px] font-semibold leading-5 text-[#061937] text-center tracking-[5px] uppercase">
                {certificateTitle}
              </p>

              {/* Certificate Details */}
              <div className="flex flex-col gap-10 items-start w-full">
                {/* Company Name */}
                <div className="flex flex-col gap-4 items-center text-center w-full py-2">
                  <p className="text-[14px] font-normal leading-6 text-[#69737c] tracking-[1.4px] uppercase">
                    company name
                  </p>
                  <p className="text-[96px] font-light leading-[56px] text-[#222526]">
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

                {/* Valid Until */}
                <div className="flex flex-col gap-1 items-center text-center w-full">
                  <p className="text-[14px] font-normal leading-6 text-[#69737c] tracking-[1.4px] uppercase">
                    Certification valid until
                  </p>
                  <p className="text-[24px] font-medium leading-8 text-[#222526]">
                    {validUntil}
                  </p>
                </div>

                {/* VAT Number */}
                <div className="flex flex-col gap-1 items-center text-center w-full">
                  <p className="text-[14px] font-normal leading-6 text-[#69737c] tracking-[1.4px] uppercase">
                    VAT number
                  </p>
                  <p className="text-[24px] font-medium leading-8 text-[#222526]">
                    {vatNumber}
                  </p>
                </div>
              </div>

              {/* Signature Section */}
              <div className="flex flex-col gap-2 items-center w-full py-1">
                {/* Signature Image with Line */}
                <div className="relative inline-grid place-items-start">
                  {/* Signature line */}
                  <div className="w-[251px] h-0 border-b border-[#69737c] mt-[78px]" />
                  {/* Signature Image */}
                  <img
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
            </div>
          </div>

          {/* Stamp - Positioned at top center with partial overlap */}
          <div className="absolute h-[156px] left-[308.67px] top-0 w-[332px]">
            {/* Stamp Background Shadow */}
            <div className="absolute h-[156px] left-[10px] top-0 w-[312px]">
              <img alt="" className="w-full h-full" src={imgBgStamp} />
            </div>

            {/* Stamp Content */}
            <div className="absolute left-[104px] top-4 size-[124px]">
              {stampContent || (
                <div className="size-full rounded-full bg-white border-4 border-[#061937] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[14px] font-semibold text-[#061937]">100%</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

