import React from "react";
import { type UseQueryResult } from "@tanstack/react-query";
import { TokenBalanceCard } from "./token-balance-card";
import { PortfolioSummary } from "./portfolio-summary";
import type { LedgerBalanceData, Token } from "@/shared";

interface BalanceGridProps {
  balances: Array<{
    token: Token;
    balance: UseQueryResult<LedgerBalanceData, Error>;
  }>;
  onRefreshAll?: () => void;
  showPortfolioSummary?: boolean;
  compact?: boolean;
  columns?: number;
}

export const BalanceGrid: React.FC<BalanceGridProps> = ({
  balances,
  onRefreshAll,
  showPortfolioSummary = true,
  compact = false,
  columns = 2,
}) => {
  // Calculate portfolio summary
  const totalValue = balances
    .filter(({ balance }) => balance.isSuccess)
    .reduce((sum, { balance }) => sum + (balance.data?.balance_usd || 0), 0);

  const loadingCount = balances.filter(({ balance }) => balance.isLoading).length;
  const errorCount = balances.filter(({ balance }) => balance.isError).length;
  const successCount = balances.filter(({ balance }) => balance.isSuccess).length;

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      {showPortfolioSummary && (
        <PortfolioSummary
          totalValue={totalValue}
          loadingCount={loadingCount}
          errorCount={errorCount}
          successCount={successCount}
          onRefresh={onRefreshAll}
        />
      )}

      {/* Token Balances Grid */}
      <div className={`grid gap-4 ${gridCols[columns as keyof typeof gridCols] || gridCols[2]}`}>
        {balances.map(({ token, balance }) => (
          <TokenBalanceCard
            key={token.id}
            token={token}
            balance={balance}
            onRefresh={() => balance.refetch()}
            compact={compact}
          />
        ))}
      </div>

      {/* Empty State */}
      {balances.length === 0 && (
        <div className="text-center py-8 text-[#69737c]">
          No tokens configured
        </div>
      )}
    </div>
  );
};
