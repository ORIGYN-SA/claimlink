// Truly shared utility hooks
export { useCopyToClipboard } from "./useCopyToClipboard";
export { useMediaQuery, useIsDesktop, useIsMobile, BREAKPOINTS } from "./useMediaQuery";

// Re-exports from features for backward compatibility
// These have been moved to their respective feature directories

/**
 * @deprecated Import from '@/features/account/hooks' instead
 */
export { default as useFetchLedgerBalance } from "@/features/account/hooks/useFetchLedgerBalance";
export type {
  LedgerBalanceData as HookLedgerBalanceData, // Renamed to avoid conflict with types/tokens
  UseFetchLedgerBalanceOptions,
  UseFetchLedgerBalanceResult,
} from "@/features/account/hooks/useFetchLedgerBalance";

/**
 * @deprecated Import from '@/features/account/hooks' instead
 */
export { default as useFetchLedgerDecimals } from "@/features/account/hooks/useFetchLedgerDecimals";

/**
 * @deprecated Import from '@/features/account/hooks' instead
 */
export { default as useFetchAccountTransactions } from "@/features/account/hooks/useFetchAccountTransactions";

/**
 * @deprecated Import from '@/features/tokens/hooks' instead
 */
export { default as useFetchTokenPrice } from "@/features/tokens/hooks/useFetchTokenPrice";

/**
 * @deprecated Import from '@/features/tokens/hooks' instead
 */
export { useMultiTokenBalance } from "@/features/tokens/hooks/useMultiTokenBalance";
