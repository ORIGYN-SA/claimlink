import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import type { TransactionHistoryProps, DisplayTransaction } from '../types/transaction-history.types';
import type { Transaction as LedgerTransaction } from '@/services/ledger-index/utils/interfaces';
import { OverviewCards } from './overview-cards';
import { TransactionTable } from './transaction-table';
import { FilterControls } from './filter-controls';

// Utility function to convert LedgerTransaction to DisplayTransaction
function formatTransactionForDisplay(
  transaction: LedgerTransaction,
  decimals?: number,
  priceData?: { amount_usd: number }
): DisplayTransaction {
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

  const formatAmount = (amount: bigint | undefined, decimals: number = 8) => {
    if (!amount) return "0.00";
    return (Number(amount) / Math.pow(10, decimals)).toFixed(2);
  };

  const formatUSDAmount = (amount: bigint | undefined, priceData: { amount_usd: number } | undefined, decimals: number = 8) => {
    if (!amount || !priceData) return undefined;
    const ogAmount = Number(amount) / Math.pow(10, decimals);
    return `$${ (ogAmount * priceData.amount_usd).toFixed(2) }`;
  };

  return {
    ...transaction,
    displayCategory: getTransactionTypeLabel(transaction.kind),
    displayDate: formatTransactionDate(transaction.timestamp),
    formattedAmount: formatAmount(transaction.amount, decimals),
    formattedAmountUSD: formatUSDAmount(transaction.amount, priceData, decimals),
  };
}

export function TransactionHistory({
  accountOverview,
  transactions,
  isLoading = false,
  onCopyTransactionId,
  onCopyAccountId,
  onSearch,
  onDateFilter,
  onExport,
  onPageChange,
  onItemsPerPageChange,
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 10,
  totalItems = 0,
}: TransactionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleDateFilter = (dateRange: { start: Date | undefined; end: Date | undefined }) => {
    onDateFilter?.(dateRange);
  };

  const handleExport = () => {
    onExport?.();
  };

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#222526]">Overview</h2>
        </div>
        <OverviewCards
          accountOverview={accountOverview}
          onCopyAccountId={onCopyAccountId}
        />
      </Card>

      {/* Filters Section */}
      <FilterControls
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onDateFilter={handleDateFilter}
        onExport={handleExport}
      />

      {/* Transactions Table */}
      <Card className="rounded-3xl overflow-hidden">
        <TransactionTable
          transactions={transactions}
          isLoading={isLoading}
          onCopyTransactionId={onCopyTransactionId}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      </Card>
    </div>
  );
}

