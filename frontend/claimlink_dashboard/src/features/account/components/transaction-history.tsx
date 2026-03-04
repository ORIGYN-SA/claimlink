import { useState } from 'react';
import { Card } from '@/components/ui/card';
import type { TransactionHistoryProps } from '../types/account.types';
import { OverviewCards } from './overview-cards';
import { TransactionTable } from './transaction-table';
import { FilterControls } from './filter-controls';

export function TransactionHistory({
  accountOverview,
  transactions,
  onCopyTransactionId,
  onCopyAccountId,
  onTransactionClick,
  onSearch,
  onDateFilter,
  onExport,
  onPageChange,
  onItemsPerPageChange,
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 10,
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
        <TransactionTable
          transactions={transactions}
          onCopyTransactionId={onCopyTransactionId}
          onTransactionClick={onTransactionClick}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
    </div>
  );
}

