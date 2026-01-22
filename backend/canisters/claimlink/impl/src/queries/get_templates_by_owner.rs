use crate::{state::read_state, storage::read_stable_storage};
pub use claimlink_api::queries::get_templates_by_owner::{
    Args as GetTemplatesByOwnerArgs, Response as GetTemplatesByOwnerResponse,
};
use claimlink_api::{
    errors::GetTemplatesByOwnerError,
    templates::{Template, TemplatesResult},
};

#[ic_cdk::query]
#[bity_ic_canister_tracing_macros::trace]
pub fn get_templates_by_owner(args: GetTemplatesByOwnerArgs) -> GetTemplatesByOwnerResponse {
    let caller = ic_cdk::api::msg_caller();

    if caller != args.owner {
        return Err(GetTemplatesByOwnerError::UnauthorizedCall);
    }

    let offset = args.pagination.get_offset();
    let limit = args.pagination.get_limit();

    // Apply pagination
    let template_ids = read_state(|s| s.data.get_template_ids_by_owner(&args.owner));
    let total_count = template_ids.len() as u64;

    // apply pagination and switch to candid type
    let templates = template_ids
        .into_iter()
        .skip(offset)
        .take(limit)
        .map(|temaplate_id| {
            let temaplte_bytes = read_stable_storage(|s| s.get_template(&temaplate_id))
                .unwrap()
                .0;
            Template {
                template_id: temaplate_id.into(),
                template_json: String::from_utf8(temaplte_bytes)
                    .expect("BUG: failed to transform bytes to json"),
            }
        })
        .collect();

    GetTemplatesByOwnerResponse::Ok(TemplatesResult {
        templates,
        total_count,
    })
}
