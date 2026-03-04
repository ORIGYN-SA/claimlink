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
  price: number;
  slippage: number;
  txs: Array<{
    gas_fee: bigint;
    lp_fee: bigint;
  }>;
}

type SwapAmountsVariant =
  | { Ok: SwapAmountsResult }
  | { Err: string };

const swap_amounts = async (
  actor: ActorSubclass,
  params: SwapAmountsParams,
): Promise<SwapAmountsResult> => {
  const { from, to, amount } = params;
  const result = (await actor.swap_amounts(from, amount, to)) as SwapAmountsVariant;
  if ("Err" in result) throw new Error(result.Err);
  return result.Ok;
};

export default swap_amounts;
