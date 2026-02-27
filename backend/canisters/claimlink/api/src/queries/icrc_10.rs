use candid::{CandidType, Deserialize};

#[derive(CandidType, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct SupportedStandard {
    pub url: String,
    pub name: String,
}

pub type Args = ();
pub type Response = Vec<SupportedStandard>;
