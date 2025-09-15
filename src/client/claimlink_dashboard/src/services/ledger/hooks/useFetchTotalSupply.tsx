import {
  useQuery,
  keepPreviousData,
  UseQueryOptions,
} from "@tanstack/react-query";
import { Actor, Agent, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../idlFactory";

import icrc1_total_supply from "../icrc1_total_supply";

const useFetchTotalSupply = (
  canisterId: string,
  agent: Agent | HttpAgent | undefined,
  options: Omit<UseQueryOptions<bigint>, "queryKey" | "queryFn"> & {
    ledger: string;
  }
) => {
  const {
    enabled = true,
    refetchInterval = false,
    placeholderData = keepPreviousData,
    ledger,
  } = options;
  return useQuery({
    queryKey: ["FETCH_TOTAL_SUPPLY", ledger],
    queryFn: async () => {
      const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId,
      });
      const result = await icrc1_total_supply(actor);
      return result;
    },
    placeholderData,
    enabled,
    refetchInterval,
  });
};

export default useFetchTotalSupply;
