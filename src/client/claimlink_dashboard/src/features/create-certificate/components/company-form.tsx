import { FormField } from "./form-field";

export function CompanyForm() {
  return (
    <div className="content-stretch flex flex-col gap-6 items-center justify-center relative w-full">
      {/* Row 1: Company Name & Registered Office */}
      <div className="content-stretch flex gap-4 items-center justify-center relative w-full">
        <FormField label="Company Name" placeholder="Enter company name" />
        <FormField label="Registered Office" placeholder="Enter registered office" />
      </div>

      {/* Row 2: Operational HQ & Other Officers */}
      <div className="content-stretch flex gap-4 items-center justify-center relative w-full">
        <FormField label="Operational HQ & Factory" placeholder="Enter operational HQ" />
        <FormField label="Other Operating Officers" placeholder="Enter other officers" />
      </div>

      {/* Row 3: Phone Numbers & Email */}
      <div className="content-stretch flex gap-4 items-center justify-center relative w-full">
        <FormField label="Phone Numbers" placeholder="Enter phone numbers" />
        <FormField label="Email" placeholder="Enter email address" />
      </div>

      {/* Row 4: Website & Social Media */}
      <div className="content-stretch flex gap-4 items-center justify-center relative w-full">
        <FormField label="Website" placeholder="Enter website URL" />
        <FormField label="Social Media" placeholder="Enter social media" />
      </div>

      {/* Row 5: ATECO Code & VAT Number */}
      <div className="content-stretch flex gap-4 items-center justify-center relative w-full">
        <FormField label="ATECO Code" placeholder="Enter ATECO code" />
        <FormField label="VAT Number" placeholder="Enter VAT number" />
      </div>

      {/* Row 6: Fiscal Code & Chamber Registration */}
      <div className="content-stretch flex gap-4 items-center justify-center relative w-full">
        <FormField label="Fiscal Code" placeholder="Enter fiscal code" />
        <FormField label="Chamber of Commerce Registration" placeholder="Enter registration number" />
      </div>

      {/* Row 7: Description & Registration Date */}
      <div className="content-stretch flex gap-4 items-center justify-center relative w-full">
        <FormField label="Description of Activities Carried out by the Company" placeholder="Enter description" />
        <div className="basis-0 content-stretch flex flex-col gap-2 grow items-center justify-center min-h-px min-w-px relative shrink-0">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative w-full">
            <div className="box-border content-stretch flex flex-col gap-2 items-start justify-center ml-[2.221px] mt-0 relative w-[313.559px]">
              <div className="font-['DM_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#69737c] text-[13px] text-nowrap">
                <p className="leading-[normal] whitespace-pre">Registration Date</p>
              </div>
            </div>
            <div className="bg-white box-border content-stretch flex gap-[30px] items-center justify-start ml-0 mt-[26px] px-6 py-2.5 relative rounded-[100px] w-[318px] border border-[#e1e1e1]">
              <div className="font-['Satoshi:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#69737c] text-[16px] text-nowrap">
                <p className="leading-[25px] whitespace-pre">dd/mm/yyyy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}