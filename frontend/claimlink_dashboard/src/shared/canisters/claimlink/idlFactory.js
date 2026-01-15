export const idlFactory = ({ IDL }) => {
  const BTreeMap = IDL.Rec();
  const ICRC3Value = IDL.Rec();
  const CyclesManagement = IDL.Record({
    'cycles_top_up_increment' : IDL.Nat,
    'cycles_for_collection_creation' : IDL.Nat,
  });
  const BuildVersion = IDL.Record({
    'major' : IDL.Nat32,
    'minor' : IDL.Nat32,
    'patch' : IDL.Nat32,
  });
  const UpgradeArgs = IDL.Record({
    'origyn_nft_wasm_hash' : IDL.Opt(IDL.Text),
    'cycles_management' : IDL.Opt(CyclesManagement),
    'max_creation_retries' : IDL.Opt(IDL.Nat),
    'collection_request_fee' : IDL.Opt(IDL.Nat),
    'ogy_transfer_fee' : IDL.Opt(IDL.Nat),
    'bank_principal_id' : IDL.Opt(IDL.Principal),
    'commit_hash' : IDL.Text,
    'build_version' : BuildVersion,
    'max_template_per_owner' : IDL.Opt(IDL.Nat),
  });
  const AuthordiedPrincipal = IDL.Record({
    'principal' : IDL.Principal,
    'name' : IDL.Text,
  });
  const InitArg = IDL.Record({
    'cycles_management' : CyclesManagement,
    'test_mode' : IDL.Bool,
    'max_creation_retries' : IDL.Nat,
    'collection_request_fee' : IDL.Nat,
    'ogy_transfer_fee' : IDL.Nat,
    'authorized_principals' : IDL.Vec(AuthordiedPrincipal),
    'bank_principal_id' : IDL.Principal,
    'ledger_canister_id' : IDL.Principal,
    'commit_hash' : IDL.Text,
    'max_template_per_owner' : IDL.Nat,
  });
  const ClaimlinkArgs = IDL.Variant({
    'UpgradeArg' : UpgradeArgs,
    'InitArg' : InitArg,
  });
  const CreateCollectionArgs = IDL.Record({
    'name' : IDL.Text,
    'description' : IDL.Text,
    'template_id' : IDL.Nat,
    'symbol' : IDL.Text,
  });
  const GenericError = IDL.Variant({ 'Other' : IDL.Text });
  const TransferFromError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'InsufficientAllowance' : IDL.Record({ 'allowance' : IDL.Nat }),
    'BadBurn' : IDL.Record({ 'min_burn_amount' : IDL.Nat }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const CreateCollectionError = IDL.Variant({
    'ExternalCanisterError' : IDL.Text,
    'Generic' : GenericError,
    'CreateOrigynNftCanisterError' : IDL.Null,
    'TransferFromError' : TransferFromError,
    'InvalidNftTemplateId' : IDL.Null,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : CreateCollectionError });
  const CreateTemplateArgs = IDL.Record({ 'template_json' : IDL.Text });
  const CreateTemplateError = IDL.Variant({
    'JsonError' : IDL.Text,
    'LimitExceeded' : IDL.Record({ 'max_templates' : IDL.Nat }),
  });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : CreateTemplateError });
  const CollectionSearchParam = IDL.Variant({
    'CanisterId' : IDL.Principal,
    'CollectionId' : IDL.Nat,
  });
  const CollectionStatus = IDL.Variant({
    'Queued' : IDL.Null,
    'Failed' : IDL.Record({ 'attempsts' : IDL.Nat, 'reason' : IDL.Text }),
    'QuarantinedReimbursement' : IDL.Record({ 'reason' : IDL.Text }),
    'Reimbursed' : IDL.Record({ 'tx_index' : IDL.Nat }),
    'Created' : IDL.Null,
    'ReimbursingQueued' : IDL.Null,
    'Installed' : IDL.Null,
    'TemplateUploaded' : IDL.Null,
  });
  const CollectionMetadata = IDL.Record({
    'name' : IDL.Text,
    'description' : IDL.Text,
    'template_id' : IDL.Nat,
    'symbol' : IDL.Text,
  });
  const CollectionInfo = IDL.Record({
    'status' : CollectionStatus,
    'updated_at' : IDL.Nat,
    'owner' : IDL.Principal,
    'metadata' : CollectionMetadata,
    'canister_id' : IDL.Opt(IDL.Principal),
    'collection_id' : IDL.Nat,
    'created_at' : IDL.Nat,
    'temaplte_url' : IDL.Opt(IDL.Text),
    'wasm_hash' : IDL.Opt(IDL.Text),
    'ogy_charged' : IDL.Nat,
  });
  const GetCollectionNftsArgs = IDL.Record({
    'prev' : IDL.Opt(IDL.Nat),
    'take' : IDL.Opt(IDL.Nat),
    'canister_id' : IDL.Principal,
  });
  const PaginationArgs = IDL.Record({
    'offset' : IDL.Opt(IDL.Nat64),
    'limit' : IDL.Opt(IDL.Nat64),
  });
  const GetCollectionsByOwnerArgs = IDL.Record({
    'owner' : IDL.Principal,
    'pagination' : PaginationArgs,
  });
  const CollectionsResult = IDL.Record({
    'collections' : IDL.Vec(CollectionInfo),
    'total_count' : IDL.Nat64,
  });
  const GetNftDetailsArgs = IDL.Record({
    'canister_id' : IDL.Principal,
    'token_ids' : IDL.Vec(IDL.Nat),
  });
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  BTreeMap.fill(
    IDL.Vec(
      IDL.Tuple(
        IDL.Text,
        IDL.Variant({
          'Int' : IDL.Int,
          'Map' : BTreeMap,
          'Nat' : IDL.Nat,
          'Blob' : IDL.Vec(IDL.Nat8),
          'Text' : IDL.Text,
          'Array' : IDL.Vec(ICRC3Value),
        }),
      )
    )
  );
  ICRC3Value.fill(
    IDL.Variant({
      'Int' : IDL.Int,
      'Map' : BTreeMap,
      'Nat' : IDL.Nat,
      'Blob' : IDL.Vec(IDL.Nat8),
      'Text' : IDL.Text,
      'Array' : IDL.Vec(ICRC3Value),
    })
  );
  const ICRC3Value_1 = IDL.Variant({
    'Int' : IDL.Int,
    'Map' : IDL.Vec(IDL.Tuple(IDL.Text, ICRC3Value)),
    'Nat' : IDL.Nat,
    'Blob' : IDL.Vec(IDL.Nat8),
    'Text' : IDL.Text,
    'Array' : IDL.Vec(ICRC3Value),
  });
  const NftDetails = IDL.Record({
    'token_id' : IDL.Nat,
    'owner' : IDL.Opt(Account),
    'metadata' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, ICRC3Value_1))),
  });
  const GetTemplatesByOwnerArgs = IDL.Record({
    'owner' : IDL.Principal,
    'pagination' : PaginationArgs,
  });
  const Template = IDL.Record({
    'template_json' : IDL.Text,
    'template_id' : IDL.Nat,
  });
  const TemplatesResult = IDL.Record({
    'templates' : IDL.Vec(Template),
    'total_count' : IDL.Nat64,
  });
  const GetTemplatesByOwnerError = IDL.Variant({
    'UnauthorizedCall' : IDL.Null,
  });
  const Result_2 = IDL.Variant({
    'Ok' : TemplatesResult,
    'Err' : GetTemplatesByOwnerError,
  });
  return IDL.Service({
    'create_collection' : IDL.Func([CreateCollectionArgs], [Result], []),
    'create_template' : IDL.Func([CreateTemplateArgs], [Result_1], []),
    'get_collection_count' : IDL.Func([], [IDL.Nat64], ['query']),
    'get_collection_info' : IDL.Func(
        [CollectionSearchParam],
        [IDL.Opt(CollectionInfo)],
        ['query'],
      ),
    'get_collection_nfts' : IDL.Func(
        [GetCollectionNftsArgs],
        [IDL.Vec(IDL.Nat)],
        ['composite_query'],
      ),
    'get_collections_by_owner' : IDL.Func(
        [GetCollectionsByOwnerArgs],
        [CollectionsResult],
        ['query'],
      ),
    'get_nft_details' : IDL.Func(
        [GetNftDetailsArgs],
        [IDL.Vec(NftDetails)],
        ['composite_query'],
      ),
    'get_templates_by_owner' : IDL.Func(
        [GetTemplatesByOwnerArgs],
        [Result_2],
        ['query'],
      ),
    'list_all_collections' : IDL.Func(
        [PaginationArgs],
        [CollectionsResult],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => {
  const CyclesManagement = IDL.Record({
    'cycles_top_up_increment' : IDL.Nat,
    'cycles_for_collection_creation' : IDL.Nat,
  });
  const BuildVersion = IDL.Record({
    'major' : IDL.Nat32,
    'minor' : IDL.Nat32,
    'patch' : IDL.Nat32,
  });
  const UpgradeArgs = IDL.Record({
    'origyn_nft_wasm_hash' : IDL.Opt(IDL.Text),
    'cycles_management' : IDL.Opt(CyclesManagement),
    'max_creation_retries' : IDL.Opt(IDL.Nat),
    'collection_request_fee' : IDL.Opt(IDL.Nat),
    'ogy_transfer_fee' : IDL.Opt(IDL.Nat),
    'bank_principal_id' : IDL.Opt(IDL.Principal),
    'commit_hash' : IDL.Text,
    'build_version' : BuildVersion,
    'max_template_per_owner' : IDL.Opt(IDL.Nat),
  });
  const AuthordiedPrincipal = IDL.Record({
    'principal' : IDL.Principal,
    'name' : IDL.Text,
  });
  const InitArg = IDL.Record({
    'cycles_management' : CyclesManagement,
    'test_mode' : IDL.Bool,
    'max_creation_retries' : IDL.Nat,
    'collection_request_fee' : IDL.Nat,
    'ogy_transfer_fee' : IDL.Nat,
    'authorized_principals' : IDL.Vec(AuthordiedPrincipal),
    'bank_principal_id' : IDL.Principal,
    'ledger_canister_id' : IDL.Principal,
    'commit_hash' : IDL.Text,
    'max_template_per_owner' : IDL.Nat,
  });
  const ClaimlinkArgs = IDL.Variant({
    'UpgradeArg' : UpgradeArgs,
    'InitArg' : InitArg,
  });
  return [ClaimlinkArgs];
};
