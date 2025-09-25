// AccountMenu.tsx
import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { WithdrawDialog } from "./withdraw-dialog";
import { AccountHeaderSection } from "./account-header-section";
import { UserProfileSection } from "./user-profile-section";
import { WalletBalanceSection } from "./wallet-balance-section";
import { LastTransactionSection } from "./last-transaction-section";
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
import type { Transaction } from "@services/ledger-index/utils/interfaces";

interface AccountMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function AccountMenu({
  isOpen,
  onOpenChange,
  trigger,
}: AccountMenuProps) {
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const {
    disconnect,
    principalId,
    authenticatedAgent,
    unauthenticatedAgent,
    isConnected,
  } = useAuth();
  const { copyToClipboard } = useCopyToClipboard();

  // Fetch balances for all supported tokens
  const { balances, summary, refetchAll } = useMultiTokenBalance(
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
  const { data: ogyPriceData, isLoading: ogyPriceLoading } = useFetchTokenPrice(
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

  // Fetch account transactions
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
  console.log("Transactions:", txs);

  // Get the transactions data
  const transactionData = useMemo<Transaction[]>(
    () => (txs.data ? txs.data.pages.flatMap((page) => page.data) : []),
    [txs],
  );

  // Get the most recent transaction
  const lastTransaction = transactionData[0];

  // Calculate total USD value
  const totalUsdValue =
    ogyBalance?.data?.balance && ogyPriceData
      ? ogyBalance.data.balance * ogyPriceData.amount_usd
      : 0;

  const handleSignOut = () => {
    disconnect();
  };

  const handleWithdrawClick = () => {
    setWithdrawDialogOpen(true);
  };

  // TODO: Move these functions to a utils or helpers file
  const handleSeeAllTransactions = () => {
    // Navigate to transactions page or open transactions modal
    console.log("Navigate to all transactions");
  };

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

  const getTransactionTypeColor = (isCredit: boolean) => {
    if (isCredit) {
      return "bg-[#edf8f4] text-[#50be8f]"; // Green for credits
    } else {
      return "bg-[#fef3f2] text-[#f56565]"; // Red for debits
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        side="right"
        className="w-[502px] sm:w-[502px] p-0 border-0 h-full"
        style={{
          backgroundColor: "#051936",
        }}
      >
        {/* Remove the nested relative div and simplify structure */}
        <div className="h-full overflow-y-auto">
          {/* Background with blur effect */}
          <div className="min-h-full bg-[#051936]/95 backdrop-blur-xl">
            <div className="flex flex-col h-full p-10 gap-8">
              {/* Header with refresh and sign out buttons */}
              <AccountHeaderSection
                onRefresh={() => refetchAll()}
                onSignOut={handleSignOut}
                isRefreshing={summary.loadingCount > 0}
              />

              {/* User profile section */}
              <UserProfileSection />

              {/* Content sections */}
              <div className="flex flex-col gap-6">
                {/* Wallet Balance Section */}
                <WalletBalanceSection
                  balance={ogyBalance}
                  priceData={ogyPriceData}
                  priceLoading={ogyPriceLoading}
                  totalUsdValue={totalUsdValue}
                  onRefresh={() => refetchAll()}
                  onWithdrawClick={handleWithdrawClick}
                  principalId={principalId}
                  onCopyPrincipal={() => copyToClipboard(principalId)}
                />

                {/* Last Transaction Section */}
                <LastTransactionSection
                  transactions={{
                    isPending: txs.isPending,
                    isError: txs.isError,
                    refetch: txs.refetch,
                  }}
                  lastTransaction={lastTransaction}
                  decimals={decimals}
                  priceData={ogyPriceData}
                  onSeeAllTransactions={handleSeeAllTransactions}
                  formatTransactionDate={formatTransactionDate}
                  getTransactionTypeLabel={getTransactionTypeLabel}
                  getTransactionTypeColor={getTransactionTypeColor}
                />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>

      {/* Withdraw Dialog */}
      <WithdrawDialog
        isOpen={withdrawDialogOpen}
        onOpenChange={setWithdrawDialogOpen}
      />
    </Sheet>
  );
}
