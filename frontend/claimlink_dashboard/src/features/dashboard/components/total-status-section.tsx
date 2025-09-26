import React from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "./stat-card";
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
        <div className="flex gap-4 items-start justify-start shadow-[0_3px_4px_0_rgba(0,0,0,0.05)] w-full">
          <StatCard
            title="Minted Certificates"
            value={statusData.minted.value}
            trend={statusData.minted.trend}
            trendColor={statusData.minted.trendColor}
            icon={<ScrollText className="w-4 h-4" />}
            className="flex-1"
          />
          <StatCard
            title="Awaiting Certificates"
            value={statusData.awaiting.value}
            trend={statusData.awaiting.trend}
            trendColor={statusData.awaiting.trendColor}
            icon={<Hourglass className="w-4 h-4" />}
            className="flex-1"
          />
          <StatCard
            title="Certificate in my wallet"
            value={statusData.wallet.value}
            trend={statusData.wallet.trend}
            trendColor={statusData.wallet.trendColor}
            icon={<Wallet className="w-4 h-4" />}
            className="flex-1"
          />
          <StatCard
            title="Transferred Certificates"
            value={statusData.transferred.value}
            trend={statusData.transferred.trend}
            trendColor={statusData.transferred.trendColor}
            icon={<ArrowLeftRight className="w-4 h-4" />}
            className="flex-1"
          />
        </div>
      </Card>
    </div>
  );
};
