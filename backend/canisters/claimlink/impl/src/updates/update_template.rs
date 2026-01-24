use crate::{
    guards,
    state::read_state,
    storage::mutate_stable_storage,
    types::templates::{NftTemplateBytes, NftTemplateId},
};
pub use claimlink_api::{
    errors::CreateTemplateError, update_template::Response as UpdateTemplateResponse,
};
pub use claimlink_api::{errors::UpdateTemplateError, update_template::UpdateTemplateArgs};
use serde_json::Value;

#[ic_cdk::update(guard = "guards::caller_is_authorised_principal")]
#[bity_ic_canister_tracing_macros::trace]
pub fn update_template(args: UpdateTemplateArgs) -> UpdateTemplateResponse {
    let caller = ic_cdk::api::msg_caller();

    let template_id: NftTemplateId = args.template_id.0.try_into().expect("Invlaid template id");
    if !read_state(|s| s.data.owns_template(&caller, template_id)) {
        return Err(UpdateTemplateError::UnauthorizedCall);
    };

    let valid_json: Value = serde_json::from_str(&args.new_tempalte_json)
        .map_err(|e| UpdateTemplateError::JsonError(e.to_string()))?;

    mutate_stable_storage(|s| {
        s.record_nft_template(
            template_id,
            NftTemplateBytes(valid_json.to_string().into_bytes()),
        )
    });

    Ok(())
}
