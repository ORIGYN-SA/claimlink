use crate::{
    create_template::TemplateId,
    errors::{DeleteTemplateError, UpdateTemplateError},
};

pub type Args = TemplateId;
pub type Response = Result<(), DeleteTemplateError>;
