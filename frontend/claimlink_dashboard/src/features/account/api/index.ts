/**
 * Account API Layer
 * Exports service and query hooks
 */

export { AccountService } from './account.service';
export type {
  UserProfile,
  UpdateProfileRequest,
  AccountStats,
} from './account.service';

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
} from './account.queries';

export type {
  LedgerBalanceData,
  UseFetchLedgerBalanceOptions,
  UseFetchLedgerBalanceResult,
} from './account.queries';
