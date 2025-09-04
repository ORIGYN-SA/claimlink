import { Input } from "@/components/ui/input";
import { FormField } from "./form-field";
// import { Calendar } from "lucide-react";

export function CompanyForm() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Row 1: Company Name & Registered Office */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <FormField 
          label="Company Name" 
          placeholder="Enter company name" 
        />
        <FormField 
          label="Registered Office" 
          placeholder="Enter registered office" 
        />
      </div>

      {/* Row 2: Operational HQ & Other Officers */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <FormField 
          label="Operational HQ & Factory" 
          placeholder="Enter operational HQ" 
        />
        <FormField 
          label="Other Operating Officers" 
          placeholder="Enter other officers" 
        />
      </div>

      {/* Row 3: Phone Numbers & Email */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <FormField 
          label="Phone Numbers" 
          placeholder="Enter phone numbers" 
        />
        <FormField 
          label="Email" 
          placeholder="Enter email address" 
          type="email"
        />
      </div>

      {/* Row 4: Website & Social Media */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <FormField 
          label="Website" 
          placeholder="Enter website URL" 
          type="url"
        />
        <FormField 
          label="Social Media" 
          placeholder="Enter social media" 
        />
      </div>

      {/* Row 5: ATECO Code & VAT Number */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <FormField 
          label="ATECO Code" 
          placeholder="Enter ATECO code" 
        />
        <FormField 
          label="VAT Number" 
          placeholder="Enter VAT number" 
        />
      </div>

      {/* Row 6: Fiscal Code & Chamber Registration */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <FormField 
          label="Fiscal Code" 
          placeholder="Enter fiscal code" 
        />
        <FormField 
          label="Chamber of Commerce Registration" 
          placeholder="Enter registration number" 
        />
      </div>

      {/* Row 7: Description & Registration Date */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <FormField 
          label="Description of Activities Carried out by the Company" 
          placeholder="Enter description" 
        />
        <DateField />
      </div>
    </div>
  );
}

// DateField component for the registration date
function DateField() {
  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0">
      <label className="text-[13px] font-medium text-[#69737c]">
        Registration Date
      </label>
      <div className="relative">
        <Input
          type="date"
          placeholder="dd/mm/yyyy"
          className="bg-white px-6 py-2.5 rounded-[100px] border border-[#e1e1e1] h-auto text-[16px] placeholder:text-[#69737c] w-full"
        />
      </div>
    </div>
  );
}