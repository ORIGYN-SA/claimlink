import { useMemo } from "react";
import { TransactionHistory } from "./transaction-history";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  useMultiTokenBalance,
  SUPPORTED_TOKENS,
  useFetchTokenPrice,
  useFetchAccountTransactions,
  useCopyToClipboard,
  useFetchLedgerDecimals,
} from "@/shared";
import { OGY_LEDGER_INDEX_CANISTER_ID } from "@/shared/constants";
import type { DisplayTransaction } from "../types/transaction-history.types";

export function TransactionHistoryPage() {
  const {
    principalId,
    authenticatedAgent,
    unauthenticatedAgent,
    isConnected,
  } = useAuth();
  const { copyToClipboard } = useCopyToClipboard();

  // Fetch balances for all supported tokens
  const { balances } = useMultiTokenBalance(
    SUPPORTED_TOKENS,
    authenticatedAgent,
    principalId || "",
    {
      enabled: !!principalId && !!authenticatedAgent,
      refetchInterval: 30000, // Refresh every 30 seconds
    },
  );

  // Get OGY balance specifically for display
  const ogyBalance = balances.find(({ token }) => token.id === "ogy")?.balance;
  const ogyToken = SUPPORTED_TOKENS.find((token) => token.id === "ogy");

  // Fetch real-time OGY token price
  const { data: ogyPriceData } = useFetchTokenPrice(
    authenticatedAgent,
    {
      from: "OGY",
      from_canister_id: ogyToken?.canister_id || "",
      amount: 1n * BigInt(10 ** 8), // 1 OGY in e8s format
      enabled: !!authenticatedAgent && !!ogyToken,
      refetchInterval: 60000, // Refresh price every minute
    },
  );

  // Fetch OGY token decimals for proper amount formatting
  const decimals = useFetchLedgerDecimals(
    ogyToken?.canister_id || "",
    unauthenticatedAgent,
    {
      ledger: ogyToken?.name || "OGY",
      enabled: !!unauthenticatedAgent && !!ogyToken,
    },
  );

  // Fetch transaction history for OGY token
  const txs = useFetchAccountTransactions(
    OGY_LEDGER_INDEX_CANISTER_ID,
    unauthenticatedAgent,
    {
      account: principalId,
      enabled: !!unauthenticatedAgent && isConnected,
      ledger: ogyToken?.name || "OGY",
    },
  );

  // Get the transactions data
  const transactionData = useMemo(() =>
    (txs.data ? txs.data.pages.flatMap((page) => page.data) : []),
    [txs],
  );

  // Format transactions for display in TransactionHistory component
  const formattedTransactions: DisplayTransaction[] = useMemo(() => {
    return transactionData.map((transaction) => ({
      ...transaction,
      displayCategory: getTransactionTypeLabel(transaction.kind),
      displayDate: formatTransactionDate(transaction.timestamp),
      formattedAmount: decimals.isSuccess && transaction.amount && decimals.data
        ? new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(Number(transaction.amount) / Math.pow(10, decimals.data))
        : "0.00",
      formattedAmountUSD: ogyPriceData && transaction.amount && decimals.isSuccess && decimals.data
        ? `($${(
            (Number(transaction.amount) / 10 ** decimals.data) *
            ogyPriceData.amount_usd
          ).toFixed(2)})`
        : undefined,
    }));
  }, [transactionData, decimals, ogyPriceData]);

  // Calculate total USD value
  const totalUsdValue =
    ogyBalance?.data?.balance && ogyPriceData
      ? ogyBalance.data.balance * ogyPriceData.amount_usd
      : 0;

  const handleCopyTransactionId = (id: string) => {
    copyToClipboard(id);
  };

  const handleCopyAccountId = (id: string) => {
    copyToClipboard(id);
  };

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality
    console.log('Search query:', query);
  };

  const handleDateFilter = (dateRange: { start: Date | undefined; end: Date | undefined }) => {
    // TODO: Implement date filtering
    console.log('Date range:', dateRange);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export requested');
  };

  const handlePageChange = (page: number) => {
    // TODO: Implement pagination
    console.log('Page change:', page);
  };

  const handleItemsPerPageChange = (items: number) => {
    // TODO: Implement items per page change
    console.log('Items per page:', items);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#222526] mb-2">
          Transaction History
        </h1>
        <p className="text-[#69737c] text-base leading-8">
          View and manage your transaction history
        </p>
      </div>

      <TransactionHistory
        accountOverview={{
          accountId: principalId || '',
          balance: ogyBalance?.data?.balance || 0,
          balanceInUSD: totalUsdValue,
          currency: 'OGY',
        }}
        transactions={formattedTransactions}
        isLoading={txs.isPending}
        onCopyTransactionId={handleCopyTransactionId}
        onCopyAccountId={handleCopyAccountId}
        onSearch={handleSearch}
        onDateFilter={handleDateFilter}
        onExport={handleExport}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        currentPage={1}
        totalPages={1}
        itemsPerPage={formattedTransactions.length}
        totalItems={formattedTransactions.length}
      />
    </div>
  );
}

// Helper functions (duplicated from account menu - could be moved to utils)
const formatTransactionDate = (timestamp: string) => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return timestamp;
  }
};

const getTransactionTypeLabel = (kind: string) => {
  switch (kind.toLowerCase()) {
    case "transfer":
      return "Transfer";
    case "mint":
      return "Mint";
    case "burn":
      return "Burn";
    case "approve":
      return "Approve";
    default:
      return kind;
  }
};
