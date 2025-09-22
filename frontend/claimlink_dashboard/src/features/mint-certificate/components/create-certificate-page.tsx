import { CollectionSection } from "./collection-section";
import { ImageUploadSection } from "./image-upload-section";
import { CompanyForm } from "./company-form";
import { PricingSidebar } from "./pricing-sidebar";

export function CreateCertificatePage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Main Form Section */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-4">
            {/* Collection Section */}
            <CollectionSection />

            {/* Certified Company Section */}
            <div className="bg-white box-border flex flex-col gap-8 items-center justify-center px-5 py-6 rounded-[25px] w-full border border-[#e1e1e1]">
              {/* Title */}
              <div className="w-full">
                <h2 className="font-sans font-semibold text-[#222526] text-[22px]">
                  Certified Company
                </h2>
              </div>

              {/* Image Upload Section */}
              <ImageUploadSection />

              {/* Company Form */}
              <CompanyForm />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[350px] flex-shrink-0">
          <PricingSidebar />
        </div>
      </div>
    </div>
  );
}
