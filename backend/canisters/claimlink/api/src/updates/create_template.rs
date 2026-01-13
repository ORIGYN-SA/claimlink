use crate::errors::CreateTemplateError;
use candid::Nat;

pub type Args = CreateTemplateArgs;
pub type Response = Result<TemplateId, CreateTemplateError>;

#[derive(candid::CandidType, serde::Deserialize, serde::Serialize, Debug)]
pub struct CreateTemplateArgs {
    pub template_json: String,
}

pub type TemplateId = Nat;
