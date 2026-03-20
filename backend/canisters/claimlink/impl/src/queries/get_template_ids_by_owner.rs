use crate::state::read_state;
pub use claimlink_api::queries::get_template_ids_by_owner::{
    Args as GetTemplateIdsByOwnerArgs, Response as GetTemplateIdsByOwnerResponse,
};

#[ic_cdk::query]
#[bity_ic_canister_tracing_macros::trace]
pub fn get_template_ids_by_owner(args: GetTemplateIdsByOwnerArgs) -> GetTemplateIdsByOwnerResponse {
    let template_ids = read_state(|s| s.data.get_template_ids_by_owner(&args.owner));
    let total_count = template_ids.len() as u64;

    GetTemplateIdsByOwnerResponse {
        template_ids: template_ids.into_iter().map(|id| id.into()).collect(),
        total_count,
    }
}
