import { ArrowLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CompanyForm } from "./company-form";
import { PricingSidebar } from "./pricing-sidebar";

export function CreateCertificatePage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate({ to: '/mint_certificate' });
  };

  return (
    <div className="flex justify-center px-4 py-6">
        <Card className="w-full max-w-[1158px] bg-[#fcfafa] border-0 shadow-none">
          <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 text-[#222526] hover:bg-[#f0f0f0]"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <h1 className="text-[24px] font-medium text-[#222526] leading-[32px]">
                    Create Certificate
                  </h1>
                </div>
                <p className="text-[16px] font-light text-[#69737c] leading-[32px]">
                  Create collections to assign certificates
                </p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4">
              {/* Left Column - Company Form */}
              <div className="space-y-4">
                {/* Collection Section */}
                <Card className="bg-white border-[#efece3] rounded-[25px] p-5">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-[22px] font-semibold text-[#222526] leading-[100]">
                        Collection
                      </h2>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[13px] font-medium text-[#6f6d66] leading-[100]">
                        Collection
                      </label>
                      <button className="box-border cursor-pointer flex flex-col items-start justify-start overflow-visible p-0 relative rounded-[100px] shrink-0 w-full">
                        <div className="bg-white box-border content-stretch flex items-center justify-between p-[16px] relative rounded-[100px] shrink-0 w-full">
                          <div className="absolute border border-[#e1e1e1] border-solid inset-0 pointer-events-none rounded-[100px]" />
                          <div className="font-['DM_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#222526] text-[14px] text-nowrap">
                            <p className="leading-[normal] whitespace-pre">Collection 1</p>
                          </div>
                          <div className="relative shrink-0 size-2">
                            <div className="absolute contents inset-0">
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 5.33333L1.33333 2.66667H6.66667L4 5.33333Z" fill="#69737C"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[13px] font-medium text-[#6f6d66] leading-[100]">
                        Template
                      </label>
                      <button className="box-border cursor-pointer flex flex-col items-start justify-start overflow-visible p-0 relative rounded-[100px] shrink-0 w-full">
                        <div className="bg-white box-border content-stretch flex items-center justify-between p-[16px] relative rounded-[100px] shrink-0 w-full">
                          <div className="absolute border border-[#e1e1e1] border-solid inset-0 pointer-events-none rounded-[100px]" />
                          <div className="font-['DM_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#222526] text-[14px] text-nowrap">
                            <p className="leading-[normal] whitespace-pre">Template 52</p>
                          </div>
                          <div className="relative shrink-0 size-2">
                            <div className="absolute contents inset-0">
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 5.33333L1.33333 2.66667H6.66667L4 5.33333Z" fill="#69737C"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </Card>

                {/* Company Form */}
                <CompanyForm />
              </div>

              {/* Right Column - Pricing Sidebar */}
              <div className="lg:sticky lg:top-0">
                <PricingSidebar />
              </div>
            </div>
          </div>
        </Card>
      </div>
  );
}
