use crate::{
    guards,
    state::{audit::process_event, mutate_state},
    types::events::EventType,
};
pub use claimlink_api::updates::set_ogy_price::{Args as SetOgyPriceArgs, Response as SetOgyPriceResponse};

#[ic_cdk::update(guard = "guards::caller_is_authorised_principal")]
#[bity_ic_canister_tracing_macros::trace]
pub fn set_ogy_price(args: SetOgyPriceArgs) -> SetOgyPriceResponse {
    if args.usd_per_ogy_e8s == 0 {
        return Err("Price cannot be zero".to_string());
    }

    mutate_state(|s| {
        process_event(
            s,
            EventType::UpdatedOgyPrice {
                usd_per_ogy_e8s: args.usd_per_ogy_e8s,
            },
        );
    });

    Ok(())
}
