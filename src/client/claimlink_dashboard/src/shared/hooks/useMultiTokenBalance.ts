import { useQueries, type UseQueryResult } from "@tanstack/react-query";
import { Actor, type Agent, HttpAgent } from "@dfinity/agent";
import type { Token, LedgerBalanceData } from "../types/tokens";
import { KONGSWAP_CANISTER_ID_IC } from "../constants";
import { icrc1_balance_of, icrc1_decimals, icrc1_fee } from "../services/ledger";
import swap_amounts from "../services/kongswap/swap_amounts";
import { idlFactory as icrc1IdlFactory } from "../services/idl/icrc1";
import { idlFactory as kongswapIdlFactory } from "../services/idl/kongswap";
import { handleLedgerError, isRetryableError, getRetryDelay } from "../utils/errorHandling";

interface BatchBalanceResult {
  token: Token;
  balance: UseQueryResult<LedgerBalanceData, Error>;
}

export const useMultiTokenBalance = (
  tokens: Token[],
  agent: Agent | HttpAgent | undefined,
  owner: string,
  options: {
    enabled?: boolean;
    refetchInterval?: number;
    staleTime?: number;
  } = {}
) => {
  const {
    enabled = true,
    refetchInterval = false,
    staleTime = 60 * 1000,
  } = options;

  const results = useQueries({
    queries: tokens.map((token) => ({
      queryKey: ["FETCH_LEDGER_BALANCE", token.name, owner, token.canister_id],
      queryFn: async (): Promise<LedgerBalanceData> => {
        try {
          if (!owner || !agent) {
            throw new Error("Owner and agent are required");
          }

        // Create ledger actor
        const ledgerActor = Actor.createActor(icrc1IdlFactory, {
          agent,
          canisterId: token.canister_id,
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
            from: token.name,
            to: "ckUSDT",
            amount: BigInt(1 * 10 ** decimals),
          });

          price_usd = priceData.mid_price;
          balance_usd = balance * price_usd;
          fee_usd = fee * price_usd;
        } catch (error) {
          console.warn(`Failed to fetch price for ${token.name}:`, error);
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
    enabled: enabled && !!owner && !!agent,
    refetchInterval,
    staleTime,
    retry: (failureCount, error) => {
      // Retry up to 3 times for retryable errors
      if (isRetryableError(error) && failureCount < 3) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex, error) => getRetryDelay(attemptIndex, error),
  })),
  });

  const balances: BatchBalanceResult[] = tokens.map((token, index) => ({
    token,
    balance: results[index],
  }));

  const summary = {
    totalUsdValue: balances
      .filter(({ balance }) => balance.isSuccess)
      .reduce((sum, { balance }) => sum + (balance.data?.balance_usd || 0), 0),

    loadingCount: balances.filter(({ balance }) => balance.isLoading).length,
    errorCount: balances.filter(({ balance }) => balance.isError).length,
    successCount: balances.filter(({ balance }) => balance.isSuccess).length,

    isAllLoaded: balances.every(({ balance }) => !balance.isLoading),
    hasErrors: balances.some(({ balance }) => balance.isError),
  };

  return {
    balances,
    summary,
    refetchAll: () => {
      balances.forEach(({ balance }) => balance.refetch());
    },
  };
};
