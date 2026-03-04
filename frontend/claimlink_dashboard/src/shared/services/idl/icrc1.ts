// Basic ICRC-1 IDL factory for ledger operations
export const idlFactory = ({
  IDL,
}: {
  IDL: typeof import("@dfinity/candid").IDL;
}) => {
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
  });

  return IDL.Service({
    icrc1_balance_of: IDL.Func([Account], [IDL.Nat], []),
    icrc1_decimals: IDL.Func([], [IDL.Nat8], []),
    icrc1_fee: IDL.Func([], [IDL.Nat], []),
    icrc1_metadata: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))], []),
    icrc1_minting_account: IDL.Func([], [IDL.Opt(Account)], []),
    icrc1_name: IDL.Func([], [IDL.Text], []),
    icrc1_supported_standards: IDL.Func(
      [],
      [
        IDL.Vec(
          IDL.Record({
            name: IDL.Text,
            url: IDL.Text,
          }),
        ),
      ],
      [],
    ),
    icrc1_symbol: IDL.Func([], [IDL.Text], []),
    icrc1_total_supply: IDL.Func([], [IDL.Nat], []),
    icrc1_transfer: IDL.Func(
      [
        IDL.Record({
          from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
          to: Account,
          amount: IDL.Nat,
          fee: IDL.Opt(IDL.Nat),
          memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
          created_at_time: IDL.Opt(IDL.Nat64),
        }),
      ],
      [
        IDL.Variant({
          Ok: IDL.Nat,
          Err: IDL.Variant({
            BadFee: IDL.Null,
            BadBurn: IDL.Null,
            InsufficientFunds: IDL.Null,
            TooOld: IDL.Null,
            CreatedInFuture: IDL.Null,
            Duplicate: IDL.Null,
            TemporarilyUnavailable: IDL.Null,
            GenericError: IDL.Record({
              message: IDL.Text,
              error_code: IDL.Nat,
            }),
          }),
        }),
      ],
      [],
    ),
  });
};
