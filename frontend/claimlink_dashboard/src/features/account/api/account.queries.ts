/**
 * Account Query Hooks
 *
 * React Query hooks for account/user data fetching and ledger operations.
 * Uses AccountService for data access abstraction.
 */

import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
  type UseQueryOptions,
  type UseQueryResult,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { Actor, type Agent, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { decodeIcrcAccount } from '@dfinity/ledger-icrc';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { CANISTER_IDS } from '@/shared/canister';
import { idlFactory as idlFactoryLedger } from '@services/ledger/idlFactory';
// @ts-expect-error: later will be fixed
import { idlFactory as idlFactoryKongswap } from '@services/kongswap/idlFactory';
import { idlFactory as idlFactoryLedgerIndex } from '@services/ledger-index/idlFactory';
import { idlFactory as idlFactoryLedgerIndexICP } from '@services/ledger-index/idlFactory_icp';
import { icrc1_balance_of } from '@/shared/services/ledger/icrc1_balance_of';
import icrc1_decimals from '@/shared/services/ledger/icrc1_decimals';
import icrc1_fee from '@/shared/services/ledger/icrc1_fee';
import swap_amounts from '@/shared/services/kongswap/swap_amounts';
import get_account_transactions from '@services/ledger-index/get_account_transactions';
import get_account_transactions_icp from '@services/ledger-index/get_account_transactions_icp';
import type { Transactions } from '@services/ledger-index/utils/interfaces';
import { isLocalICReplica } from '@/shared/utils/environment';
import { IC_HOST, APP_MODE } from '@/shared/canister';
import {
  AccountService,
  type UpdateProfileRequest,
} from './account.service';

// ============================================================================
// Types
// ============================================================================

export interface LedgerBalanceData {
  balance: number;
  balance_e8s: bigint;
  balance_usd: number;
  decimals: number;
  fee: number;
  fee_usd: number;
  fee_e8s: bigint;
  price_usd: number;
}

export interface UseFetchLedgerBalanceOptions
  extends Omit<UseQueryOptions<LedgerBalanceData>, 'queryKey' | 'queryFn'> {
  ledger: string;
  owner: string;
}

export type UseFetchLedgerBalanceResult = UseQueryResult<LedgerBalanceData, Error>;

// ============================================================================
// Query Key Factory
// ============================================================================

/**
 * Query key factory for account
 */
export const accountKeys = {
  all: ['account'] as const,
  profile: (principalId: string) =>
    [...accountKeys.all, 'profile', principalId] as const,
  stats: (principalId: string) =>
    [...accountKeys.all, 'stats', principalId] as const,
  activity: (principalId: string) =>
    [...accountKeys.all, 'activity', principalId] as const,
  ledgerBalance: (ledger: string, owner: string, canisterId: string) =>
    ['FETCH_LEDGER_BALANCE', ledger, owner, canisterId] as const,
  ledgerDecimals: (ledger: string) =>
    ['FETCH_LEDGER_DECIMALS', ledger] as const,
  accountTransactions: (ledger: string, account: string) =>
    ['FETCH_ACCOUNT_TRANSACTIONS', ledger, account] as const,
};

// ============================================================================
// Profile Hooks
// ============================================================================

/**
 * Fetch user profile
 */
export const useProfile = (principalId: string) => {
  return useQuery({
    queryKey: accountKeys.profile(principalId),
    queryFn: () => AccountService.getProfile(principalId),
    enabled: !!principalId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch account statistics
 */
export const useAccountStats = (principalId: string) => {
  return useQuery({
    queryKey: accountKeys.stats(principalId),
    queryFn: () => AccountService.getAccountStats(principalId),
    enabled: !!principalId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch account activity history
 */
export const useActivityHistory = (principalId: string) => {
  return useQuery({
    queryKey: accountKeys.activity(principalId),
    queryFn: () => AccountService.getActivityHistory(principalId),
    enabled: !!principalId,
    staleTime: 2 * 60 * 1000, // 2 minutes - activity changes more frequently
  });
};

/**
 * Update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      principalId,
      request,
    }: {
      principalId: string;
      request: UpdateProfileRequest;
    }) => AccountService.updateProfile(principalId, request),
    onSuccess: (_, variables) => {
      // Invalidate profile to refetch
      queryClient.invalidateQueries({
        queryKey: accountKeys.profile(variables.principalId),
      });
    },
  });
};

/**
 * Delete account
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (principalId: string) =>
      AccountService.deleteAccount(principalId),
    onSuccess: () => {
      // Clear all queries on account deletion
      queryClient.clear();
    },
  });
};

// ============================================================================
// Ledger Hooks
// ============================================================================

/**
 * Fetch ledger balance with USD conversion
 */
const useFetchLedgerBalance = (
  canisterId: string,
  agent: Agent | HttpAgent | undefined,
  options: UseFetchLedgerBalanceOptions,
): UseFetchLedgerBalanceResult => {
  const {
    enabled = true,
    refetchInterval = false,
    placeholderData = undefined,
    ledger,
    owner,
    staleTime = 60 * 1000,
    refetchOnMount = true,
    refetchOnWindowFocus = false,
    refetchOnReconnect = true,
    ...queryOptions
  } = options;

  return useQuery<LedgerBalanceData>({
    queryKey: ['FETCH_LEDGER_BALANCE', ledger, owner, canisterId],
    queryFn: async (): Promise<LedgerBalanceData> => {
      const actorLedger = Actor.createActor(idlFactoryLedger, {
        agent,
        canisterId,
      });

      const balance_e8s = await icrc1_balance_of({
        actor: actorLedger,
        owner,
      });
      const actorKongswap = Actor.createActor(idlFactoryKongswap, {
        agent,
        canisterId: CANISTER_IDS.kongswap,
      });
      const fee_e8s = await icrc1_fee(actorLedger);
      const decimals = await icrc1_decimals(actorLedger);

      const price = await swap_amounts(actorKongswap, {
        from: ledger,
        to: 'ckUSDT',
        amount: BigInt(1 * 10 ** decimals),
      });
      const fee = Number(fee_e8s) / 10 ** decimals;
      const balance = Number(balance_e8s) / 10 ** decimals;
      const balance_usd = balance * price.mid_price;

      return {
        balance,
        balance_e8s,
        balance_usd,
        decimals,
        fee,
        fee_e8s,
        fee_usd: fee * price.mid_price,
        price_usd: price.mid_price,
      };
    },
    placeholderData,
    enabled,
    refetchInterval,
    staleTime,
    refetchOnMount,
    refetchOnWindowFocus,
    refetchOnReconnect,
    ...queryOptions,
  });
};

/**
 * Fetch ledger decimals
 */
const useFetchLedgerDecimals = (
  canisterId: string,
  agent: Agent | HttpAgent | undefined,
  options: Omit<UseQueryOptions<number>, 'queryKey' | 'queryFn'> & {
    ledger: string;
  },
) => {
  const {
    enabled = true,
    placeholderData = keepPreviousData,
    refetchInterval = false,
    ledger,
  } = options;

  return useQuery({
    queryKey: ['FETCH_LEDGER_DECIMALS', ledger],
    queryFn: async () => {
      try {
        const actor = Actor.createActor(idlFactoryLedger, {
          agent,
          canisterId,
        });
        const result = await icrc1_decimals(actor);
        return result;
      } catch (err) {
        console.log(err);
        throw new Error('Fetch decimals error! Please retry later.');
      }
    },
    placeholderData,
    enabled,
    refetchInterval,
  });
};

/**
 * Fetch account transactions with infinite scrolling
 */
const useFetchAccountTransactions = (
  canisterId: string,
  agent: Agent | HttpAgent | undefined,
  args: Omit<
    UseInfiniteQueryOptions<Transactions>,
    | 'queryKey'
    | 'queryFn'
    | 'getNextPageParam'
    | 'getPreviousPageParam'
    | 'initialPageParam'
  > & {
    max_results?: number;
    account: string;
    ledger: string;
  },
) => {
  const {
    enabled = true,
    placeholderData = undefined,
    max_results = 20,
    account,
    ledger,
  } = args;

  // Skip ledger-index queries for local OGY (no local index deployed)
  const isLocalOGY =
    ledger === 'OGY' &&
    isLocalICReplica(IC_HOST, APP_MODE) &&
    canisterId === CANISTER_IDS.ogyLedgerIndex;

  return useInfiniteQuery({
    queryKey: ['FETCH_ACCOUNT_TRANSACTIONS', ledger, account],
    queryFn: async ({ pageParam = null }) => {
      try {
        const decodedAccount = decodeIcrcAccount(account);
        const owner = decodedAccount.owner;
        const subaccount = decodedAccount?.subaccount
          ? [decodedAccount.subaccount]
          : [];
        const accountId = AccountIdentifier.fromPrincipal({
          principal: Principal.fromText(account),
        }).toHex();

        let results: Transactions;

        if (ledger === 'ICP') {
          const actor = Actor.createActor(idlFactoryLedgerIndexICP, {
            agent,
            canisterId,
          });
          results = await get_account_transactions_icp(actor, {
            max_results,
            start: pageParam as number | null,
            owner,
            subaccount,
          });
        } else {
          const actor = Actor.createActor(idlFactoryLedgerIndex, {
            agent,
            canisterId,
          });

          results = await get_account_transactions(actor, {
            max_results,
            start: pageParam as number | null,
            owner,
            subaccount,
          });
        }

        const newData = results.data?.map((tx) => {
          const is_credit = tx.to === accountId || tx.to === account;
          const from = tx.from && tx.from === accountId ? account : tx.from;
          const to = tx.to && tx.to === accountId ? account : tx.to;

          return {
            ...tx,
            is_credit,
            from,
            to,
          };
        });

        return {
          data: newData,
          cursor_index: results.cursor_index,
        };
      } catch (err) {
        console.error(err);
        throw new Error(
          'Fetch account transactions error! Please retry later.',
        );
      }
    },
    initialPageParam: null,
    getNextPageParam: (page) => page.cursor_index ?? null,
    placeholderData,
    enabled: enabled && agent !== undefined && !isLocalOGY,
  });
};

export {
  useFetchLedgerBalance,
  useFetchLedgerDecimals,
  useFetchAccountTransactions,
};
export default useFetchLedgerBalance;
