use crate::{generate_query_call, generate_update_call};

use origyn_nft_canister_api::types::icrc3::{
    icrc3_get_archives, icrc3_get_blocks, icrc3_get_properties, icrc3_get_tip_certificate,
    icrc3_supported_block_types,
};
use origyn_nft_canister_api::types::icrc37::{
    icrc37_approve_collection, icrc37_approve_tokens, icrc37_is_approved,
    icrc37_max_approvals_per_token_or_collection, icrc37_max_revoke_approvals,
    icrc37_revoke_collection_approvals, icrc37_revoke_token_approvals, icrc37_transfer_from,
};
use origyn_nft_canister_api::types::icrc7::{
    icrc7_atomic_batch_transfers, icrc7_balance_of, icrc7_collection_metadata,
    icrc7_default_take_value, icrc7_description, icrc7_logo, icrc7_max_memo_size,
    icrc7_max_query_batch_size, icrc7_max_take_value, icrc7_max_update_batch_size, icrc7_name,
    icrc7_owner_of, icrc7_permitted_drift, icrc7_supply_cap, icrc7_symbol, icrc7_token_metadata,
    icrc7_total_supply, icrc7_transfer, icrc7_tx_window,
};
use origyn_nft_canister_api::types::management::{
    cancel_upload, finalize_upload, get_upload_status, init_upload, mint, store_chunk,
    update_collection_metadata, update_nft_metadata,
};

generate_query_call!(icrc7_collection_metadata);
generate_query_call!(icrc7_symbol);
generate_query_call!(icrc7_name);
generate_query_call!(icrc7_description);
generate_query_call!(icrc7_logo);
generate_query_call!(icrc7_total_supply);
generate_query_call!(icrc7_supply_cap);
generate_query_call!(icrc7_max_query_batch_size);
generate_query_call!(icrc7_max_update_batch_size);
generate_query_call!(icrc7_default_take_value);
generate_query_call!(icrc7_max_take_value);
generate_query_call!(icrc7_max_memo_size);
generate_query_call!(icrc7_atomic_batch_transfers);
generate_query_call!(icrc7_tx_window);
generate_query_call!(icrc7_permitted_drift);
generate_query_call!(icrc7_owner_of);
generate_query_call!(icrc7_balance_of);
generate_query_call!(icrc7_token_metadata);
generate_query_call!(icrc3_get_archives);
generate_query_call!(icrc3_get_blocks);
generate_query_call!(icrc3_get_properties);
generate_query_call!(icrc3_get_tip_certificate);
generate_query_call!(icrc3_supported_block_types);

generate_query_call!(icrc37_is_approved);
generate_query_call!(icrc37_max_approvals_per_token_or_collection);
generate_query_call!(icrc37_max_revoke_approvals);

generate_update_call!(icrc7_transfer);

generate_update_call!(mint);
generate_update_call!(update_nft_metadata);
generate_update_call!(init_upload);
generate_update_call!(store_chunk);
generate_update_call!(finalize_upload);
generate_update_call!(cancel_upload);
generate_update_call!(update_collection_metadata);

generate_query_call!(get_upload_status);

generate_update_call!(icrc37_approve_collection);
generate_update_call!(icrc37_approve_tokens);
generate_update_call!(icrc37_revoke_collection_approvals);
generate_update_call!(icrc37_revoke_token_approvals);
generate_update_call!(icrc37_transfer_from);
