use crate::{generate_query_call, generate_update_call};

use claimlink_api::queries::{
    get_collection_count, get_collection_info, get_collection_nfts, get_collections_by_owner,
    get_metrics, get_nft_details, get_templates_by_owner,
    /* get_user_nfts, */ list_all_collections,
};
use claimlink_api::updates::{create_collection, create_template};

generate_update_call!(create_collection);
generate_update_call!(create_template);

generate_query_call!(list_all_collections);
generate_query_call!(get_collection_info);
generate_query_call!(get_collections_by_owner);
generate_query_call!(get_collection_count);
generate_query_call!(get_collection_nfts);
generate_query_call!(get_nft_details);
generate_query_call!(get_templates_by_owner);
generate_query_call!(get_metrics);
// generate_query_call!(get_user_nfts); // TODO: Temporarily commented out - see get_user_nfts.rs
