import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit } from "lucide-react";

interface CompanyRecapCardProps {
  companyName: string;
  companyInitials: string;
  description: string;
  logoUrl?: string;
  isVerified?: boolean;
  onEditClick: () => void;
}

export function CompanyRecapCard({
  companyName,
  companyInitials,
  description,
  logoUrl,
  isVerified = false,
  onEditClick
}: CompanyRecapCardProps) {
  return (
    <Card className="bg-white border border-[#e1e1e1] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)] rounded-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-6">
          {/* Company Logo */}
          <div className="w-36 h-36 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={companyName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-2xl font-bold">{companyInitials}</span>
            )}
          </div>

          {/* Company Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-medium text-[#222526]">{companyName}</h2>
              {/* Verified badge */}
              {isVerified && (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <p className="text-base text-[#69737c] leading-relaxed max-w-2xl line-clamp-2 overflow-hidden">
              {description}
            </p>
          </div>

          {/* Edit Button */}
          <Button
            onClick={onEditClick}
            variant="outline"
            className="bg-white border border-[#e1e1e1] hover:bg-gray-50 text-[#222526] rounded-2xl px-4 py-2 h-auto"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit biography
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

