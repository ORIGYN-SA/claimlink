// Truly shared utility hooks
export { useCopyToClipboard } from "./useCopyToClipboard";
export { useMediaQuery, useIsDesktop, useIsMobile, BREAKPOINTS } from "./useMediaQuery";

// Re-exports from features for backward compatibility
// These have been moved to their respective feature directories

/**
 * @deprecated Import from '@/features/account' instead
 */
export { useFetchLedgerBalance } from "@/features/account/api/account.queries";
export type {
  LedgerBalanceData as HookLedgerBalanceData, // Renamed to avoid conflict with types/tokens
  UseFetchLedgerBalanceOptions,
  UseFetchLedgerBalanceResult,
} from "@/features/account/api/account.queries";

/**
 * @deprecated Import from '@/features/account' instead
 */
export { useFetchLedgerDecimals } from "@/features/account/api/account.queries";

/**
 * @deprecated Import from '@/features/account' instead
 */
export { useFetchAccountTransactions } from "@/features/account/api/account.queries";

/**
 * @deprecated Import from '@/features/tokens/hooks' instead
 */
export { default as useFetchTokenPrice } from "@/features/tokens/hooks/useFetchTokenPrice";

/**
 * @deprecated Import from '@/features/tokens/hooks' instead
 */
export { useMultiTokenBalance } from "@/features/tokens/hooks/useMultiTokenBalance";
