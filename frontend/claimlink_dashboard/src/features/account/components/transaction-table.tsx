import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';
import { StandardizedListView } from '@/components/common/standardized-list-view';
import { Pagination } from '@/components/common/pagination';
import type { DisplayTransaction } from '../types/transaction-history.types';

interface TransactionTableProps {
  transactions: DisplayTransaction[];
  onCopyTransactionId?: (id: string) => void;
  onTransactionClick?: (transaction: DisplayTransaction) => void;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
}

export function TransactionTable({
  transactions,
  onCopyTransactionId,
  onTransactionClick,
  currentPage,
  totalPages,
  itemsPerPage,
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
                {transaction.formattedAmountUSD}
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
        onItemClick={(transaction) => onTransactionClick?.(transaction)}
        showMoreActions={false} // Hide the more actions column for transactions
        className="rounded-t-3xl rounded-b-none"
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => onPageChange?.(page)}
        onItemsPerPageChange={(items) => onItemsPerPageChange?.(items)}
        itemsPerPageOptions={[10, 25, 50, 100]}
        className="rounded-b-3xl"
      />
    </div>
  );
}

