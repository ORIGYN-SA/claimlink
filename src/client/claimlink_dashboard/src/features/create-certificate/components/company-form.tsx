import { Card } from "@/components/ui/card";
import { FormField } from "./form-field";
import { ImageUpload } from "./image-upload";

export function CompanyForm() {
  return (
    <div className="space-y-8">
      {/* Certified Company Section */}
      <Card className="bg-white border-[#e1e1e1] rounded-[25px] p-[24px] space-y-8">
        <div className="space-y-2">
          <h2 className="text-[22px] font-semibold text-[#222526] leading-[100]">
            Certified Company
          </h2>
        </div>

        {/* Image Upload Section */}
        <ImageUpload />

        {/* Form Fields Grid */}
        <div className="space-y-6">
          {/* Row 1: Company Name & Registered Office */}
          <div className="grid grid-cols-2 gap-[16px]">
            <FormField
              label="Company Name"
              placeholder="Enter company name"
            />
            <FormField
              label="Registered Office"
              placeholder="Enter registered office"
            />
          </div>

          {/* Row 2: Operational HQ & Other Operating Officers */}
          <div className="grid grid-cols-2 gap-[16px]">
            <FormField
              label="Operational HQ & Factory"
              placeholder="Enter operational HQ"
            />
            <FormField
              label="Other Operating Officers"
              placeholder="Enter operating officers"
            />
          </div>

          {/* Row 3: Phone Numbers & Email */}
          <div className="grid grid-cols-2 gap-[16px]">
            <FormField
              label="Phone Numbers"
              placeholder="Enter phone numbers"
              type="tel"
            />
            <FormField
              label="Email"
              placeholder="Enter email address"
              type="email"
            />
          </div>

          {/* Row 4: Website & Social Media */}
          <div className="grid grid-cols-2 gap-[16px]">
            <FormField
              label="Website"
              placeholder="Enter website URL"
              type="url"
            />
            <FormField
              label="Social Media"
              placeholder="Enter social media links"
            />
          </div>

          {/* Row 5: ATECO Code & VAT Number */}
          <div className="grid grid-cols-2 gap-[16px]">
            <FormField
              label="ATECO Code"
              placeholder="Enter ATECO code"
            />
            <FormField
              label="VAT Number"
              placeholder="Enter VAT number"
            />
          </div>

          {/* Row 6: Fiscal Code & Chamber of Commerce Registration */}
          <div className="grid grid-cols-2 gap-[16px]">
            <FormField
              label="Fiscal Code"
              placeholder="Enter fiscal code"
            />
            <FormField
              label="Chamber of Commerce Registration"
              placeholder="Enter registration number"
            />
          </div>

          {/* Row 7: Description of Activities & Registration Date */}
          <div className="grid grid-cols-2 gap-[16px]">
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-[#69737c] leading-[100]">
                Description of Activities Carried out by the Company
              </label>
              <textarea
                className="w-full h-[44px] px-[16px] py-3 rounded-[100px] border border-[#e1e1e1] bg-white text-[14px] placeholder:text-[#69737c] resize-none"
                placeholder="Enter company activities description"
                rows={1}
              />
            </div>
            <FormField
              label="Registration Date"
              placeholder="dd/mm/yyyy"
              type="date"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
