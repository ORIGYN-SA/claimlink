pub use claimlink_api::queries::get_collection_nfts::{
    Args as GetCollectionNftsArgs, Response as GetCollectionNftsResponse,
};

#[ic_cdk::query(composite = true)]
#[bity_ic_canister_tracing_macros::trace]
pub async fn get_collection_nfts(args: GetCollectionNftsArgs) -> GetCollectionNftsResponse {
    origyn_nft_canister_c2c_client::icrc7_tokens(args.canister_id, (args.prev, args.take))
        .await
        .unwrap_or((vec![],))
        .0
}
