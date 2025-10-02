import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';
import { StandardizedListView } from '@/components/common/standardized-list-view';
import type { DisplayTransaction } from '../types/transaction-history.types';

interface TransactionTableProps {
  transactions: DisplayTransaction[];
  onCopyTransactionId?: (id: string) => void;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
}

export function TransactionTable({
  transactions,
  onCopyTransactionId,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}: TransactionTableProps) {
  const handleCopyTransactionId = (id: string) => {
    navigator.clipboard.writeText(id);
    onCopyTransactionId?.(id);
  };

  const formatTransactionId = (id: string) => {
    // Format long transaction ID with ellipsis in middle
    if (id.length > 25) {
      return `${id.slice(0, 12)}...${id.slice(-12)}`;
    }
    return id;
  };


  const columns = [
    {
      key: 'index',
      label: 'Transaction ID',
      width: '40%',
      render: (transaction: DisplayTransaction) => (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#222526]">
            {formatTransactionId(transaction.index.toString())}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyTransactionId(transaction.index.toString());
            }}
            className="h-6 w-6 p-0 hover:bg-[#f0f0f0]"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
    {
      key: 'displayDate',
      label: 'Date',
      width: '20%',
      render: (transaction: DisplayTransaction) => (
        <span className="text-sm text-[#69737c]">
          {transaction.displayDate}
        </span>
      ),
    },
    {
      key: 'displayCategory',
      label: 'Category',
      width: '20%',
      render: (transaction: DisplayTransaction) => (
        <span className="text-sm font-medium text-[#222526]">
          {transaction.displayCategory}
        </span>
      ),
    },
    {
      key: 'formattedAmount',
      label: 'Amount in OGY',
      width: '20%',
      render: (transaction: DisplayTransaction) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={`${transaction.is_credit ? 'bg-[#50be8f]' : 'bg-[#e84c25]'} text-white px-2 py-1 rounded-full text-xs font-semibold uppercase`}
            >
              {transaction.is_credit ? '+' : '-'}{transaction.formattedAmount}
            </Badge>
            {transaction.formattedAmountUSD && (
              <span className="text-sm text-[#69737c]">
                ({transaction.formattedAmountUSD})
              </span>
            )}
          </div>
        </div>
      ),
    },
  ];

  // Since StandardizedListView doesn't handle pagination, we'll wrap it
  return (
    <div>
      <StandardizedListView
        items={transactions}
        columns={columns}
        onItemClick={() => {}} // No action needed for transaction rows
        showMoreActions={false} // Hide the more actions column for transactions
        className="rounded-t-3xl rounded-b-none"
      />

      {/* Custom Pagination Footer */}
      <div className="flex items-center justify-between px-10 py-4 bg-white border-x border-b border-[#e1e1e1] rounded-b-3xl">
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#69737c]">Lines per page</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
            className="px-3 py-1 border border-[#e1e1e1] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#061937]"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-[#69737c]">
            {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <span className="text-lg leading-none">‹</span>
            </Button>

            <span className="px-3 py-1 text-sm font-medium text-[#222526]">
              {currentPage}
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <span className="text-lg leading-none">›</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

