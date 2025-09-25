import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import icon from "@/assets/icon.svg";
import E8sToLocaleString from "@shared/utils/numbers/E8sToLocaleString";
import type { Transaction } from "@services/ledger-index/utils/interfaces";

interface LastTransactionSectionProps {
  transactions: {
    isPending: boolean;
    isError: boolean;
    refetch: () => void;
  };
  lastTransaction: Transaction | undefined;
  decimals: {
    isSuccess: boolean;
    data?: number;
  };
  priceData: {
    amount_usd: number;
  } | undefined;
  onSeeAllTransactions: () => void;
  formatTransactionDate: (timestamp: string) => string;
  getTransactionTypeLabel: (kind: string) => string;
  getTransactionTypeColor: (isCredit: boolean) => string;
}

export function LastTransactionSection({
  transactions,
  lastTransaction,
  decimals,
  priceData,
  onSeeAllTransactions,
  formatTransactionDate,
  getTransactionTypeLabel,
  getTransactionTypeColor,
}: LastTransactionSectionProps) {
  return (
    <div className="flex flex-col rounded-[20px] overflow-hidden">
      <div className="bg-[#fcfafa] border border-[#e1e1e1] border-b-0 px-6 py-3">
        <h3 className="text-[#69737c] text-sm font-medium">Last transaction</h3>
      </div>
      <div className="bg-white border-x border-b border-[#e1e1e1] px-5 py-4">
        {transactions.isPending ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-5 h-5 animate-spin text-[#69737c] mr-2" />
            <span className="text-[#69737c] text-sm">Loading transactions...</span>
          </div>
        ) : transactions.isError ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <span className="text-red-500 text-sm">Error loading transactions</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={transactions.refetch}
              className="p-1 h-auto text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          </div>
        ) : !lastTransaction ? (
          <div className="flex items-center justify-center py-8">
            <span className="text-[#69737c] text-sm">No transactions found</span>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col gap-2">
                <div>
                  <h4 className="text-[#222526] text-sm font-semibold">
                    {getTransactionTypeLabel(lastTransaction.kind)}
                  </h4>
                  <p className="text-[#69737c] text-xs">
                    {formatTransactionDate(lastTransaction.timestamp)}
                  </p>
                </div>
                <div
                  className={`px-2 py-0.5 rounded-full w-fit ${getTransactionTypeColor(
                    lastTransaction.is_credit
                  )}`}
                >
                  <span className="text-[10px] font-medium tracking-[0.5px] uppercase">
                    {lastTransaction.is_credit ? "Credit" : "Debit"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-0.5">
                  <div className="w-3.5 h-3.5rounded-full flex items-center justify-center">
                    <img src={icon} alt="logo" />
                  </div>
                  <span className="text-[#222526] text-sm font-semibold">
                    {lastTransaction.is_credit ? "+" : "-"}
                    {decimals.isSuccess && lastTransaction.amount && decimals.data ? (
                      <E8sToLocaleString
                        value={lastTransaction.amount}
                        tokenDecimals={decimals.data}
                      />
                    ) : (
                      "0.00"
                    )}{" "}
                    OGY
                  </span>
                </div>
                <p className="text-[#69737c] text-xs">
                  {priceData && lastTransaction.amount && decimals.isSuccess && decimals.data
                    ? `($${(
                        (Number(lastTransaction.amount) / 10 ** decimals.data) *
                        priceData.amount_usd
                      ).toFixed(2)})`
                    : "($-.--)"}    
                </p>
              </div>
            </div>

            <Button
              onClick={onSeeAllTransactions}
              className="bg-[#222526] text-white hover:bg-[#222526]/90 rounded-full px-6 py-2.5 w-full text-sm font-medium"
            >
              See all transactions
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
