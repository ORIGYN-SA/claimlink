import type { Transaction } from '@/services/ledger-index/utils/interfaces';

export interface TransactionDetailPageProps {
  transaction: Transaction;
  accountId?: string;
  balance?: number;
  currency?: string;
  onCopyTransactionId?: (id: string) => void;
  onCopyAccountId?: (id: string) => void;
}

export interface TransactionDetailCardProps {
  transaction: Transaction;
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
