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
  const MintPricingConfig = IDL.Record({
    'storage_fee_per_mb_usd_e8s' : IDL.Nat64,
    'base_mint_fee_usd_e8s' : IDL.Nat64,
  });
  const UpgradeArgs = IDL.Record({
    'origyn_nft_wasm_hash' : IDL.Opt(IDL.Text),
    'cycles_management' : IDL.Opt(CyclesManagement),
    'max_creation_retries' : IDL.Opt(IDL.Nat),
    'collection_request_fee' : IDL.Opt(IDL.Nat),
    'new_authorized_principals' : IDL.Opt(IDL.Vec(IDL.Record({
      'principal' : IDL.Principal,
      'name' : IDL.Text,
    }))),
    'ogy_transfer_fee' : IDL.Opt(IDL.Nat),
    'bank_principal_id' : IDL.Opt(IDL.Principal),
    'ledger_canister_id' : IDL.Opt(IDL.Principal),
    'mint_pricing' : IDL.Opt(MintPricingConfig),
    'commit_hash' : IDL.Text,
    'build_version' : BuildVersion,
    'icpswap_pool_canister_id' : IDL.Opt(IDL.Principal),
    'max_template_per_owner' : IDL.Opt(IDL.Nat),
  });
  const AuthordiedPrincipal = IDL.Record({
    'principal' : IDL.Principal,
    'name' : IDL.Text,
  });
  const InitArg = IDL.Record({
    'base_url' : IDL.Opt(IDL.Text),
    'cycles_management' : CyclesManagement,
    'test_mode' : IDL.Bool,
    'max_creation_retries' : IDL.Nat,
    'collection_request_fee' : IDL.Nat,
    'ogy_transfer_fee' : IDL.Nat,
    'authorized_principals' : IDL.Vec(AuthordiedPrincipal),
    'bank_principal_id' : IDL.Principal,
    'ledger_canister_id' : IDL.Principal,
    'mint_pricing' : IDL.Opt(MintPricingConfig),
    'commit_hash' : IDL.Text,
    'icpswap_pool_canister_id' : IDL.Opt(IDL.Principal),
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
    'ConcurrentRequest' : IDL.Null,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : CreateCollectionError });
  const CreateTemplateArgs = IDL.Record({ 'template_json' : IDL.Text });
  const CreateTemplateError = IDL.Variant({
    'JsonError' : IDL.Text,
    'LimitExceeded' : IDL.Record({ 'max_templates' : IDL.Nat }),
  });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : CreateTemplateError });
  const DeleteTemplateError = IDL.Variant({
    'UnauthorizedCall' : IDL.Null,
    'InvalidNftTemplateId' : IDL.Null,
  });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : DeleteTemplateError });
  const EstimateMintCostArgs = IDL.Record({
    'total_file_size_bytes' : IDL.Nat,
    'num_mints' : IDL.Nat64,
    'collection_canister_id' : IDL.Principal,
  });
  const MintCostBreakdown = IDL.Record({
    'storage_fee_usd_e8s' : IDL.Nat64,
    'base_fee_usd_e8s' : IDL.Nat64,
  });
  const MintCostEstimate = IDL.Record({
    'breakdown' : MintCostBreakdown,
    'total_usd_e8s' : IDL.Nat64,
    'ogy_usd_price_e8s' : IDL.Nat64,
    'total_ogy_e8s' : IDL.Nat64,
  });
  const EstimateMintCostError = IDL.Variant({
    'MintPricingNotConfigured' : IDL.Null,
    'OgyPriceNotAvailable' : IDL.Null,
  });
  const Result_3 = IDL.Variant({ 'Ok' : MintCostEstimate, 'Err' : EstimateMintCostError });
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
  const GetCollectionsForUserArgs = IDL.Record({
    'pagination' : PaginationArgs,
    'user' : IDL.Principal,
  });
  const GetMintRequestsByOwnerArgs = IDL.Record({
    'owner' : IDL.Principal,
    'offset' : IDL.Opt(IDL.Nat64),
    'limit' : IDL.Opt(IDL.Nat64),
  });
  const MintRequestStatus = IDL.Variant({
    'Initialized' : IDL.Null,
    'Refunded' : IDL.Record({ 'tx_index' : IDL.Nat }),
    'RefundRequested' : IDL.Null,
    'RefundFailed' : IDL.Record({ 'reason' : IDL.Text }),
    'Completed' : IDL.Null,
  });
  const UploadedFileInfo = IDL.Record({
    'file_path' : IDL.Text,
    'file_url' : IDL.Text,
    'file_size' : IDL.Nat64,
  });
  const MintRequestInfo = IDL.Record({
    'id' : IDL.Nat,
    'status' : MintRequestStatus,
    'updated_at' : IDL.Nat,
    'minted_count' : IDL.Nat,
    'uploaded_files' : IDL.Vec(UploadedFileInfo),
    'owner' : IDL.Principal,
    'allocated_bytes' : IDL.Nat,
    'created_at' : IDL.Nat,
    'bytes_uploaded' : IDL.Nat,
    'num_mints' : IDL.Nat,
    'collection_canister_id' : IDL.Principal,
    'ogy_charged' : IDL.Nat,
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
  const OgyPriceData = IDL.Record({
    'updated_at' : IDL.Nat64,
    'usd_per_ogy_e8s' : IDL.Nat64,
  });
  const GetTemplateByIdArgs = IDL.Record({ 'template_id' : IDL.Nat });
  const Template = IDL.Record({
    'template_json' : IDL.Text,
    'template_id' : IDL.Nat,
  });
  const GetTemplateByIdError = IDL.Variant({ 'TemplateNotFound' : IDL.Null });
  const Result_4 = IDL.Variant({ 'Ok' : Template, 'Err' : GetTemplateByIdError });
  const GetTemplateIdsByOwnerArgs = IDL.Record({ 'owner' : IDL.Principal });
  const TemplateIdsResult = IDL.Record({
    'template_ids' : IDL.Vec(IDL.Nat),
    'total_count' : IDL.Nat64,
  });
  const GetTemplatesByOwnerArgs = IDL.Record({
    'owner' : IDL.Principal,
    'pagination' : PaginationArgs,
  });
  const TemplatesResult = IDL.Record({
    'templates' : IDL.Vec(Template),
    'total_count' : IDL.Nat64,
  });
  const GetTemplatesByOwnerError = IDL.Variant({
    'UnauthorizedCall' : IDL.Null,
  });
  const Result_5 = IDL.Variant({
    'Ok' : TemplatesResult,
    'Err' : GetTemplatesByOwnerError,
  });
  const SupportedStandard = IDL.Record({
    'url' : IDL.Text,
    'name' : IDL.Text,
  });
  const Icrc21ConsentMessageMetadata = IDL.Record({
    'utc_offset_minutes' : IDL.Opt(IDL.Int16),
    'language' : IDL.Text,
  });
  const Icrc21DeviceSpec = IDL.Variant({
    'GenericDisplay' : IDL.Null,
    'FieldsDisplay' : IDL.Null,
  });
  const Icrc21ConsentMessageSpec = IDL.Record({
    'metadata' : Icrc21ConsentMessageMetadata,
    'device_spec' : IDL.Opt(Icrc21DeviceSpec),
  });
  const Icrc21ConsentMessageRequest = IDL.Record({
    'arg' : IDL.Vec(IDL.Nat8),
    'method' : IDL.Text,
    'user_preferences' : Icrc21ConsentMessageSpec,
  });
  const Icrc21FieldDisplayMessage = IDL.Record({
    'fields' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'intent' : IDL.Text,
  });
  const Icrc21ConsentMessage = IDL.Record({
    'generic_display_message' : IDL.Text,
    'fields_display_message' : Icrc21FieldDisplayMessage,
  });
  const Icrc21ConsentInfo = IDL.Record({
    'metadata' : Icrc21ConsentMessageMetadata,
    'consent_message' : Icrc21ConsentMessage,
  });
  const Icrc21ErrorInfo = IDL.Record({ 'description' : IDL.Text });
  const Icrc21GenericError = IDL.Record({
    'description' : IDL.Text,
    'error_code' : IDL.Nat64,
  });
  const Icrc21Error = IDL.Variant({
    'GenericError' : Icrc21ErrorInfo,
    'InsufficientPayment' : Icrc21GenericError,
    'UnsupportedCanisterCall' : Icrc21ErrorInfo,
    'ConsentMessageUnavailable' : Icrc21ErrorInfo,
  });
  // Result_6 (Icrc21ConsentMessageResponse) defined above
  const Icrc28TrustedOriginsResponse = IDL.Record({
    'trusted_origins' : IDL.Vec(IDL.Text),
  });
  const InitializeMintArgs = IDL.Record({
    'total_file_size_bytes' : IDL.Nat,
    'num_mints' : IDL.Nat64,
    'collection_canister_id' : IDL.Principal,
  });
  const InitializeMintError = IDL.Variant({
    'CollectionNotReady' : IDL.Null,
    'CallerNotCollectionOwner' : IDL.Null,
    'CollectionNotFound' : IDL.Null,
    'InvalidNumMints' : IDL.Null,
    'Generic' : GenericError,
    'TransferFromError' : TransferFromError,
    'OgyPriceNotAvailable' : IDL.Null,
  });
  const Result_6 = IDL.Variant({
    'Ok' : Icrc21ConsentInfo,
    'Err' : Icrc21Error,
  });
  const Result_7 = IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : InitializeMintError });
  const MintItemArg = IDL.Record({
    'metadata' : IDL.Vec(IDL.Tuple(IDL.Text, ICRC3Value_1)),
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'token_owner' : Account,
  });
  const MintNftsArgs = IDL.Record({
    'mint_items' : IDL.Vec(MintItemArg),
    'mint_request_id' : IDL.Nat64,
  });
  const MintNftsError = IDL.Variant({
    'MintError' : IDL.Text,
    'MintRequestNotFound' : IDL.Null,
    'MintLimitExceeded' : IDL.Record({
      'requested' : IDL.Nat,
      'already_minted' : IDL.Nat,
      'allowed' : IDL.Nat,
    }),
    'TooManyItems' : IDL.Record({ 'max' : IDL.Nat }),
    'Unauthorized' : IDL.Null,
    'MintRequestNotActive' : IDL.Null,
    'NoItemsProvided' : IDL.Null,
  });
  const Result_8 = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Nat), 'Err' : MintNftsError });
  const ProxyFinalizeUploadArgs = IDL.Record({
    'file_path' : IDL.Text,
    'mint_request_id' : IDL.Nat64,
  });
  const ProxyUploadError = IDL.Variant({
    'ByteLimitExceeded' : IDL.Record({
      'requested' : IDL.Nat,
      'allocated' : IDL.Nat,
      'used' : IDL.Nat,
    }),
    'MintRequestNotFound' : IDL.Null,
    'UploadError' : IDL.Text,
    'Unauthorized' : IDL.Null,
    'MintRequestNotActive' : IDL.Null,
  });
  const Result_9 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : ProxyUploadError });
  const ProxyInitUploadArgs = IDL.Record({
    'file_hash' : IDL.Text,
    'file_path' : IDL.Text,
    'file_size' : IDL.Nat64,
    'chunk_size' : IDL.Opt(IDL.Nat64),
    'mint_request_id' : IDL.Nat64,
  });
  const Result_10 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : ProxyUploadError });
  const ProxyStoreChunkArgs = IDL.Record({
    'chunk_id' : IDL.Nat,
    'file_path' : IDL.Text,
    'chunk_data' : IDL.Vec(IDL.Nat8),
    'mint_request_id' : IDL.Nat64,
  });
  const ProxyLogoFinalizeUploadArgs = IDL.Record({
    'file_path' : IDL.Text,
    'collection_canister_id' : IDL.Principal,
  });
  const ProxyLogoInitUploadArgs = IDL.Record({
    'file_hash' : IDL.Text,
    'file_path' : IDL.Text,
    'file_size' : IDL.Nat64,
    'collection_canister_id' : IDL.Principal,
    'chunk_size' : IDL.Opt(IDL.Nat64),
  });
  const ProxyLogoStoreChunkArgs = IDL.Record({
    'chunk_id' : IDL.Nat,
    'file_path' : IDL.Text,
    'collection_canister_id' : IDL.Principal,
    'chunk_data' : IDL.Vec(IDL.Nat8),
  });
  const ProxyLogoUploadError = IDL.Variant({
    'CollectionNotReady' : IDL.Null,
    'CollectionNotFound' : IDL.Null,
    'FileTooLarge' : IDL.Record({ 'requested' : IDL.Nat64, 'max_bytes' : IDL.Nat64 }),
    'UploadError' : IDL.Text,
    'Unauthorized' : IDL.Null,
  });
  const Result_11 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : ProxyLogoUploadError });
  const Result_12 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : ProxyLogoUploadError });
  const RequestMintRefundArgs = IDL.Record({
    'mint_request_id' : IDL.Nat64,
  });
  const RefundError = IDL.Variant({
    'MintRequestNotFound' : IDL.Null,
    'NotInRefundableState' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'AlreadyRefunded' : IDL.Null,
    'CreditsAlreadyUsed' : IDL.Null,
  });
  const Result_13 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : RefundError });
  const UpdateTemplateArgs = IDL.Record({
    'new_tempalte_json' : IDL.Text,
    'template_id' : IDL.Nat,
  });
  const UpdateTemplateError = IDL.Variant({
    'UnauthorizedCall' : IDL.Null,
    'InvalidNftTemplateId' : IDL.Null,
    'JsonError' : IDL.Text,
    'TemplateNotFound' : IDL.Null,
  });
  const Result_14 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : UpdateTemplateError });
  const MemorySize = IDL.Record({ 'stable' : IDL.Nat64, 'heap' : IDL.Nat64 });
  const CanisterInfo = IDL.Record({
    'test_mode' : IDL.Bool,
    'memory_used' : MemorySize,
    'now_nanos' : IDL.Nat64,
    'cycles_balance_in_tc' : IDL.Float64,
  });
  const Metrics = IDL.Record({
    'next_template_id' : IDL.Nat,
    'origyn_nft_wasm_hash' : IDL.Text,
    'cycles_management' : CyclesManagement,
    'max_creation_retries' : IDL.Nat,
    'collection_request_fee' : IDL.Nat,
    'ogy_to_burn' : IDL.Nat,
    'ogy_transfer_fee' : IDL.Nat,
    'authorized_principals' : IDL.Vec(AuthordiedPrincipal),
    'total_ogy_burned' : IDL.Nat,
    'bank_principal_id' : IDL.Principal,
    'ledger_canister_id' : IDL.Principal,
    'canister_info' : CanisterInfo,
    'max_template_per_owner' : IDL.Nat,
  });
  return IDL.Service({
    'create_collection' : IDL.Func([CreateCollectionArgs], [Result], []),
    'create_template' : IDL.Func([CreateTemplateArgs], [Result_1], []),
    'delete_template' : IDL.Func([IDL.Nat], [Result_2], []),
    'estimate_mint_cost' : IDL.Func(
        [EstimateMintCostArgs],
        [Result_3],
        ['query'],
      ),
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
    'get_collections_for_user' : IDL.Func(
        [GetCollectionsForUserArgs],
        [CollectionsResult],
        ['composite_query'],
      ),
    'get_metrics' : IDL.Func([], [Metrics], ['query']),
    'get_mint_request' : IDL.Func(
        [IDL.Nat64],
        [IDL.Opt(MintRequestInfo)],
        ['query'],
      ),
    'get_mint_requests_by_owner' : IDL.Func(
        [GetMintRequestsByOwnerArgs],
        [IDL.Vec(MintRequestInfo)],
        ['query'],
      ),
    'get_nft_details' : IDL.Func(
        [GetNftDetailsArgs],
        [IDL.Vec(NftDetails)],
        ['composite_query'],
      ),
    'get_ogy_usd_price' : IDL.Func([], [IDL.Opt(OgyPriceData)], ['query']),
    'get_template_by_id' : IDL.Func(
        [GetTemplateByIdArgs],
        [Result_4],
        ['query'],
      ),
    'get_template_ids_by_owner' : IDL.Func(
        [GetTemplateIdsByOwnerArgs],
        [TemplateIdsResult],
        ['query'],
      ),
    'get_templates_by_owner' : IDL.Func(
        [GetTemplatesByOwnerArgs],
        [Result_5],
        ['query'],
      ),
    'icrc10_supported_standards' : IDL.Func(
        [],
        [IDL.Vec(SupportedStandard)],
        ['query'],
      ),
    'icrc21_canister_call_consent_message' : IDL.Func(
        [Icrc21ConsentMessageRequest],
        [Result_6],
        [],
      ),
    'icrc28_trusted_origins' : IDL.Func(
        [],
        [Icrc28TrustedOriginsResponse],
        ['query'],
      ),
    'initialize_mint' : IDL.Func([InitializeMintArgs], [Result_7], []),
    'list_all_collections' : IDL.Func(
        [PaginationArgs],
        [CollectionsResult],
        ['query'],
      ),
    'mint_nfts' : IDL.Func([MintNftsArgs], [Result_8], []),
    'proxy_finalize_upload' : IDL.Func(
        [ProxyFinalizeUploadArgs],
        [Result_9],
        [],
      ),
    'proxy_init_upload' : IDL.Func([ProxyInitUploadArgs], [Result_10], []),
    'proxy_logo_finalize_upload' : IDL.Func(
        [ProxyLogoFinalizeUploadArgs],
        [Result_11],
        [],
      ),
    'proxy_logo_init_upload' : IDL.Func([ProxyLogoInitUploadArgs], [Result_12], []),
    'proxy_logo_store_chunk' : IDL.Func([ProxyLogoStoreChunkArgs], [Result_12], []),
    'proxy_store_chunk' : IDL.Func([ProxyStoreChunkArgs], [Result_10], []),
    'request_mint_refund' : IDL.Func([RequestMintRefundArgs], [Result_13], []),
    'update_template' : IDL.Func([UpdateTemplateArgs], [Result_14], []),
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
  const MintPricingConfig = IDL.Record({
    'storage_fee_per_mb_usd_e8s' : IDL.Nat64,
    'base_mint_fee_usd_e8s' : IDL.Nat64,
  });
  const UpgradeArgs = IDL.Record({
    'origyn_nft_wasm_hash' : IDL.Opt(IDL.Text),
    'cycles_management' : IDL.Opt(CyclesManagement),
    'max_creation_retries' : IDL.Opt(IDL.Nat),
    'collection_request_fee' : IDL.Opt(IDL.Nat),
    'new_authorized_principals' : IDL.Opt(IDL.Vec(IDL.Record({
      'principal' : IDL.Principal,
      'name' : IDL.Text,
    }))),
    'ogy_transfer_fee' : IDL.Opt(IDL.Nat),
    'bank_principal_id' : IDL.Opt(IDL.Principal),
    'ledger_canister_id' : IDL.Opt(IDL.Principal),
    'mint_pricing' : IDL.Opt(MintPricingConfig),
    'commit_hash' : IDL.Text,
    'build_version' : BuildVersion,
    'icpswap_pool_canister_id' : IDL.Opt(IDL.Principal),
    'max_template_per_owner' : IDL.Opt(IDL.Nat),
  });
  const AuthordiedPrincipal = IDL.Record({
    'principal' : IDL.Principal,
    'name' : IDL.Text,
  });
  const InitArg = IDL.Record({
    'base_url' : IDL.Opt(IDL.Text),
    'cycles_management' : CyclesManagement,
    'test_mode' : IDL.Bool,
    'max_creation_retries' : IDL.Nat,
    'collection_request_fee' : IDL.Nat,
    'ogy_transfer_fee' : IDL.Nat,
    'authorized_principals' : IDL.Vec(AuthordiedPrincipal),
    'bank_principal_id' : IDL.Principal,
    'ledger_canister_id' : IDL.Principal,
    'mint_pricing' : IDL.Opt(MintPricingConfig),
    'commit_hash' : IDL.Text,
    'icpswap_pool_canister_id' : IDL.Opt(IDL.Principal),
    'max_template_per_owner' : IDL.Nat,
  });
  const ClaimlinkArgs = IDL.Variant({
    'UpgradeArg' : UpgradeArgs,
    'InitArg' : InitArg,
  });
  return [ClaimlinkArgs];
};
