use crate::{
    guards,
    state::{audit::process_event, mutate_state, read_state},
    types::events::EventType,
};
use claimlink_api::errors::RefundError;
use claimlink_api::mint::MintRequestStatus;
pub use claimlink_api::updates::request_mint_refund::{
    Args as RequestMintRefundArgs, Response as RequestMintRefundResponse,
};
use utils::env::Environment;

#[ic_cdk::update(guard = "guards::reject_anonymous_caller")]
#[bity_ic_canister_tracing_macros::trace]
pub fn request_mint_refund(args: RequestMintRefundArgs) -> RequestMintRefundResponse {
    read_state(|s| {
        let caller = s.env.caller();
        let request = s
            .data
            .get_mint_request(args.mint_request_id)
            .ok_or(RefundError::MintRequestNotFound)?;

        if request.owner != caller {
            return Err(RefundError::Unauthorized);
        }

        match &request.status {
            MintRequestStatus::Initialized => {}
            MintRequestStatus::Refunded { .. } => return Err(RefundError::AlreadyRefunded),
            MintRequestStatus::RefundRequested => return Err(RefundError::AlreadyRefunded),
            _ => return Err(RefundError::NotInRefundableState),
        }

        // Cannot refund if any credits have been used
        if request.minted_count > 0 || request.bytes_uploaded > 0 {
            return Err(RefundError::CreditsAlreadyUsed);
        }

        Ok(())
    })?;

    mutate_state(|s| {
        process_event(
            s,
            EventType::MintRefundRequested {
                mint_request_id: args.mint_request_id,
            },
        );
    });

    Ok(())
}
