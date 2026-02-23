use crate::{generate_query_call, generate_update_call};

use claimlink_api::queries::{
    estimate_mint_cost, get_collection_count, get_collection_info, get_collection_nfts,
    get_collections_by_owner, get_collections_for_user, get_metrics, get_mint_request,
    get_mint_requests_by_owner, get_nft_details, get_ogy_usd_price, get_templates_by_owner,
    list_all_collections,
};
use claimlink_api::updates::{
    create_collection, create_template, delete_template, initialize_mint, mint_nfts,
    proxy_upload::finalize as proxy_finalize_upload, proxy_upload::init as proxy_init_upload,
    proxy_upload::store as proxy_store_chunk, request_mint_refund, set_ogy_price, update_template,
};

generate_update_call!(create_collection);
generate_update_call!(create_template);
generate_update_call!(delete_template);
generate_update_call!(update_template);
generate_update_call!(initialize_mint);
generate_update_call!(mint_nfts);
generate_update_call!(request_mint_refund);
generate_update_call!(set_ogy_price);
generate_update_call!(proxy_init_upload);
generate_update_call!(proxy_store_chunk);
generate_update_call!(proxy_finalize_upload);

generate_query_call!(list_all_collections);
generate_query_call!(get_collection_info);
generate_query_call!(get_collections_by_owner);
generate_query_call!(get_collections_for_user);
generate_query_call!(get_collection_count);
generate_query_call!(get_collection_nfts);
generate_query_call!(get_nft_details);
generate_query_call!(get_templates_by_owner);
generate_query_call!(get_metrics);
generate_query_call!(estimate_mint_cost);
generate_query_call!(get_mint_request);
generate_query_call!(get_mint_requests_by_owner);
generate_query_call!(get_ogy_usd_price);
//generate_query_call!(get_user_nfts);
