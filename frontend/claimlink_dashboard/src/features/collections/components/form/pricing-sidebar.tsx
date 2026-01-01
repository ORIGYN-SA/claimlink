import { Card, CardContent } from '@/components/ui/card';
import { FileText, HardDrive } from 'lucide-react';

interface PricingInfo {
  deploymentCost: {
    amount: string;
    usd: string;
  };
  certificateCost: {
    amount: string;
    usd: string;
  };
}

interface StorageInfo {
  amount: string;
  description: string;
}

interface PricingSidebarProps {
  pricing: PricingInfo;
  storage: StorageInfo;
  description?: string;
}

export function PricingSidebar({
  pricing,
  storage,
  description = "Vestibulum eu purus eu orci commodo elementum et et lorem. Curabitur pharetra velit ut facilisis ultrices."
}: PricingSidebarProps) {
  return (
    <div className="w-[400px] flex-shrink-0">
      <Card className="border-[#e1e1e1] bg-white rounded-[25px]">
        <CardContent className="p-6 space-y-6">
          {/* General Information */}
          <div className="space-y-2">
            <h3 className="text-[#222526] font-medium text-lg">General information</h3>
            <p className="text-[#69737c] text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Separator */}
          <hr className="border-[#e1e1e1]" />

          {/* Price Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#222526]" />
              <span className="text-[#222526] font-medium text-sm uppercase tracking-wider">Price</span>
            </div>

            {/* Deployment Cost */}
            <div className="bg-[#cddfec26] rounded-xl p-4 space-y-2">
              <p className="text-[#69737c] font-medium text-sm">Deployment cost:</p>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#615bff] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">O</span>
                </div>
                <span className="text-[#222526] font-semibold text-lg">{pricing.deploymentCost.amount}</span>
                <span className="text-[#69737c] text-sm">({pricing.deploymentCost.usd})</span>
              </div>
            </div>

            {/* Certificate Cost */}
            <div className="bg-[#cddfec26] rounded-xl p-4 space-y-2">
              <p className="text-[#69737c] font-medium text-sm">Certificate cost:</p>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 bg-[#615bff] rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs font-bold">O</span>
                </div>
                <div>
                  <p className="text-[#222526] font-semibold text-lg">{pricing.certificateCost.amount}</p>
                  <p className="text-[#69737c] text-sm">({pricing.certificateCost.usd})</p>
                </div>
              </div>
            </div>

            <p className="text-[#69737c] text-sm leading-relaxed">
              When you deploy your collection, you will need to pay {pricing.deploymentCost.amount} as fees. 
              Each certificate will also cost you {pricing.certificateCost.amount}.
            </p>
          </div>

          {/* Separator */}
          <hr className="border-[#e1e1e1]" />

          {/* Storage Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#222526]" />
              <span className="text-[#222526] font-medium text-sm uppercase tracking-wider">Storage</span>
            </div>

            <div className="space-y-2">
              <p className="text-[#69737c] font-medium text-sm">Storage included in your collection</p>
              <p className="text-[#222526] font-semibold text-lg">{storage.amount}</p>
            </div>

            <p className="text-[#69737c] text-sm leading-relaxed">
              {storage.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

