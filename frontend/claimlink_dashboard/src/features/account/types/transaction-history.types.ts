// Import the real Transaction interface from the ledger service
import type { Transaction as LedgerTransaction } from '@/services/ledger-index/utils/interfaces';

export interface AccountOverview {
  accountId: string;
  balance: number;
  balanceInUSD?: number;
  currency: string;
}

// Extended transaction interface that includes formatted data for display
export interface DisplayTransaction extends LedgerTransaction {
  formattedAmount?: string;
  formattedAmountUSD?: string;
  displayCategory: string;
  displayDate: string;
}

export interface TransactionHistoryProps {
  accountOverview: AccountOverview;
  transactions: DisplayTransaction[];
  isLoading?: boolean;
  onCopyTransactionId?: (id: string) => void;
  onCopyAccountId?: (id: string) => void;
  onSearch?: (query: string) => void;
  onDateFilter?: (dateRange: { start: Date | undefined; end: Date | undefined }) => void;
  onExport?: () => void;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
  currentPage?: number;
  totalPages?: number;
  itemsPerPage?: number;
  totalItems?: number;
}

