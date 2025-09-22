import React from "react";
import { type UseQueryResult } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LedgerBalanceData, Token } from "@/shared";

interface TokenBalanceCardProps {
  token: Token;
  balance: UseQueryResult<LedgerBalanceData, Error>;
  onRefresh?: () => void;
  showUsdValue?: boolean;
  compact?: boolean;
}

export const TokenBalanceCard: React.FC<TokenBalanceCardProps> = ({
  token,
  balance,
  onRefresh,
  showUsdValue = true,
  compact = false,
}) => {
  const formatBalance = (value: number, decimals: number = 4) => {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatUsd = (value: number) => {
    return `$${value.toFixed(4)}`;
  };

  return (
    <Card className={`w-full ${compact ? 'p-3' : 'p-4'}`}>
      <CardHeader className={`pb-2 ${compact ? 'p-0' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#615bff] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {token.name.charAt(0)}
              </span>
            </div>
            <div>
              <CardTitle className={`text-[#222526] ${compact ? 'text-sm' : 'text-base'}`}>
                {token.label}
              </CardTitle>
              <p className="text-[#69737c] text-xs">{token.name}</p>
            </div>
          </div>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={balance.isFetching}
              className="p-1 h-auto"
            >
              <RefreshCw className={`w-4 h-4 ${balance.isFetching ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className={`${compact ? 'p-0 pt-2' : 'pt-0'}`}>
        {balance.isLoading && (
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#69737c]" />
            <span className="text-[#69737c] text-sm">Loading...</span>
          </div>
        )}

        {balance.isError && (
          <div className="text-red-500 text-sm">
            Failed to load balance
            {onRefresh && (
              <Button
                variant="link"
                size="sm"
                onClick={onRefresh}
                className="p-0 h-auto text-red-500 hover:text-red-700 ml-2"
              >
                Retry
              </Button>
            )}
          </div>
        )}

        {balance.isSuccess && balance.data && (
          <div className="space-y-1">
            <div className={`text-[#222526] font-semibold ${compact ? 'text-lg' : 'text-xl'}`}>
              {formatBalance(balance.data.balance)}
              <span className="text-[#69737c] text-sm ml-1">{token.name}</span>
            </div>

            {showUsdValue && balance.data.balance_usd > 0 && (
              <div className="text-[#69737c] text-sm">
                {formatUsd(balance.data.balance_usd)}
              </div>
            )}

            {!compact && balance.data.price_usd > 0 && (
              <div className="text-[#69737c] text-xs">
                1 {token.name} = {formatUsd(balance.data.price_usd)}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
