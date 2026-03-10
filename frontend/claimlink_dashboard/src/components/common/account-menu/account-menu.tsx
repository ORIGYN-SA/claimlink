// AccountMenu.tsx
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { WithdrawDialog } from "./withdraw-dialog/index";
import { AccountHeaderSection } from "./account-header-section";
// import { UserProfileSection } from "./user-profile-section";
import { WalletBalanceSection } from "./wallet-balance-section";
import { LastTransactionSection } from "./last-transaction-section";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNavigate, useRouter } from "@tanstack/react-router";
import {
  useMultiTokenBalance,
  SUPPORTED_TOKENS,
  useFetchAccountTransactions,
  useCopyToClipboard,
} from "@/shared";
import { OGY_LEDGER_INDEX_CANISTER_ID } from "@/shared/constants";

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
  const navigate = useNavigate();
  const router = useRouter();
  const {
    disconnect,
    principalId,
    unauthenticatedAgent,
    isConnected,
  } = useAuth();
  const { copyToClipboard } = useCopyToClipboard();

  // Fetch balances for all supported tokens
  const { balances, refetchAll } = useMultiTokenBalance(
    SUPPORTED_TOKENS,
    unauthenticatedAgent,
    principalId || "",
    {
      enabled: !!principalId && !!unauthenticatedAgent,
      refetchInterval: 30000, // Refresh every 30 seconds
    },
  );

  // Get OGY balance specifically for display
  const ogyBalance = balances.find(({ token }) => token.id === "ogy")?.balance;
  const ogyToken = SUPPORTED_TOKENS.find((token) => token.id === "ogy");

  // Price and decimals are already fetched by useMultiTokenBalance via KongSwap
  const ogyPriceUsd = ogyBalance?.data?.price_usd;
  const ogyDecimals = ogyBalance?.data?.decimals;

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
  const transactionData = txs.data
    ? txs.data.pages.flatMap((page) => page.data)
    : [];

  // Get the most recent transaction
  const lastTransaction = transactionData[0];

  // Total USD value is already computed by useMultiTokenBalance
  const totalUsdValue = ogyBalance?.data?.balance_usd ?? 0;

  const handleSignOut = () => {
    disconnect();
    onOpenChange(false);

    // Invalidate router state and navigate to login
    // This ensures route loaders re-run with updated auth context
    router.invalidate().then(() => {
      navigate({ to: "/login" });
    });
  };

  const handleWithdrawClick = () => {
    setWithdrawDialogOpen(true);
  };

  const handleSeeAllTransactions = () => {
    // Close the account menu
    onOpenChange(false);
    // Navigate to transaction history page
    navigate({ to: "/account/transaction-history" });
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
        className="w-full sm:w-[502px] max-w-[502px] p-0 border-0 h-full"
        style={{
          backgroundColor: "#051936",
        }}
      >
        {/* Accessible title and description for screen readers */}
        <SheetTitle className="sr-only">Account Menu</SheetTitle>
        <SheetDescription className="sr-only">
          View your account balance, transaction history, and manage your wallet
        </SheetDescription>

        <div className="h-full overflow-y-auto">
          {/* Background with blur effect */}
          <div className="min-h-full bg-[#051936]/95 backdrop-blur-xl">
            <div className="flex flex-col h-full p-6 sm:p-8 lg:p-10 gap-6 sm:gap-8">
              {/* Header with close and sign out buttons */}
              <AccountHeaderSection
                onClose={() => onOpenChange(false)}
                onSignOut={handleSignOut}
              />

              {/* User profile section */}
              {/*<UserProfileSection />*/}

              {/* Content sections */}
              <div className="flex flex-col gap-6">
                {/* Wallet Balance Section */}
                <WalletBalanceSection
                  balance={ogyBalance}
                  priceUsd={ogyPriceUsd}
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
                  decimals={ogyDecimals}
                  priceUsd={ogyPriceUsd}
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
        currentBalance={ogyBalance?.data?.balance || 0}
      />
    </Sheet>
  );
}
