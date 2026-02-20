use xrc_canister_api::*;

/// Get exchange rate from the XRC canister.
/// Note: This call requires cycles to be attached (~200M-500M).
pub async fn get_exchange_rate(
    canister_id: ::types::CanisterId,
    args: &get_exchange_rate::Args,
) -> ::ic_cdk::call::CallResult<get_exchange_rate::Response> {
    let method_name = "get_exchange_rate";
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
