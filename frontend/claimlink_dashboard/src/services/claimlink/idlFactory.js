export const idlFactory = ({ IDL }) => {
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
  });

  const ICRC3Value = IDL.Rec();
  const BTreeMap = IDL.Vec(
    IDL.Tuple(
      IDL.Text,
      IDL.Variant({
        Int: IDL.Int,
        Map: BTreeMap,
        Nat: IDL.Nat,
        Blob: IDL.Vec(IDL.Nat8),
        Text: IDL.Text,
        Array: IDL.Vec(ICRC3Value),
      })
    )
  );

  ICRC3Value.fill(
    IDL.Variant({
      Int: IDL.Int,
      Map: BTreeMap,
      Nat: IDL.Nat,
      Blob: IDL.Vec(IDL.Nat8),
      Text: IDL.Text,
      Array: IDL.Vec(ICRC3Value),
    })
  );

  const ICRC3Value_1 = IDL.Variant({
    Int: IDL.Int,
    Map: IDL.Vec(IDL.Tuple(IDL.Text, ICRC3Value)),
    Nat: IDL.Nat,
    Blob: IDL.Vec(IDL.Nat8),
    Text: IDL.Text,
    Array: IDL.Vec(ICRC3Value),
  });

  const CollectionExistsArgs = IDL.Record({
    canister_id: IDL.Principal,
  });

  const CollectionInfo = IDL.Record({
    creator: IDL.Principal,
    name: IDL.Text,
    canister_id: IDL.Principal,
    description: IDL.Text,
    created_at: IDL.Nat64,
    symbol: IDL.Text,
  });

  const CollectionsResult = IDL.Record({
    collections: IDL.Vec(CollectionInfo),
    total_count: IDL.Nat64,
  });

  const CreateCollectionArgs = IDL.Record({
    name: IDL.Text,
    description: IDL.Text,
    symbol: IDL.Text,
  });

  const GenericError = IDL.Variant({
    Other: IDL.Text,
  });

  const TransferFromError = IDL.Variant({
    GenericError: IDL.Record({
      message: IDL.Text,
      error_code: IDL.Nat,
    }),
    TemporarilyUnavailable: IDL.Null,
    InsufficientAllowance: IDL.Record({
      allowance: IDL.Nat,
    }),
    BadBurn: IDL.Record({
      min_burn_amount: IDL.Nat,
    }),
    Duplicate: IDL.Record({
      duplicate_of: IDL.Nat,
    }),
    BadFee: IDL.Record({
      expected_fee: IDL.Nat,
    }),
    CreatedInFuture: IDL.Record({
      ledger_time: IDL.Nat64,
    }),
    TooOld: IDL.Null,
    InsufficientFunds: IDL.Record({
      balance: IDL.Nat,
    }),
  });

  const CreateCollectionError = IDL.Variant({
    InsufficientCycles: IDL.Null,
    ExternalCanisterError: IDL.Text,
    Generic: GenericError,
    CreateOrigynNftCanisterError: IDL.Null,
    TransferFromError: TransferFromError,
  });

  const CreateCollectionResult = IDL.Record({
    origyn_nft_canister_id: IDL.Principal,
  });

  const Result = IDL.Variant({
    Ok: CreateCollectionResult,
    Err: CreateCollectionError,
  });

  const GetCollectionNftsArgs = IDL.Record({
    prev: IDL.Opt(IDL.Nat),
    take: IDL.Opt(IDL.Nat),
    canister_id: IDL.Principal,
  });

  const GetCollectionsByOwnerArgs = IDL.Record({
    owner: IDL.Principal,
    pagination: IDL.Record({
      offset: IDL.Opt(IDL.Nat64),
      limit: IDL.Opt(IDL.Nat64),
    }),
  });

  const GetNftDetailsArgs = IDL.Record({
    canister_id: IDL.Principal,
    token_ids: IDL.Vec(IDL.Nat),
  });

  const NftDetails = IDL.Record({
    token_id: IDL.Nat,
    owner: IDL.Opt(Account),
    metadata: IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, ICRC3Value_1))),
  });

  const PaginationArgs = IDL.Record({
    offset: IDL.Opt(IDL.Nat64),
    limit: IDL.Opt(IDL.Nat64),
  });

  const InitArgs = IDL.Record({
    origyn_nft_commit_hash: IDL.Text,
    test_mode: IDL.Bool,
    authorized_principals: IDL.Vec(IDL.Principal),
    bank_principal_id: IDL.Principal,
    ledger_canister_id: IDL.Principal,
  });

  return IDL.Service({
    collection_exists: IDL.Func([CollectionExistsArgs], [IDL.Bool], ['query']),
    create_collection: IDL.Func([CreateCollectionArgs], [Result], []),
    get_collection_count: IDL.Func([], [IDL.Nat64], ['query']),
    get_collection_info: IDL.Func(
      [CollectionExistsArgs],
      [IDL.Opt(CollectionInfo)],
      ['query']
    ),
    get_collection_nfts: IDL.Func(
      [GetCollectionNftsArgs],
      [IDL.Vec(IDL.Nat)],
      ['composite_query']
    ),
    get_collections_by_owner: IDL.Func(
      [GetCollectionsByOwnerArgs],
      [CollectionsResult],
      ['query']
    ),
    get_nft_details: IDL.Func(
      [GetNftDetailsArgs],
      [IDL.Vec(NftDetails)],
      ['composite_query']
    ),
    list_all_collections: IDL.Func([PaginationArgs], [CollectionsResult], ['query']),
    list_my_collections: IDL.Func([PaginationArgs], [CollectionsResult], ['query']),
  });
};

export const init = ({ IDL }) => {
  const InitArgs = IDL.Record({
    origyn_nft_commit_hash: IDL.Text,
    test_mode: IDL.Bool,
    authorized_principals: IDL.Vec(IDL.Principal),
    bank_principal_id: IDL.Principal,
    ledger_canister_id: IDL.Principal,
  });
  return [InitArgs];
};
