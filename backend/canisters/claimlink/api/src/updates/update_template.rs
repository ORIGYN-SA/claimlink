use crate::{create_template::TemplateId, errors::UpdateTemplateError};

pub type Args = UpdateTemplateArgs;
pub type Response = Result<(), UpdateTemplateError>;

#[derive(candid::CandidType, serde::Deserialize, serde::Serialize, Debug)]
pub struct UpdateTemplateArgs {
    pub template_id: TemplateId,
    pub new_tempalte_json: String,
}
