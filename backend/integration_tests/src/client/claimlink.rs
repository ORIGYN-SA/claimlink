use crate::{generate_query_call, generate_update_call};

use claimlink_api::queries::{
    collection_exists, get_collection_count, get_collection_info, get_collections_by_owner,
    list_all_collections, list_my_collections,
};
use claimlink_api::updates::create_collection;

generate_update_call!(create_collection);

generate_query_call!(list_my_collections);
generate_query_call!(list_all_collections);
generate_query_call!(get_collection_info);
generate_query_call!(get_collections_by_owner);
generate_query_call!(collection_exists);
generate_query_call!(get_collection_count);
