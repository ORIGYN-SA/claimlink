use crate::state::read_state;
use crate::types::collections::InstallationStatus;
pub use claimlink_api::queries::get_collections_for_user::{
    Args as GetCollectionsForUserArgs, Response as GetCollectionsForUserResponse,
};
use claimlink_api::types::collection::CollectionsResult;
use futures::future::join_all;
use icrc_ledger_types::icrc1::account::Account;

#[ic_cdk::query(composite = true)]
#[bity_ic_canister_tracing_macros::trace]
pub async fn get_collections_for_user(
    args: GetCollectionsForUserArgs,
) -> GetCollectionsForUserResponse {
    let offset = args.pagination.get_offset();
    let limit = args.pagination.get_limit();

    let user_account = Account {
        owner: args.user,
        subaccount: None,
    };

    // Get all collections that are installed or have their template uploaded
    let all_collections = read_state(|s| {
        s.data
            .collection_requests
            .values()
            .filter(|c| {
                c.canister_id.is_some()
                    && matches!(
                        c.status,
                        InstallationStatus::Installed | InstallationStatus::TemplateUploaded
                    )
            })
            .cloned()
            .collect::<Vec<_>>()
    });

    // Fire all icrc7_tokens_of calls concurrently
    let futures: Vec<_> = all_collections
        .iter()
        .map(|collection| {
            let canister_id = collection.canister_id.unwrap();
            origyn_nft_canister_c2c_client::icrc7_tokens_of(
                canister_id,
                (user_account, None, Some(candid::Nat::from(1u64))),
            )
        })
        .collect();

    let results = join_all(futures).await;

    // Collect only collections where the user owns at least one token
    let user_collections: Vec<_> = all_collections
        .into_iter()
        .zip(results)
        .filter(|(_, result)| {
            result
                .as_ref()
                .map(|tokens| !tokens.0.is_empty())
                .unwrap_or(false)
        })
        .map(|(collection, _)| collection)
        .collect();

    let total_count = user_collections.len() as u64;

    let collections = user_collections
        .into_iter()
        .skip(offset)
        .take(limit as usize)
        .map(|collection| collection.into())
        .collect();

    CollectionsResult {
        collections,
        total_count,
    }
}
