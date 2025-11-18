pub use claimlink_api::queries::get_nft_details::{
    Args as GetNftDetailsArgs, NftDetails, Response as GetNftDetailsResponse,
};

#[ic_cdk::query(composite = true)]
#[bity_ic_canister_tracing_macros::trace]
pub async fn get_nft_details(args: GetNftDetailsArgs) -> GetNftDetailsResponse {
    let canister_id = args.canister_id;
    let token_ids = args.token_ids.clone();

    // Fetch metadata and owners in parallel
    let (metadata_result, owners_result) = futures::join!(
        origyn_nft_canister_c2c_client::icrc7_token_metadata(canister_id, token_ids.clone()),
        origyn_nft_canister_c2c_client::icrc7_owner_of(canister_id, token_ids.clone())
    );

    let metadata_vec = metadata_result.unwrap_or_default();
    let owners_vec = owners_result.unwrap_or_default();

    // Combine the results
    token_ids
        .into_iter()
        .enumerate()
        .map(|(i, token_id)| NftDetails {
            token_id,
            metadata: metadata_vec.get(i).cloned().flatten(),
            owner: owners_vec.get(i).cloned().flatten(),
        })
        .collect()
}
