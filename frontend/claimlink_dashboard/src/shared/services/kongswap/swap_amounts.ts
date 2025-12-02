import { type ActorSubclass } from "@dfinity/agent";

interface SwapAmountsParams {
  from: string;
  to: string;
  amount: bigint;
}

interface SwapAmountsResult {
  pay_amount: bigint;
  receive_amount: bigint;
  mid_price: number;
  slippage: number;
  txs: Array<{
    gas_fee: bigint;
    lp_fee: bigint;
  }>;
}

const swap_amounts = async (
  actor: ActorSubclass,
  params: SwapAmountsParams,
): Promise<SwapAmountsResult> => {
  const result = (await actor.swap_amounts(params)) as SwapAmountsResult;
  return result;
};

export default swap_amounts;
