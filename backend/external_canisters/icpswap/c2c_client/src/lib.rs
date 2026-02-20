use icpswap_pool_canister_api::*;

/// Get a price quote from the ICPSwap pool.
/// For OGY→ICP: pass zero_for_one=true (assuming OGY is token0).
/// Returns the output amount in e8s.
pub async fn quote(
    canister_id: ::types::CanisterId,
    args: &quote::Args,
) -> ::ic_cdk::call::CallResult<quote::Response> {
    let method_name = "quote";
    bity_ic_canister_client::make_c2c_call(
        canister_id,
        method_name,
        args,
        ::candid::encode_one,
        |r| ::candid::decode_one(r),
    )
    .await
    .map_err(|e| {
        ::ic_cdk::call::Error::CallRejected(::ic_cdk::call::CallRejected::with_rejection(
            0,
            format!("{e:?}"),
        ))
    })
}

/// Get pool metadata (token info, current price, etc.).
pub async fn metadata(
    canister_id: ::types::CanisterId,
) -> ::ic_cdk::call::CallResult<metadata::Response> {
    let method_name = "metadata";
    bity_ic_canister_client::make_c2c_call(
        canister_id,
        method_name,
        &(),
        ::candid::encode_one,
        |r| ::candid::decode_one(r),
    )
    .await
    .map_err(|e| {
        ::ic_cdk::call::Error::CallRejected(::ic_cdk::call::CallRejected::with_rejection(
            0,
            format!("{e:?}"),
        ))
    })
}
