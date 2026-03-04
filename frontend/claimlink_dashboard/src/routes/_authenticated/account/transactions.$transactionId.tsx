import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout";
import { TransactionDetailPage } from "@/features/account";
import { useCopyToClipboard } from "@/shared";
import type { DisplayTransaction } from "@/features/account";

interface TransactionData {
  transaction: DisplayTransaction;
  accountId?: string;
  balance?: number;
  currency?: string;
}

export const Route = createFileRoute(
  "/_authenticated/account/transactions/$transactionId"
)({
  component: TransactionDetailRoute,
});

function TransactionDetailRoute() {
  const navigate = useNavigate();
  const { transactionId } = Route.useParams();
  const { copyToClipboard } = useCopyToClipboard();
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Only load once, even if effect runs multiple times (React Strict Mode)
    if (hasLoadedRef.current) {
      return;
    }

    // Retrieve transaction data from sessionStorage
    const storedData = sessionStorage.getItem(`transaction-${transactionId}`);

    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);

        // Convert string values back to BigInt
        if (parsed.transaction) {
          parsed.transaction.amount = parsed.transaction.amount
            ? BigInt(parsed.transaction.amount)
            : undefined;
          parsed.transaction.fee = parsed.transaction.fee
            ? BigInt(parsed.transaction.fee)
            : undefined;
        }

        setTransactionData(parsed);
        hasLoadedRef.current = true;

        // Clean up sessionStorage after successful load
        sessionStorage.removeItem(`transaction-${transactionId}`);
      } catch (error) {
        console.error("Failed to parse transaction data:", error);
        navigate({ to: "/account/transaction-history" });
      }
    } else {
      // If no data found, redirect back to transaction history
      navigate({ to: "/account/transaction-history" });
    }
  }, [transactionId, navigate]);

  const handleCopyTransactionId = (id: string) => {
    copyToClipboard(id);
  };

  const handleCopyAccountId = (id: string) => {
    copyToClipboard(id);
  };

  // Show loading state while retrieving data
  if (!transactionData) {
    return null;
  }

  const { transaction, accountId, balance, currency } = transactionData;

  return (
    <DashboardLayout>
      <TransactionDetailPage
        transaction={transaction}
        accountId={accountId}
        balance={balance}
        currency={currency || "OGY"}
        onCopyTransactionId={handleCopyTransactionId}
        onCopyAccountId={handleCopyAccountId}
      />
    </DashboardLayout>
  );
}
