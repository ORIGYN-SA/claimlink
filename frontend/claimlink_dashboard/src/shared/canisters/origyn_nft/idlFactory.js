export const idlFactory = ({ IDL }) => {
  const GetBlocksResult = IDL.Rec();
  const ICRC3Value = IDL.Rec();
  const BuildVersion = IDL.Record({
    'major' : IDL.Nat32,
    'minor' : IDL.Nat32,
    'patch' : IDL.Nat32,
  });
  const UpgradeArgs = IDL.Record({
    'version' : BuildVersion,
    'commit_hash' : IDL.Text,
  });
  ICRC3Value.fill(
    IDL.Variant({
      'Int' : IDL.Int,
      'Map' : IDL.Vec(IDL.Tuple(IDL.Text, ICRC3Value)),
      'Nat' : IDL.Nat,
      'Blob' : IDL.Vec(IDL.Nat8),
      'Text' : IDL.Text,
      'Array' : IDL.Vec(ICRC3Value),
    })
  );
  const CustomValue = IDL.Variant({
    'Int' : IDL.Int,
    'Map' : IDL.Vec(IDL.Tuple(IDL.Text, ICRC3Value)),
    'Nat' : IDL.Nat,
    'Blob' : IDL.Vec(IDL.Nat8),
    'Text' : IDL.Text,
    'Array' : IDL.Vec(ICRC3Value),
  });
  const InitApprovalsArg = IDL.Record({
    'max_approvals_per_token_or_collection' : IDL.Opt(IDL.Nat),
    'max_revoke_approvals' : IDL.Opt(IDL.Nat),
  });
  const InitArgs = IDL.Record({
    'supply_cap' : IDL.Opt(IDL.Nat),
    'tx_window' : IDL.Opt(IDL.Nat),
    'test_mode' : IDL.Bool,
    'default_take_value' : IDL.Opt(IDL.Nat),
    'max_canister_storage_threshold' : IDL.Opt(IDL.Nat),
    'logo' : IDL.Opt(IDL.Text),
    'permitted_drift' : IDL.Opt(IDL.Nat),
    'name' : IDL.Text,
    'minting_authorities' : IDL.Vec(IDL.Principal),
    'description' : IDL.Opt(IDL.Text),
    'authorized_principals' : IDL.Vec(IDL.Principal),
    'version' : BuildVersion,
    'max_take_value' : IDL.Opt(IDL.Nat),
    'max_update_batch_size' : IDL.Opt(IDL.Nat),
    'max_query_batch_size' : IDL.Opt(IDL.Nat),
    'commit_hash' : IDL.Text,
    'max_memo_size' : IDL.Opt(IDL.Nat),
    'atomic_batch_transfers' : IDL.Opt(IDL.Bool),
    'collection_metadata' : IDL.Vec(IDL.Tuple(IDL.Text, CustomValue)),
    'symbol' : IDL.Text,
    'approval_init' : InitApprovalsArg,
  });
  const Args_8 = IDL.Variant({ 'Upgrade' : UpgradeArgs, 'Init' : InitArgs });
  const BurnNftError = IDL.Variant({
    'StorageCanisterError' : IDL.Text,
    'TokenDoesNotExist' : IDL.Null,
    'ConcurrentManagementCall' : IDL.Null,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : BurnNftError });
  const Args = IDL.Record({ 'file_path' : IDL.Text });
  const CancelUploadError = IDL.Variant({ 'UploadNotInitialized' : IDL.Null });
  const Result_1 = IDL.Variant({
    'Ok' : IDL.Record({}),
    'Err' : CancelUploadError,
  });
  const FinalizeUploadResp = IDL.Record({ 'url' : IDL.Text });
  const FinalizeUploadError = IDL.Variant({
    'IncompleteUpload' : IDL.Null,
    'FileSizeMismatch' : IDL.Null,
    'FileHashMismatch' : IDL.Null,
    'UploadNotStarted' : IDL.Null,
    'UploadAlreadyFinalized' : IDL.Null,
  });
  const Result_2 = IDL.Variant({
    'Ok' : FinalizeUploadResp,
    'Err' : FinalizeUploadError,
  });
  const UploadState = IDL.Variant({
    'Init' : IDL.Null,
    'Finalized' : IDL.Null,
    'InProgress' : IDL.Null,
  });
  const GetAllUploadsError = IDL.Variant({ 'StorageCanisterError' : IDL.Text });
  const Result_3 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Text, UploadState)),
    'Err' : GetAllUploadsError,
  });
  const GetUploadStatusError = IDL.Variant({
    'StorageCanisterError' : IDL.Text,
    'UploadNotFound' : IDL.Null,
  });
  const Result_4 = IDL.Variant({
    'Ok' : UploadState,
    'Err' : GetUploadStatusError,
  });
  const SupportedStandard = IDL.Record({ 'url' : IDL.Text, 'name' : IDL.Text });
  const icrc21_consent_message_metadata = IDL.Record({
    'utc_offset_minutes' : IDL.Opt(IDL.Int16),
    'language' : IDL.Text,
  });
  const icrc21_device_spec = IDL.Variant({
    'GenericDisplay' : IDL.Null,
    'FieldsDisplay' : IDL.Null,
  });
  const icrc21_consent_message_spec = IDL.Record({
    'metadata' : icrc21_consent_message_metadata,
    'device_spec' : IDL.Opt(icrc21_device_spec),
  });
  const icrc21_consent_message_request = IDL.Record({
    'arg' : IDL.Vec(IDL.Nat8),
    'method' : IDL.Text,
    'user_preferences' : icrc21_consent_message_spec,
  });
  const icrc21_field_display_message = IDL.Record({
    'fields' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'intent' : IDL.Text,
  });
  const icrc21_consent_message = IDL.Record({
    'generic_display_message' : IDL.Text,
    'fields_display_message' : icrc21_field_display_message,
  });
  const icrc21_consent_info = IDL.Record({
    'metadata' : icrc21_consent_message_metadata,
    'consent_message' : icrc21_consent_message,
  });
  const icrc21_error_info = IDL.Record({ 'description' : IDL.Text });
  const icrc21_generic_error = IDL.Record({
    'description' : IDL.Text,
    'error_code' : IDL.Nat64,
  });
  const icrc21_error = IDL.Variant({
    'GenericError' : icrc21_error_info,
    'InsufficientPayment' : icrc21_generic_error,
    'UnsupportedCanisterCall' : icrc21_error_info,
    'ConsentMessageUnavailable' : icrc21_error_info,
  });
  const icrc21_consent_message_response = IDL.Variant({
    'Ok' : icrc21_consent_info,
    'Err' : icrc21_error,
  });
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const ApprovalInfo = IDL.Record({
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Nat64,
    'expires_at' : IDL.Opt(IDL.Nat64),
    'spender' : Account,
  });
  const ApproveCollectionArg = IDL.Record({ 'approval_info' : ApprovalInfo });
  const ApproveCollectionError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'InvalidSpender' : IDL.Null,
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'GenericBatchError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TooOld' : IDL.Null,
  });
  const ApproveCollectionResult = IDL.Variant({
    'Ok' : IDL.Nat,
    'Err' : ApproveCollectionError,
  });
  const Result_5 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Opt(ApproveCollectionResult)),
    'Err' : ApproveCollectionError,
  });
  const ApproveTokenArg = IDL.Record({
    'token_id' : IDL.Nat,
    'approval_info' : ApprovalInfo,
  });
  const ApproveTokenError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'InvalidSpender' : IDL.Null,
    'NonExistingTokenId' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'GenericBatchError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TooOld' : IDL.Null,
  });
  const ApproveTokenResult = IDL.Variant({
    'Ok' : IDL.Nat,
    'Err' : ApproveTokenError,
  });
  const Result_6 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Opt(ApproveTokenResult)),
    'Err' : ApproveTokenError,
  });
  const IsApprovedArg = IDL.Record({
    'token_id' : IDL.Nat,
    'from_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'spender' : Account,
  });
  const RevokeCollectionApprovalArg = IDL.Record({
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'spender' : IDL.Opt(Account),
  });
  const RevokeCollectionApprovalError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'ApprovalDoesNotExist' : IDL.Null,
    'GenericBatchError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TooOld' : IDL.Null,
  });
  const RevokeCollectionApprovalResult = IDL.Variant({
    'Ok' : IDL.Nat,
    'Err' : RevokeCollectionApprovalError,
  });
  const Result_7 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Opt(RevokeCollectionApprovalResult)),
    'Err' : RevokeCollectionApprovalError,
  });
  const RevokeTokenApprovalArg = IDL.Record({
    'token_id' : IDL.Nat,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'spender' : IDL.Opt(Account),
  });
  const RevokeTokenApprovalError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'NonExistingTokenId' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'ApprovalDoesNotExist' : IDL.Null,
    'GenericBatchError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TooOld' : IDL.Null,
  });
  const RevokeTokenApprovalResponse = IDL.Variant({
    'Ok' : IDL.Nat,
    'Err' : RevokeTokenApprovalError,
  });
  const Result_8 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Opt(RevokeTokenApprovalResponse)),
    'Err' : RevokeTokenApprovalError,
  });
  const TransferFromArg = IDL.Record({
    'to' : Account,
    'spender_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'token_id' : IDL.Nat,
    'from' : Account,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
  });
  const TransferFromError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'NonExistingTokenId' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'InvalidRecipient' : IDL.Null,
    'GenericBatchError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TooOld' : IDL.Null,
  });
  const TransferFromResult = IDL.Variant({
    'Ok' : IDL.Nat,
    'Err' : TransferFromError,
  });
  const Result_9 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Opt(TransferFromResult)),
    'Err' : TransferFromError,
  });
  const ICRC3ArchiveInfo = IDL.Record({
    'end' : IDL.Nat,
    'canister_id' : IDL.Principal,
    'start' : IDL.Nat,
  });
  const GetBlocksRequest = IDL.Record({
    'start' : IDL.Nat,
    'length' : IDL.Nat,
  });
  const BlockWithId = IDL.Record({ 'id' : IDL.Nat, 'block' : ICRC3Value });
  const ArchivedBlocks = IDL.Record({
    'args' : IDL.Vec(GetBlocksRequest),
    'callback' : IDL.Func(
        [IDL.Vec(GetBlocksRequest)],
        [GetBlocksResult],
        ['query'],
      ),
  });
  GetBlocksResult.fill(
    IDL.Record({
      'log_length' : IDL.Nat,
      'blocks' : IDL.Vec(BlockWithId),
      'archived_blocks' : IDL.Vec(ArchivedBlocks),
    })
  );
  const Duration = IDL.Record({ 'secs' : IDL.Nat64, 'nanos' : IDL.Nat32 });
  const ICRC3Properties = IDL.Record({
    'max_blocks_per_response' : IDL.Nat,
    'initial_cycles' : IDL.Nat,
    'tx_window' : Duration,
    'max_transactions_to_purge' : IDL.Nat,
    'max_memory_size_bytes' : IDL.Nat,
    'ttl_for_non_archived_transactions' : Duration,
    'max_transactions_in_window' : IDL.Nat,
    'max_unarchived_transactions' : IDL.Nat,
    'reserved_cycles' : IDL.Nat,
  });
  const ICRC3DataCertificate = IDL.Record({
    'certificate' : IDL.Vec(IDL.Nat8),
    'hash_tree' : IDL.Vec(IDL.Nat8),
  });
  const SupportedBlockType = IDL.Record({
    'url' : IDL.Text,
    'block_type' : IDL.Text,
  });
  const TransferArg = IDL.Record({
    'to' : Account,
    'token_id' : IDL.Nat,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
  });
  const TransferError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'NonExistingTokenId' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat }),
    'InvalidRecipient' : IDL.Null,
    'GenericBatchError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TooOld' : IDL.Null,
  });
  const Result_10 = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : TransferError });
  const Args_1 = IDL.Record({
    'file_hash' : IDL.Text,
    'file_path' : IDL.Text,
    'file_size' : IDL.Nat64,
    'chunk_size' : IDL.Opt(IDL.Nat64),
  });
  const InitUploadError = IDL.Variant({
    'ConcurrentManagementCall' : IDL.Null,
    'FileAlreadyExists' : IDL.Null,
    'StorageCanisterError' : IDL.Text,
  });
  const Result_11 = IDL.Variant({
    'Ok' : IDL.Record({}),
    'Err' : InitUploadError,
  });
  const MintRequest = IDL.Record({
    'metadata' : IDL.Vec(IDL.Tuple(IDL.Text, ICRC3Value)),
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'token_owner' : Account,
  });
  const Args_2 = IDL.Record({
    'mint_requests' : IDL.Vec(MintRequest),
  });
  const MintError = IDL.Variant({
    'TokenAlreadyExists' : IDL.Null,
    'StorageCanisterError' : IDL.Text,
    'ExceedMaxAllowedSupplyCap' : IDL.Null,
    'InvalidMemo' : IDL.Null,
    'ConcurrentManagementCall' : IDL.Null,
  });
  const Result_12 = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : MintError });
  const Args_3 = IDL.Record({
    'authorized_principals' : IDL.Vec(IDL.Principal),
  });
  const RemoveAuthorizedPrincipalsError = IDL.Variant({
    'StorageCanisterError' : IDL.Text,
    'ConcurrentManagementCall' : IDL.Null,
  });
  const Result_13 = IDL.Variant({
    'Ok' : IDL.Null,
    'Err' : RemoveAuthorizedPrincipalsError,
  });
  const Args_4 = IDL.Record({ 'minting_authorities' : IDL.Vec(IDL.Principal) });
  const RemoveMintingAuthoritiesError = IDL.Variant({
    'StorageCanisterError' : IDL.Text,
    'ConcurrentManagementCall' : IDL.Null,
  });
  const Result_14 = IDL.Variant({
    'Ok' : IDL.Null,
    'Err' : RemoveMintingAuthoritiesError,
  });
  const Args_5 = IDL.Record({
    'chunk_id' : IDL.Nat,
    'file_path' : IDL.Text,
    'chunk_data' : IDL.Vec(IDL.Nat8),
  });
  const StoreChunkError = IDL.Variant({
    'InvalidFileHash' : IDL.Null,
    'InvalidFilePath' : IDL.Null,
    'InvalidFileSize' : IDL.Null,
    'InvalidChunkId' : IDL.Null,
    'UploadNotInitialized' : IDL.Null,
    'InvalidChunkData' : IDL.Null,
    'InvalidFileFormat' : IDL.Null,
    'UploadAlreadyFinalized' : IDL.Null,
  });
  const Result_15 = IDL.Variant({
    'Ok' : IDL.Record({}),
    'Err' : StoreChunkError,
  });
  const Args_6 = IDL.Record({
    'supply_cap' : IDL.Opt(IDL.Nat),
    'tx_window' : IDL.Opt(IDL.Nat),
    'default_take_value' : IDL.Opt(IDL.Nat),
    'max_canister_storage_threshold' : IDL.Opt(IDL.Nat),
    'logo' : IDL.Opt(IDL.Text),
    'permitted_drift' : IDL.Opt(IDL.Nat),
    'name' : IDL.Opt(IDL.Text),
    'description' : IDL.Opt(IDL.Text),
    'max_take_value' : IDL.Opt(IDL.Nat),
    'max_update_batch_size' : IDL.Opt(IDL.Nat),
    'max_query_batch_size' : IDL.Opt(IDL.Nat),
    'max_memo_size' : IDL.Opt(IDL.Nat),
    'atomic_batch_transfers' : IDL.Opt(IDL.Bool),
    'collection_metadata' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, CustomValue))),
    'symbol' : IDL.Opt(IDL.Text),
  });
  const Args_7 = IDL.Record({
    'token_id' : IDL.Nat,
    'metadata' : IDL.Vec(IDL.Tuple(IDL.Text, CustomValue)),
  });
  const Result_16 = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : BurnNftError });
  return IDL.Service({
    'burn_nft' : IDL.Func([IDL.Nat], [Result], []),
    'cancel_upload' : IDL.Func([Args], [Result_1], []),
    'finalize_upload' : IDL.Func([Args], [Result_2], []),
    'get_all_storage_subcanisters' : IDL.Func(
        [],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'get_all_uploads' : IDL.Func(
        [IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [Result_3],
        ['query'],
      ),
    'get_upload_status' : IDL.Func([IDL.Text], [Result_4], ['query']),
    'icrc10_supported_standards' : IDL.Func(
        [],
        [IDL.Vec(SupportedStandard)],
        ['query'],
      ),
    'icrc21_canister_call_consent_message' : IDL.Func(
        [icrc21_consent_message_request],
        [icrc21_consent_message_response],
        ['query'],
      ),
    'icrc37_approve_collection' : IDL.Func(
        [IDL.Vec(ApproveCollectionArg)],
        [Result_5],
        [],
      ),
    'icrc37_approve_tokens' : IDL.Func(
        [IDL.Vec(ApproveTokenArg)],
        [Result_6],
        [],
      ),
    'icrc37_get_collection_approvals' : IDL.Func(
        [Account, IDL.Opt(ApproveCollectionArg), IDL.Opt(IDL.Nat)],
        [IDL.Vec(ApproveCollectionArg)],
        ['query'],
      ),
    'icrc37_get_token_approvals' : IDL.Func(
        [IDL.Nat, IDL.Opt(ApproveTokenArg), IDL.Opt(IDL.Nat)],
        [IDL.Vec(ApproveTokenArg)],
        ['query'],
      ),
    'icrc37_is_approved' : IDL.Func(
        [IDL.Vec(IsApprovedArg)],
        [IDL.Vec(IDL.Bool)],
        ['query'],
      ),
    'icrc37_max_approvals_per_token_or_collection' : IDL.Func(
        [],
        [IDL.Opt(IDL.Nat)],
        ['query'],
      ),
    'icrc37_max_revoke_approvals' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc37_revoke_collection_approvals' : IDL.Func(
        [IDL.Vec(RevokeCollectionApprovalArg)],
        [Result_7],
        [],
      ),
    'icrc37_revoke_token_approvals' : IDL.Func(
        [IDL.Vec(RevokeTokenApprovalArg)],
        [Result_8],
        [],
      ),
    'icrc37_transfer_from' : IDL.Func(
        [IDL.Vec(TransferFromArg)],
        [Result_9],
        [],
      ),
    'icrc3_get_archives' : IDL.Func(
        [IDL.Null],
        [IDL.Vec(ICRC3ArchiveInfo)],
        ['query'],
      ),
    'icrc3_get_blocks' : IDL.Func(
        [IDL.Vec(GetBlocksRequest)],
        [GetBlocksResult],
        ['query'],
      ),
    'icrc3_get_properties' : IDL.Func([IDL.Null], [ICRC3Properties], ['query']),
    'icrc3_get_tip_certificate' : IDL.Func(
        [IDL.Null],
        [ICRC3DataCertificate],
        ['query'],
      ),
    'icrc3_supported_block_types' : IDL.Func(
        [IDL.Null],
        [IDL.Vec(SupportedBlockType)],
        ['query'],
      ),
    'icrc7_atomic_batch_transfers' : IDL.Func(
        [],
        [IDL.Opt(IDL.Bool)],
        ['query'],
      ),
    'icrc7_balance_of' : IDL.Func(
        [IDL.Vec(Account)],
        [IDL.Vec(IDL.Nat)],
        ['query'],
      ),
    'icrc7_collection_metadata' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, ICRC3Value))],
        ['query'],
      ),
    'icrc7_default_take_value' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_description' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'icrc7_logo' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'icrc7_max_memo_size' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_max_query_batch_size' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_max_take_value' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_max_update_batch_size' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_name' : IDL.Func([], [IDL.Text], ['query']),
    'icrc7_owner_of' : IDL.Func(
        [IDL.Vec(IDL.Nat)],
        [IDL.Vec(IDL.Opt(Account))],
        ['query'],
      ),
    'icrc7_permitted_drift' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_supply_cap' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_symbol' : IDL.Func([], [IDL.Text], ['query']),
    'icrc7_token_metadata' : IDL.Func(
        [IDL.Vec(IDL.Nat)],
        [IDL.Vec(IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, ICRC3Value))))],
        ['query'],
      ),
    'icrc7_tokens' : IDL.Func(
        [IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [IDL.Vec(IDL.Nat)],
        ['query'],
      ),
    'icrc7_tokens_of' : IDL.Func(
        [Account, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [IDL.Vec(IDL.Nat)],
        ['query'],
      ),
    'icrc7_total_supply' : IDL.Func([], [IDL.Nat], ['query']),
    'icrc7_transfer' : IDL.Func(
        [IDL.Vec(TransferArg)],
        [IDL.Vec(IDL.Opt(Result_10))],
        [],
      ),
    'icrc7_tx_window' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'init_upload' : IDL.Func([Args_1], [Result_11], []),
    'mint' : IDL.Func([Args_2], [Result_12], []),
    'remove_authorized_principals' : IDL.Func([Args_3], [Result_13], []),
    'remove_minting_authorities' : IDL.Func([Args_4], [Result_14], []),
    'store_chunk' : IDL.Func([Args_5], [Result_15], []),
    'update_authorized_principals' : IDL.Func([Args_3], [Result_14], []),
    'update_collection_metadata' : IDL.Func([Args_6], [Result_14], []),
    'update_minting_authorities' : IDL.Func([Args_4], [Result_14], []),
    'update_nft_metadata' : IDL.Func([Args_7], [Result_16], []),
  });
};
export const init = ({ IDL }) => {
  const ICRC3Value = IDL.Rec();
  const BuildVersion = IDL.Record({
    'major' : IDL.Nat32,
    'minor' : IDL.Nat32,
    'patch' : IDL.Nat32,
  });
  const UpgradeArgs = IDL.Record({
    'version' : BuildVersion,
    'commit_hash' : IDL.Text,
  });
  ICRC3Value.fill(
    IDL.Variant({
      'Int' : IDL.Int,
      'Map' : IDL.Vec(IDL.Tuple(IDL.Text, ICRC3Value)),
      'Nat' : IDL.Nat,
      'Blob' : IDL.Vec(IDL.Nat8),
      'Text' : IDL.Text,
      'Array' : IDL.Vec(ICRC3Value),
    })
  );
  const CustomValue = IDL.Variant({
    'Int' : IDL.Int,
    'Map' : IDL.Vec(IDL.Tuple(IDL.Text, ICRC3Value)),
    'Nat' : IDL.Nat,
    'Blob' : IDL.Vec(IDL.Nat8),
    'Text' : IDL.Text,
    'Array' : IDL.Vec(ICRC3Value),
  });
  const InitApprovalsArg = IDL.Record({
    'max_approvals_per_token_or_collection' : IDL.Opt(IDL.Nat),
    'max_revoke_approvals' : IDL.Opt(IDL.Nat),
  });
  const InitArgs = IDL.Record({
    'supply_cap' : IDL.Opt(IDL.Nat),
    'tx_window' : IDL.Opt(IDL.Nat),
    'test_mode' : IDL.Bool,
    'default_take_value' : IDL.Opt(IDL.Nat),
    'max_canister_storage_threshold' : IDL.Opt(IDL.Nat),
    'logo' : IDL.Opt(IDL.Text),
    'permitted_drift' : IDL.Opt(IDL.Nat),
    'name' : IDL.Text,
    'minting_authorities' : IDL.Vec(IDL.Principal),
    'description' : IDL.Opt(IDL.Text),
    'authorized_principals' : IDL.Vec(IDL.Principal),
    'version' : BuildVersion,
    'max_take_value' : IDL.Opt(IDL.Nat),
    'max_update_batch_size' : IDL.Opt(IDL.Nat),
    'max_query_batch_size' : IDL.Opt(IDL.Nat),
    'commit_hash' : IDL.Text,
    'max_memo_size' : IDL.Opt(IDL.Nat),
    'atomic_batch_transfers' : IDL.Opt(IDL.Bool),
    'collection_metadata' : IDL.Vec(IDL.Tuple(IDL.Text, CustomValue)),
    'symbol' : IDL.Text,
    'approval_init' : InitApprovalsArg,
  });
  const Args_8 = IDL.Variant({ 'Upgrade' : UpgradeArgs, 'Init' : InitArgs });
  return [Args_8];
};
