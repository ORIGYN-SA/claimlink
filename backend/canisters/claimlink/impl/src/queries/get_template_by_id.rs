use crate::storage::read_stable_storage;
pub use claimlink_api::queries::get_template_by_id::{
    Args as GetTemplateByIdArgs, Response as GetTemplateByIdResponse,
};
use claimlink_api::{errors::GetTemplateByIdError, templates::Template};

#[ic_cdk::query]
#[bity_ic_canister_tracing_macros::trace]
pub fn get_template_by_id(args: GetTemplateByIdArgs) -> GetTemplateByIdResponse {
    let template_id: u64 = args
        .template_id
        .0
        .try_into()
        .map_err(|_| GetTemplateByIdError::TemplateNotFound)?;

    let template_bytes = read_stable_storage(|s| s.get_template(&template_id))
        .ok_or(GetTemplateByIdError::TemplateNotFound)?;

    Ok(Template {
        template_id: template_id.into(),
        template_json: String::from_utf8(template_bytes.0)
            .expect("BUG: failed to transform bytes to json"),
    })
}
