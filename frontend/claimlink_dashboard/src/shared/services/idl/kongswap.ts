// KongSwap IDL factory for price operations
// swap_amounts takes 3 positional args: (from: Text, amount: Nat, to: Text)
export const idlFactory = ({
  IDL,
}: {
  IDL: typeof import("@dfinity/candid").IDL;
}) => {
  const SwapAmountsTxReply = IDL.Record({
    receive_chain: IDL.Text,
    pay_amount: IDL.Nat,
    receive_amount: IDL.Nat,
    pay_symbol: IDL.Text,
    receive_symbol: IDL.Text,
    receive_address: IDL.Text,
    pool_symbol: IDL.Text,
    pay_address: IDL.Text,
    price: IDL.Float64,
    pay_chain: IDL.Text,
    lp_fee: IDL.Nat,
    gas_fee: IDL.Nat,
  });
  const SwapAmountsReply = IDL.Record({
    txs: IDL.Vec(SwapAmountsTxReply),
    receive_chain: IDL.Text,
    mid_price: IDL.Float64,
    pay_amount: IDL.Nat,
    receive_amount: IDL.Nat,
    pay_symbol: IDL.Text,
    receive_symbol: IDL.Text,
    receive_address: IDL.Text,
    pay_address: IDL.Text,
    price: IDL.Float64,
    pay_chain: IDL.Text,
    slippage: IDL.Float64,
  });
  const SwapAmountsResult = IDL.Variant({
    Ok: SwapAmountsReply,
    Err: IDL.Text,
  });
  return IDL.Service({
    swap_amounts: IDL.Func(
      [IDL.Text, IDL.Nat, IDL.Text],
      [SwapAmountsResult],
      ["query"],
    ),
  });
};
