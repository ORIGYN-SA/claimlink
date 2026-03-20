use crate::{errors::GetTemplateByIdError, templates::Template};
use candid::Nat;

pub type Args = GetTemplateByIdArgs;
pub type Response = Result<Template, GetTemplateByIdError>;

#[derive(candid::CandidType, serde::Deserialize, serde::Serialize, Debug, Clone)]
pub struct GetTemplateByIdArgs {
    pub template_id: Nat,
}
