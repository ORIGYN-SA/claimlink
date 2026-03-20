use crate::templates::TemplateIdsResult;
use candid::Principal;

pub type Args = GetTemplateIdsByOwnerArgs;
pub type Response = TemplateIdsResult;

#[derive(candid::CandidType, serde::Deserialize, serde::Serialize, Debug, Clone)]
pub struct GetTemplateIdsByOwnerArgs {
    pub owner: Principal,
}
