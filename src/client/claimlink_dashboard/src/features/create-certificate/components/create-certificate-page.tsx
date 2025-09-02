import { CollectionSection } from "./collection-section";
import { ImageUploadSection } from "./image-upload-section";
import { CompanyForm } from "./company-form";
import { PricingSidebar } from "./pricing-sidebar";

export function CreateCertificatePage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start justify-start w-full max-w-none">
        {/* Main Form Section */}
        <div className="content-stretch flex flex-col gap-4 items-start justify-start relative w-full lg:w-auto lg:flex-1">

          {/* Collection Section */}
          <CollectionSection />

          {/* Certified Company Section */}
          <div className="bg-white box-border content-stretch flex flex-col gap-8 items-center justify-center px-5 py-6 relative rounded-[25px] w-full border border-[#e1e1e1]">
            {/* Title */}
            <div className="content-stretch flex flex-col gap-2 items-start justify-center relative w-full">
              <div className="font-['DM_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#222526] text-[22px] text-nowrap">
                <p className="leading-[normal] whitespace-pre">Certified Company</p>
              </div>
            </div>

            {/* Image Upload Section */}
            <ImageUploadSection />

            {/* Company Form */}
            <CompanyForm />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-auto lg:flex-shrink-0">
          <PricingSidebar />
        </div>
    </div>
  );
}
