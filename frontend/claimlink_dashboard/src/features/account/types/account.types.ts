/**
 * Account Types
 *
 * Complete type definitions for the account feature, including:
 * - User accounts
 * - Transaction history and details
 * - Account overview and display
 */

import type { Transaction as LedgerTransaction } from '@/services/ledger-index/utils/interfaces';

// ============================================================================
// User Types
// ============================================================================

export interface User {
  id: number;
  username: string;
  email: string;
  title: string;
  access: string[];
  lastActive: string;
  avatar: string;
}

// ============================================================================
// Account Overview
// ============================================================================

export interface AccountOverview {
  accountId: string;
  balance: number;
  balanceInUSD?: number;
  currency: string;
}

// ============================================================================
// Transaction Types
// ============================================================================

/**
 * Extended transaction interface that includes formatted data for display
 */
export interface DisplayTransaction extends LedgerTransaction {
  formattedAmount?: string;
  formattedAmountUSD?: string;
  displayCategory: string;
  displayDate: string;
}

// ============================================================================
// Transaction History Component Props
// ============================================================================

export interface TransactionHistoryProps {
  accountOverview: AccountOverview;
  transactions: DisplayTransaction[];
  onCopyTransactionId?: (id: string) => void;
  onCopyAccountId?: (id: string) => void;
  onTransactionClick?: (transaction: DisplayTransaction) => void;
  onSearch?: (query: string) => void;
  onDateFilter?: (dateRange: { start: Date | undefined; end: Date | undefined }) => void;
  onExport?: () => void;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
  currentPage?: number;
  totalPages?: number;
  itemsPerPage?: number;
}

// ============================================================================
// Transaction Detail Component Props
// ============================================================================

export interface TransactionDetailPageProps {
  transaction: LedgerTransaction;
  accountId?: string;
  balance?: number;
  currency?: string;
  onCopyTransactionId?: (id: string) => void;
  onCopyAccountId?: (id: string) => void;
}

export interface TransactionDetailCardProps {
  transaction: LedgerTransaction;
  onCopyTransactionId?: (id: string) => void;
  onCopyAccountId?: (id: string) => void;
}

export interface TransactionAddressRowProps {
  label: 'From' | 'To';
  address: string;
  onCopy?: () => void;
}

export interface TransactionAmountSectionProps {
  amount: bigint | undefined;
  fee: bigint | undefined;
  currency?: string;
  decimals?: number;
}

export interface TransactionMemoSectionProps {
  memo: string | undefined;
}

export interface TransactionTimestampSectionProps {
  timestamp: string;
}
