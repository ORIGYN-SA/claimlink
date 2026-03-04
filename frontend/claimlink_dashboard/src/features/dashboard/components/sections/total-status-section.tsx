import React from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "../cards";
import { Wallet, ScrollText, Hourglass, ArrowLeftRight } from "lucide-react";


interface StatusData {
  minted: {
    value: string;
    trend: string;
    trendColor: "green" | "red";
  };
  awaiting: {
    value: string;
    trend: string;
    trendColor: "green" | "red";
  };
  wallet: {
    value: string;
    trend: string;
    trendColor: "green" | "red";
  };
  transferred: {
    value: string;
    trend: string;
    trendColor: "green" | "red";
  };
}

interface TotalStatusSectionProps {
  statusData: StatusData;
  className?: string;
}

export const TotalStatusSection: React.FC<TotalStatusSectionProps> = ({
  statusData,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      <Card className="bg-white border border-[#f2f2f2] rounded-2xl shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] p-4 w-full">
        <div className="font-sans font-medium text-black text-sm leading-4 mb-4">
          Total certificate status
        </div>
        {/* Mobile: 2 cols, Desktop: 4 cols */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatCard
            title="Minted Certificates"
            value={statusData.minted.value}
            trend={statusData.minted.trend}
            trendColor={statusData.minted.trendColor}
            icon={<ScrollText className="w-4 h-4" />}
            tooltip="Total number of certificates successfully minted on-chain with your account."
          />
          <StatCard
            title="Awaiting Certificates"
            value={statusData.awaiting.value}
            trend={statusData.awaiting.trend}
            trendColor={statusData.awaiting.trendColor}
            icon={<Hourglass className="w-4 h-4" />}
            tooltip="Certificates that have been created but not yet minted. Review and finalize them before they appear on-chain."
          />
          <StatCard
            title="Certificate in my wallet"
            value={statusData.wallet.value}
            trend={statusData.wallet.trend}
            trendColor={statusData.wallet.trendColor}
            icon={<Wallet className="w-4 h-4" />}
            tooltip="All certificates held in your wallet address, both newly minted and previously received items."
          />
          <StatCard
            title="Transferred Certificates"
            value={statusData.transferred.value}
            trend={statusData.transferred.trend}
            trendColor={statusData.transferred.trendColor}
            icon={<ArrowLeftRight className="w-4 h-4" />}
            tooltip="Certificates that have been successfully transferred to another wallet or owner address."
          />
        </div>
      </Card>
    </div>
  );
};
