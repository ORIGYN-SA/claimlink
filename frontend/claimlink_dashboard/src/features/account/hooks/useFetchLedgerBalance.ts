import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { Actor, type Agent, HttpAgent } from "@dfinity/agent";
import { CANISTER_IDS } from "@/shared/canister";
import { idlFactory as idlFactoryLedger } from "@services/ledger/idlFactory";
// @ts-expect-error: later will be fixed
import { idlFactory as idlFactoryKongswap } from "@services/kongswap/idlFactory";
import { icrc1_balance_of } from "@/shared/services/ledger/icrc1_balance_of";
import icrc1_decimals from "@/shared/services/ledger/icrc1_decimals";
import icrc1_fee from "@/shared/services/ledger/icrc1_fee";
import swap_amounts from "@/shared/services/kongswap/swap_amounts";

interface LedgerBalanceData {
  balance: number;
  balance_e8s: bigint;
  balance_usd: number;
  decimals: number;
  fee: number;
  fee_usd: number;
  fee_e8s: bigint;
  price_usd: number;
}

interface UseFetchLedgerBalanceOptions
  extends Omit<UseQueryOptions<LedgerBalanceData>, "queryKey" | "queryFn"> {
  ledger: string;
  owner: string;
}

type UseFetchLedgerBalanceResult = UseQueryResult<LedgerBalanceData, Error>;

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
    queryKey: ["FETCH_LEDGER_BALANCE", ledger, owner, canisterId],
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
        to: "ckUSDT",
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

export default useFetchLedgerBalance;
export type {
  LedgerBalanceData,
  UseFetchLedgerBalanceOptions,
  UseFetchLedgerBalanceResult,
};
