pub use claimlink_api::queries::get_user_nfts::{
    Args as GetUserNftsArgs, Response as GetUserNftsResponse,
};

#[ic_cdk::query(composite = true)]
#[bity_ic_canister_tracing_macros::trace]
pub async fn get_user_nfts(args: GetUserNftsArgs) -> GetUserNftsResponse {
    origyn_nft_canister_c2c_client::icrc7_tokens_of(
        args.canister_id,
        &(args.account, args.prev, args.take),
    )
    .await
    .unwrap_or_default()
}
