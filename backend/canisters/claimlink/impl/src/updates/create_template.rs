use crate::guards;
use crate::{
    state::{audit::process_event, mutate_state, read_state},
    storage::mutate_stable_storage,
    types::{
        events::EventType,
        templates::{NftTemplateBytes, NftTemplateId},
    },
};
use candid::{Nat, Principal};

pub use claimlink_api::{
    create_template::{CreateTemplateArgs, Response as CreateTemplateResponse},
    errors::CreateTemplateError,
};

#[ic_cdk::update(guard = "guards::caller_is_authorised_principal")]
#[bity_ic_canister_tracing_macros::trace]
pub fn create_tempalte(args: CreateTemplateArgs) -> CreateTemplateResponse {
    let caller = ic_cdk::api::msg_caller();

    // check if the users templates limit has been reached
    let (user_templates_len, max_template_per_owner) = read_state(|s| {
        (
            s.data.template_owners.get(&caller).unwrap_or(&vec![]).len() as u64,
            s.data.max_template_per_owner,
        )
    });

    if user_templates_len >= max_template_per_owner {
        return Err(CreateTemplateError::LimitExceeded {
            max_templates: Nat::from(max_template_per_owner),
        });
    }

    let valid_json = serde_json::to_string_pretty(&args.template_json)
        .map_err(|e| CreateTemplateError::JsonError(e.to_string()))?;

    let template_id = record_template(NftTemplateBytes(valid_json.into_bytes()), caller);

    Ok(Nat::from(template_id))
}

pub fn record_template(template_bytes: NftTemplateBytes, owner: Principal) -> NftTemplateId {
    let next_template_id = read_state(|s| s.data.next_template_id);

    mutate_state(|s| {
        process_event(
            s,
            EventType::CreatedTemplate {
                template_id: next_template_id,
                owner,
            },
        )
    });

    mutate_stable_storage(|s| s.record_nft_template(next_template_id, template_bytes));

    next_template_id
}
