import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PortfolioSummaryProps {
  totalValue: number;
  loadingCount: number;
  errorCount: number;
  successCount: number;
  onRefresh?: () => void;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  totalValue,
  loadingCount,
  errorCount,
  successCount,
  onRefresh,
}) => {
  const formatUsd = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#222526] text-lg">
            Portfolio Summary
          </CardTitle>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={loadingCount > 0}
              className="p-1 h-auto"
            >
              <RefreshCw className={`w-4 h-4 ${loadingCount > 0 ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Total Value */}
          <div className="text-center">
            <div className="text-[#69737c] text-sm mb-1">Total Value</div>
            <div className="text-[#222526] text-2xl font-bold">
              {totalValue > 0 ? formatUsd(totalValue) : "—"}
            </div>
          </div>

          {/* Status Summary */}
          <div className="flex justify-center gap-4 text-xs">
            {successCount > 0 && (
              <div className="text-green-600">
                ✓ {successCount} loaded
              </div>
            )}
            {loadingCount > 0 && (
              <div className="text-[#69737c] flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                {loadingCount} loading
              </div>
            )}
            {errorCount > 0 && (
              <div className="text-red-500">
                ⚠ {errorCount} failed
              </div>
            )}
          </div>

          {/* Status Message */}
          {totalValue === 0 && loadingCount === 0 && errorCount === 0 && (
            <div className="text-center text-[#69737c] text-sm">
              No balances available
            </div>
          )}

          {loadingCount > 0 && (
            <div className="text-center text-[#69737c] text-sm">
              Loading balances...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
