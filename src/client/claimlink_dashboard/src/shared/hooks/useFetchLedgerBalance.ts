import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { Actor, type Agent, HttpAgent } from "@dfinity/agent";
import { KONGSWAP_CANISTER_ID_IC } from "../constants";
import { icrc1_balance_of, icrc1_decimals, icrc1_fee } from "../services/ledger";
import swap_amounts from "../services/kongswap/swap_amounts";
import { idlFactory as icrc1IdlFactory } from "../services/idl/icrc1";
import { idlFactory as kongswapIdlFactory } from "../services/idl/kongswap";
import { handleLedgerError, isRetryableError, getRetryDelay } from "../utils/errorHandling";
import type { LedgerBalanceData } from "../types/tokens";

interface UseFetchLedgerBalanceOptions
  extends Omit<UseQueryOptions<LedgerBalanceData>, "queryKey" | "queryFn"> {
  ledger: string;
  owner: string;
}

export const useFetchLedgerBalance = (
  canisterId: string,
  agent: Agent | HttpAgent | undefined,
  options: UseFetchLedgerBalanceOptions
): UseQueryResult<LedgerBalanceData, Error> => {
  const {
    enabled = true,
    refetchInterval = false,
    placeholderData = undefined,
    ledger,
    owner,
    staleTime = 60 * 1000, // Cache for 1 minute
    refetchOnMount = true,
    refetchOnWindowFocus = false,
    refetchOnReconnect = true,
    ...queryOptions
  } = options;

  return useQuery<LedgerBalanceData>({
    queryKey: ["FETCH_LEDGER_BALANCE", ledger, owner, canisterId],
    queryFn: async (): Promise<LedgerBalanceData> => {
      try {
      if (!owner) {
        throw new Error("Owner principal is required");
      }

      if (!agent) {
        throw new Error("Agent is required");
      }

      // Create ledger actor
      const ledgerActor = Actor.createActor(icrc1IdlFactory, {
        agent,
        canisterId,
      });

      // Fetch balance and token metadata
      const [balance_e8s, fee_e8s, decimals] = await Promise.all([
        icrc1_balance_of({ actor: ledgerActor, owner }),
        icrc1_fee(ledgerActor),
        icrc1_decimals(ledgerActor),
      ]);

      // Convert to human-readable format
      const balance = Number(balance_e8s) / 10 ** decimals;
      const fee = Number(fee_e8s) / 10 ** decimals;

      // Fetch USD price (optional)
      let price_usd = 0;
      let balance_usd = 0;
      let fee_usd = 0;

      try {
        // Create KongSwap actor
        const kongswapActor = Actor.createActor(kongswapIdlFactory, {
          agent,
          canisterId: KONGSWAP_CANISTER_ID_IC,
        });

        const priceData = await swap_amounts(kongswapActor, {
          from: ledger,
          to: "ckUSDT",
          amount: BigInt(1 * 10 ** decimals),
        });

        price_usd = priceData.mid_price;
        balance_usd = balance * price_usd;
        fee_usd = fee * price_usd;
      } catch (error) {
        console.warn(`Failed to fetch price for ${ledger}:`, error);
      }

        return {
          balance,
          balance_e8s,
          balance_usd,
          decimals,
          fee,
          fee_e8s,
          fee_usd,
          price_usd,
        };
      } catch (error) {
        throw handleLedgerError(error);
      }
    },
    placeholderData,
    enabled: enabled && !!owner && !!agent,
    refetchInterval,
    staleTime,
    refetchOnMount,
    refetchOnWindowFocus,
    refetchOnReconnect,
    retry: (failureCount, error) => {
      // Retry up to 3 times for retryable errors
      if (isRetryableError(error) && failureCount < 3) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex, error) => getRetryDelay(attemptIndex, error),
    ...queryOptions,
  });
};
