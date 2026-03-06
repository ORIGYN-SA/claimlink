use candid::Decode;

pub use claimlink_api::updates::icrc_21::{Args, Response};
use claimlink_api::{
    create_collection::CreateCollectionArgs,
    create_template::{CreateTemplateArgs, TemplateId},
    update_template::UpdateTemplateArgs,
};

use icrc_ledger_types::icrc21::{
    errors::{ErrorInfo, Icrc21Error},
    requests::{ConsentMessageMetadata, DisplayMessageType},
    responses::{ConsentInfo, ConsentMessage, FieldsDisplay, Value},
};

#[ic_cdk::update]
pub fn icrc21_canister_call_consent_message(request: Args) -> Response {
    let metadata = ConsentMessageMetadata {
        language: request.user_preferences.metadata.language.clone(),
        utc_offset_minutes: request.user_preferences.metadata.utc_offset_minutes,
    };

    let use_fields = matches!(
        request.user_preferences.device_spec,
        Some(DisplayMessageType::FieldsDisplay)
    );

    let result = match request.method.as_str() {
        "create_collection" => build_create_collection_message(&request.arg, use_fields),
        "create_template" => build_create_template_message(&request.arg, use_fields),
        "update_template" => build_update_template_message(&request.arg, use_fields),
        "delete_template" => build_delete_template_message(&request.arg, use_fields),
        _ => Err(Icrc21Error::UnsupportedCanisterCall(ErrorInfo{
            description: format!(
                "Unsupported method: {}. Supported methods: create_collection, create_template, update_template, delete_template",
                request.method
            ),
        })),
    };

    match result {
        Ok(consent_message) => Ok(ConsentInfo {
            consent_message,
            metadata,
        }),
        Err(e) => Err(e),
    }
}

fn text_value(content: String) -> Value {
    Value::Text { content }
}

fn build_create_collection_message(
    arg: &[u8],
    use_fields: bool,
) -> Result<ConsentMessage, Icrc21Error> {
    let args = Decode!(arg, CreateCollectionArgs).map_err(|e| {
        Icrc21Error::UnsupportedCanisterCall(ErrorInfo {
            description: format!("Failed to decode create_collection arguments: {}", e),
        })
    })?;

    if use_fields {
        Ok(ConsentMessage::FieldsDisplayMessage(FieldsDisplay {
            intent: "Create NFT Collection".to_string(),
            fields: vec![
                ("Name".to_string(), text_value(args.name)),
                ("Symbol".to_string(), text_value(args.symbol)),
                ("Description".to_string(), text_value(args.description)),
                (
                    "Template ID".to_string(),
                    text_value(args.template_id.to_string()),
                ),
            ],
        }))
    } else {
        Ok(ConsentMessage::GenericDisplayMessage(format!(
            "## Create NFT Collection\n\n\
            Create a new ORIGYN NFT collection on the Internet Computer.\n\n\
            - **Name:** {}\n\
            - **Symbol:** {}\n\
            - **Description:** {}\n\
            - **Template ID:** {}\n\n\
            This action will charge an OGY fee for collection creation.",
            args.name, args.symbol, args.description, args.template_id
        )))
    }
}

fn build_create_template_message(
    arg: &[u8],
    use_fields: bool,
) -> Result<ConsentMessage, Icrc21Error> {
    let args = Decode!(arg, CreateTemplateArgs).map_err(|e| {
        Icrc21Error::UnsupportedCanisterCall(ErrorInfo {
            description: format!("Failed to decode create_template arguments: {}", e),
        })
    })?;

    let json_preview = if args.template_json.len() > 200 {
        format!("{}...", &args.template_json[..200])
    } else {
        args.template_json.clone()
    };

    if use_fields {
        Ok(ConsentMessage::FieldsDisplayMessage(FieldsDisplay {
            intent: "Create Certificate Template".to_string(),
            fields: vec![("Template JSON".to_string(), text_value(json_preview))],
        }))
    } else {
        Ok(ConsentMessage::GenericDisplayMessage(format!(
            "## Create Certificate Template\n\n\
            Create a new NFT certificate template.\n\n\
            - **Template JSON:** `{}`\n\n\
            This template can be used to mint NFT collections.",
            json_preview
        )))
    }
}

fn build_update_template_message(
    arg: &[u8],
    use_fields: bool,
) -> Result<ConsentMessage, Icrc21Error> {
    let args = Decode!(arg, UpdateTemplateArgs).map_err(|e| {
        Icrc21Error::UnsupportedCanisterCall(ErrorInfo {
            description: format!("Failed to decode update_template arguments: {}", e),
        })
    })?;

    let json_preview = if args.new_tempalte_json.len() > 200 {
        format!("{}...", &args.new_tempalte_json[..200])
    } else {
        args.new_tempalte_json.clone()
    };

    if use_fields {
        Ok(ConsentMessage::FieldsDisplayMessage(FieldsDisplay {
            intent: "Update Certificate Template".to_string(),
            fields: vec![
                (
                    "Template ID".to_string(),
                    text_value(args.template_id.to_string()),
                ),
                ("New Template JSON".to_string(), text_value(json_preview)),
            ],
        }))
    } else {
        Ok(ConsentMessage::GenericDisplayMessage(format!(
            "## Update Certificate Template\n\n\
            Update an existing NFT certificate template.\n\n\
            - **Template ID:** {}\n\
            - **New Template JSON:** `{}`\n\n\
            This will replace the existing template data. You must be the template owner.",
            args.template_id, json_preview
        )))
    }
}

fn build_delete_template_message(
    arg: &[u8],
    use_fields: bool,
) -> Result<ConsentMessage, Icrc21Error> {
    let template_id = Decode!(arg, TemplateId).map_err(|e| {
        Icrc21Error::UnsupportedCanisterCall(ErrorInfo {
            description: format!("Failed to decode delete_template arguments: {}", e),
        })
    })?;

    if use_fields {
        Ok(ConsentMessage::FieldsDisplayMessage(FieldsDisplay {
            intent: "Delete Certificate Template".to_string(),
            fields: vec![(
                "Template ID".to_string(),
                text_value(template_id.to_string()),
            )],
        }))
    } else {
        Ok(ConsentMessage::GenericDisplayMessage(format!(
            "## Delete Certificate Template\n\n\
            Permanently delete an NFT certificate template.\n\n\
            - **Template ID:** {}\n\n\
            **Warning:** This action cannot be undone. You must be the template owner.",
            template_id
        )))
    }
}
