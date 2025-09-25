import { RefreshCw, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import icon from "@/assets/icon.svg";

interface WalletBalanceSectionProps {
  balance: {
    isLoading: boolean;
    isError: boolean;
    data?: {
      balance: number;
    };
  } | undefined;
  priceData: {
    amount_usd: number;
  } | undefined;
  priceLoading: boolean;
  totalUsdValue: number;
  onRefresh: () => void;
  onWithdrawClick: () => void;
  principalId: string | undefined;
  onCopyPrincipal: () => void;
}

export function WalletBalanceSection({
  balance,
  priceData,
  priceLoading,
  totalUsdValue,
  onRefresh,
  onWithdrawClick,
  principalId,
  onCopyPrincipal,
}: WalletBalanceSectionProps) {
  return (
    <div className="flex flex-col rounded-[20px] overflow-hidden">
      <div className="bg-[#fcfafa] border border-[#e1e1e1] border-b-0 px-6 py-3">
        <h3 className="text-[#69737c] text-base font-medium text-center">
          Wallet Balance
        </h3>
      </div>
      <div className="bg-white border-x border-b border-[#e1e1e1] px-5 py-6">
        <div className="flex flex-col items-center gap-6">
          {/* Balance */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <img src={icon} alt="logo" />
              {balance?.isLoading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#69737c]" />
                  <span className="text-[#69737c] text-lg">Loading...</span>
                </div>
              ) : balance?.isError ? (
                <div className="flex items-center gap-2">
                  <span className="text-red-500 text-lg">Error</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRefresh}
                    className="p-1 h-auto"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-[#222526] text-3xl font-semibold">
                    {balance?.data?.balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || "0.00"}
                  </span>
                  <span className="text-[#69737c] text-lg font-normal tracking-[1px] ml-1">
                    OGY
                  </span>
                </>
              )}
            </div>
            <p className="text-[#69737c] text-sm tracking-[0.8px]">
              {priceLoading ? (
                <span className="font-medium flex items-center justify-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Loading...
                </span>
              ) : priceData ? (
                <span className="font-medium">(${totalUsdValue.toFixed(2)})</span>
              ) : (
                <span className="font-medium">Price unavailable</span>
              )}
            </p>
          </div>

          {/* Principal ID */}
          <div className="bg-[#fcfafa] border border-[#e8e8e8] rounded-full px-4 py-2.5 flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-[#222526] text-xs font-bold">IC</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#69737c] rounded-full flex items-center justify-center">
                  <span className="text-white text-[8px]">C</span>
                </div>
              </div>
              <div className="text-xs">
                <span className="text-[#69737c] font-normal">Principal ID: </span>
                <span className="text-[#222526] font-semibold">
                  {principalId || "55vo5-45mf9-...1234d-erpra"}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCopyPrincipal}
              className="w-6 h-6 p-0 text-[#69737c] hover:text-[#222526] hover:bg-transparent"
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Withdraw button */}
          <Button
            onClick={onWithdrawClick}
            className="bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full px-6 py-2.5 w-full text-sm font-medium"
          >
            Withdraw
          </Button>

          <button className="text-[#69737c] text-xs hover:text-[#222526] transition-colors">
            How to top up?
          </button>
        </div>
      </div>
      <div className="bg-[#fcfafa] border-x border-b border-[#e1e1e1] px-4 py-3">
        <p className="text-[#69737c] text-xs text-center">
          <span className="font-normal">Current rate:</span>{" "}
          {priceLoading ? (
            <span className="font-medium flex items-center justify-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" /> Loading...
            </span>
          ) : priceData ? (
            <span className="font-medium">
              1 OGY = {priceData.amount_usd.toFixed(5)} USD
            </span>
          ) : (
            <span className="font-medium">Price unavailable</span>
          )}
        </p>
      </div>
    </div>
  );
}
