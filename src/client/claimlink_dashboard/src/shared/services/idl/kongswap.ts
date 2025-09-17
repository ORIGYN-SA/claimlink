// Basic KongSwap IDL factory for price operations
export const idlFactory = ({
  IDL,
}: {
  IDL: typeof import("@dfinity/candid").IDL;
}) => {
  return IDL.Service({
    swap_amounts: IDL.Func(
      [
        IDL.Record({
          from: IDL.Text,
          to: IDL.Text,
          amount: IDL.Nat,
        }),
      ],
      [
        IDL.Record({
          pay_amount: IDL.Nat,
          receive_amount: IDL.Nat,
          mid_price: IDL.Float64,
          slippage: IDL.Float64,
          txs: IDL.Vec(
            IDL.Record({
              gas_fee: IDL.Nat,
              lp_fee: IDL.Nat,
            }),
          ),
        }),
      ],
      [],
    ),
  });
};
