use crate::{
    state::{audit::process_event, mutate_state, read_state},
    types::events::EventType,
};
pub use claimlink_api::updates::set_ogy_price::{
    Args as SetOgyPriceArgs, Response as SetOgyPriceResponse,
};

/// Only available in test mode.
#[ic_cdk::update(hidden = true)]
pub fn set_ogy_price(args: SetOgyPriceArgs) -> SetOgyPriceResponse {
    if !read_state(|s| s.env.is_test_mode()) {
        return Err("set_ogy_price is only available in test mode".to_string());
    }

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
