import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function EditCompanyPage() {
  const navigate = useNavigate();

  const handleSaveChanges = () => {
    // TODO: Implement save changes logic
    console.log("Saving company changes...");
    // After successful save, navigate back to account page
    navigate({ to: "/account" });
  };

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <div className="flex justify-center">
        <Card className="bg-white border border-[#e1e1e1] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] rounded-2xl w-full max-w-4xl">
          <CardContent className="p-10">
            <div className="flex gap-10 items-start">
              {/* Company Logo Section */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-64 h-64 bg-gray-900 rounded-lg flex items-center justify-center">
                    <span className="text-white text-6xl font-bold">AP</span>
                  </div>
                  {/* Edit icon overlay */}
                  <div className="absolute bottom-3 right-3 w-12 h-12 bg-white rounded-full border-2 border-[#e1e1e1] flex items-center justify-center cursor-pointer hover:bg-gray-50">
                    <Camera className="w-6 h-6 text-[#222526]" />
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-6">
                {/* Company Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#6f6d66]">
                    Company Name
                  </label>
                  <Input
                    placeholder="Company Name"
                    defaultValue="Audemars Piguet"
                    className="bg-white border border-[#e1e1e1] rounded-full px-6 py-4 h-14"
                  />
                </div>

                {/* Biography Textarea */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#6f6d66]">
                    Biography
                  </label>
                  <Textarea
                    placeholder="Description"
                    defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae est velit. Cras sed tortor iaculis dolor sollicitudin sollicitudin eu eu dolor. Nunc bibendum at sem eget egestas."
                    className="bg-white border border-[#e1e1e1] rounded-2xl px-6 py-4 h-36 resize-none"
                  />
                </div>

                {/* Save Changes Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSaveChanges}
                    className="bg-[#222526] hover:bg-[#1a1a1a] text-white rounded-full px-6 py-3 h-14"
                  >
                    Save changes
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <div className="flex justify-center">
        <div className="bg-[#cde9ec40] border border-[#cde9ec] rounded-2xl w-full max-w-4xl h-48 flex items-center justify-center">
          {/* Tips content can be added here */}
          <p className="text-[#69737c] text-sm">Tips and best practices for company information</p>
        </div>
      </div>
    </div>
  );
}
