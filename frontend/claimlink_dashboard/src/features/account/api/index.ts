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
  accountKeys,
  useProfile,
  useAccountStats,
  useActivityHistory,
  useUpdateProfile,
  useDeleteAccount,
} from './account.queries';
