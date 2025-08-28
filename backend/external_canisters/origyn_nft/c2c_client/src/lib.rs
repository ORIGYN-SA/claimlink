use bity_ic_canister_client::generate_candid_c2c_call;
use origyn_nft_canister_api::*;

// ICRC10
generate_candid_c2c_call!(icrc10_supported_standards);

// ICRC21
generate_candid_c2c_call!(icrc21_canister_call_consent_message);

// ICRC3
generate_candid_c2c_call!(icrc3_get_archives);
generate_candid_c2c_call!(icrc3_get_blocks);
generate_candid_c2c_call!(icrc3_get_properties);
generate_candid_c2c_call!(icrc3_get_tip_certificate);
generate_candid_c2c_call!(icrc3_supported_block_types);

// ICRC37
generate_candid_c2c_call!(icrc37_approve_tokens);
generate_candid_c2c_call!(icrc37_approve_collection);
generate_candid_c2c_call!(icrc37_revoke_token_approvals);
generate_candid_c2c_call!(icrc37_revoke_collection_approvals);
generate_candid_c2c_call!(icrc37_transfer_from);
generate_candid_c2c_call!(icrc37_is_approved);
generate_candid_c2c_call!(icrc37_max_approvals_per_token_or_collection);
generate_candid_c2c_call!(icrc37_max_revoke_approvals);

// icrc37_get_token_approvals
// icrc37_get_collection_approval

// ICRC7
generate_candid_c2c_call!(icrc7_transfer);
generate_candid_c2c_call!(icrc7_collection_metadata);
generate_candid_c2c_call!(icrc7_balance_of);
generate_candid_c2c_call!(icrc7_owner_of);
generate_candid_c2c_call!(icrc7_token_metadata);
generate_candid_c2c_call!(icrc7_atomic_batch_transfers);
generate_candid_c2c_call!(icrc7_default_take_value);
generate_candid_c2c_call!(icrc7_max_memo_size);
generate_candid_c2c_call!(icrc7_description);
generate_candid_c2c_call!(icrc7_logo);
generate_candid_c2c_call!(icrc7_max_query_batch_size);
generate_candid_c2c_call!(icrc7_max_take_value);
generate_candid_c2c_call!(icrc7_max_update_batch_size);
generate_candid_c2c_call!(icrc7_name);
generate_candid_c2c_call!(icrc7_permitted_drift);
generate_candid_c2c_call!(icrc7_supply_cap);
generate_candid_c2c_call!(icrc7_symbol);
generate_candid_c2c_call!(icrc7_total_supply);
generate_candid_c2c_call!(icrc7_tx_window);

// icrc7_tokens_of
// icrc7_tokens

// Management methods
generate_candid_c2c_call!(mint);
generate_candid_c2c_call!(burn_nft);
generate_candid_c2c_call!(update_nft_metadata);
generate_candid_c2c_call!(update_minting_authorities);
generate_candid_c2c_call!(remove_minting_authorities);
generate_candid_c2c_call!(update_authorized_principals);
generate_candid_c2c_call!(remove_authorized_principals);
generate_candid_c2c_call!(get_upload_status);
generate_candid_c2c_call!(update_collection_metadata);
generate_candid_c2c_call!(init_upload);
generate_candid_c2c_call!(store_chunk);
generate_candid_c2c_call!(finalize_upload);
generate_candid_c2c_call!(cancel_upload);

// get_all_uploads
