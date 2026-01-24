use crate::{
    guards,
    state::{audit::process_event, mutate_state, read_state},
    storage::mutate_stable_storage,
    types::{events::EventType, templates::NftTemplateId},
};
use claimlink_api::errors::DeleteTemplateError;
pub use claimlink_api::{
    delete_template::{Args as DeleteTemplateArg, Response as DeleteTemplateResult},
    errors::CreateTemplateError,
};

#[ic_cdk::update(guard = "guards::caller_is_authorised_principal")]
#[bity_ic_canister_tracing_macros::trace]
pub fn delete_template(args: DeleteTemplateArg) -> DeleteTemplateResult {
    let caller = ic_cdk::api::msg_caller();

    let template_id: NftTemplateId = args.0.try_into().expect("Invlaid template id");
    if !read_state(|s| s.data.owns_template(&caller, template_id)) {
        return Err(DeleteTemplateError::UnauthorizedCall);
    };

    mutate_stable_storage(|s| s.delete_nft_template(template_id));

    // deletion
    mutate_state(|s| {
        process_event(
            s,
            EventType::DeletedTemplate {
                template_id,
                owner: caller,
            },
        )
    });

    Ok(())
}
