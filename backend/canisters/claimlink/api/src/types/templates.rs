use candid::{CandidType, Nat};
use serde::{Deserialize, Serialize};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Template {
    pub template_id: Nat,
    pub template_json: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TemplatesResult {
    pub templates: Vec<Template>,
    pub total_count: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TemplateIdsResult {
    pub template_ids: Vec<Nat>,
    pub total_count: u64,
}
