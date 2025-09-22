import {
  useQuery,
  keepPreviousData,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { Actor, type Agent, HttpAgent } from "@dfinity/agent";
import { KONGSWAP_CANISTER_ID_IC } from "../constants";
// @ts-expect-error: later will be fixed
import { idlFactory as idlFactoryLedger } from "@services/ledger/idlFactory";
// @ts-expect-error: later will be fixed
import { idlFactory as idlFactoryKongswap } from "@services/kongswap/idlFactory";
import icrc1_decimals from "@services/ledger/icrc1_decimals";
import icrc1_fee from "@services/ledger/icrc1_fee";
import swap_amounts from "@services/kongswap/swap_amounts";

const useFetchTokenPrice = (
  agent: Agent | HttpAgent | undefined,
  options: Omit<
    UseQueryOptions<{
      from: string;
      to: string;
      amount: bigint;
      decimals: number;
      fee: bigint;
      amount_usd: number;
    }>,
    "queryKey" | "queryFn"
  > & {
    from: string;
    from_canister_id: string;
    amount: bigint;
  },
) => {
  const {
    enabled = true,
    placeholderData = keepPreviousData,
    refetchInterval = false,
    from,
    from_canister_id,
    amount = 0n,
    staleTime = 60 * 1000,
    refetchOnMount = true,
    refetchOnWindowFocus = false,
    refetchOnReconnect = true,
    ...queryOptions
  } = options;

  const from_token = from.toLocaleUpperCase();
  const amount_number = Number(amount);

  return useQuery({
    queryKey: [
      `FETCH_TOKEN_PRICE_${from_token}`,
      from,
      from_canister_id,
      amount_number,
    ],
    queryFn: async () => {
      try {
        const actorTokenLedger = Actor.createActor(idlFactoryLedger, {
          agent,
          canisterId: from_canister_id,
        });
        const actorKongswap = Actor.createActor(idlFactoryKongswap, {
          agent,
          canisterId: KONGSWAP_CANISTER_ID_IC,
        });
        const fee = await icrc1_fee(actorTokenLedger);
        const decimals = await icrc1_decimals(actorTokenLedger);

        const price = await swap_amounts(actorKongswap, {
          from: from,
          to: "ckUSDC",
          amount: 1n,
        });

        return {
          from: from,
          to: "ckUSDC",
          amount,
          decimals,
          fee,
          amount_usd: (amount_number / 10 ** decimals) * price.mid_price,
        };
      } catch (err) {
        console.log(err);
        throw new Error(`Fetch token ${from} price error! Please retry later.`);
      }
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

export default useFetchTokenPrice;
