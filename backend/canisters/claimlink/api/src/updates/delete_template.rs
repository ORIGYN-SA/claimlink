use crate::{
    create_template::TemplateId,
    errors::{DeleteTemplateError, UpdateTemplateError},
};
use candid::Nat;

pub type Args = TemplateId;
pub type Response = Result<(), DeleteTemplateError>;
