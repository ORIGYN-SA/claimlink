// ============================================================================
// Components
// ============================================================================

export { AccountPage } from './components/account-page';
export { CreateUserPage } from './components/create-user-page';
export { EditUserPage } from './components/edit-user-page';
export { EditCompanyPage } from './components/edit-company-page';
export { CompanyRecapCard } from './components/company-recap-card';
export { DeleteUserDialog } from './components/delete-user-dialog';
export { TransactionHistoryPage } from './components/transaction-history-page';
export { TransactionHistory } from './components/transaction-history';
export { TransactionDetailPage } from './components/transaction-detail-page';
export { OverviewCards } from './components/overview-cards';
export { TransactionTable } from './components/transaction-table';
export { FilterControls } from './components/filter-controls';

// ============================================================================
// API Layer (includes all hooks)
// ============================================================================

export { AccountService } from './api/account.service';
export type {
  UserProfile,
  UpdateProfileRequest,
  AccountStats,
} from './api/account.service';

export {
  // Query keys
  accountKeys,
  // Profile hooks
  useProfile,
  useAccountStats,
  useActivityHistory,
  useUpdateProfile,
  useDeleteAccount,
  // Ledger hooks
  useFetchLedgerBalance,
  useFetchLedgerDecimals,
  useFetchAccountTransactions,
} from './api/account.queries';

export type {
  LedgerBalanceData,
  UseFetchLedgerBalanceOptions,
  UseFetchLedgerBalanceResult,
} from './api/account.queries';

// ============================================================================
// Types
// ============================================================================

export type {
  DisplayTransaction,
  AccountOverview,
  TransactionHistoryProps,
} from './types/account.types';

export type {
  TransactionDetailPageProps,
  TransactionDetailCardProps,
  TransactionAddressRowProps,
  TransactionAmountSectionProps,
  TransactionMemoSectionProps,
  TransactionTimestampSectionProps,
} from './types/account.types';

export type {
    User
  } from './types/account.types'