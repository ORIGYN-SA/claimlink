use crate::{
    errors::GetTemplatesByOwnerError, templates::TemplatesResult, types::collection::PaginationArgs,
};
use candid::Principal;

pub type Args = GetTemplatesByOwnerArgs;
pub type Response = Result<TemplatesResult, GetTemplatesByOwnerError>;

#[derive(candid::CandidType, serde::Deserialize, serde::Serialize, Debug, Clone)]
pub struct GetTemplatesByOwnerArgs {
    pub owner: Principal,
    pub pagination: PaginationArgs,
}
