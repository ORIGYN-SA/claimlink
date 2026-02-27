use candid::Decode;
use claimlink_api::icrc_21::{
    Icrc21ConsentInfo, Icrc21ConsentMessage, Icrc21ConsentMessageMetadata, Icrc21DeviceSpec,
    Icrc21Error, Icrc21ErrorInfo, Icrc21FieldDisplayMessage,
};
pub use claimlink_api::icrc_21::{Icrc21ConsentMessageRequest, Icrc21ConsentMessageResponse};
use claimlink_api::updates::{
    create_collection::CreateCollectionArgs, create_template::CreateTemplateArgs,
    delete_template::Args as DeleteTemplateArgs, update_template::UpdateTemplateArgs,
};

#[ic_cdk::query]
pub fn icrc21_canister_call_consent_message(
    request: Icrc21ConsentMessageRequest,
) -> Icrc21ConsentMessageResponse {
    let metadata = Icrc21ConsentMessageMetadata {
        language: request.user_preferences.metadata.language.clone(),
        utc_offset_minutes: request.user_preferences.metadata.utc_offset_minutes,
    };

    let use_fields = matches!(
        request.user_preferences.device_spec,
        Some(Icrc21DeviceSpec::FieldsDisplay)
    );

    let result = match request.method.as_str() {
        "create_collection" => build_create_collection_message(&request.arg, use_fields),
        "create_template" => build_create_template_message(&request.arg, use_fields),
        "update_template" => build_update_template_message(&request.arg, use_fields),
        "delete_template" => build_delete_template_message(&request.arg, use_fields),
        _ => Err(Icrc21Error::UnsupportedCanisterCall(Icrc21ErrorInfo {
            description: format!(
                "Unsupported method: {}. Supported methods: create_collection, create_template, update_template, delete_template",
                request.method
            ),
        })),
    };

    match result {
        Ok(consent_message) => Icrc21ConsentMessageResponse::Ok(Icrc21ConsentInfo {
            consent_message,
            metadata,
        }),
        Err(e) => Icrc21ConsentMessageResponse::Err(e),
    }
}

fn build_create_collection_message(
    arg: &[u8],
    use_fields: bool,
) -> Result<Icrc21ConsentMessage, Icrc21Error> {
    let args = Decode!(arg, CreateCollectionArgs).map_err(|e| {
        Icrc21Error::UnsupportedCanisterCall(Icrc21ErrorInfo {
            description: format!("Failed to decode create_collection arguments: {}", e),
        })
    })?;

    let generic_display_message = format!(
        "## Create NFT Collection\n\n\
        Create a new ORIGYN NFT collection on the Internet Computer.\n\n\
        - **Name:** {}\n\
        - **Symbol:** {}\n\
        - **Description:** {}\n\
        - **Template ID:** {}\n\n\
        This action will charge an OGY fee for collection creation.",
        args.name, args.symbol, args.description, args.template_id
    );

    let fields_display_message = Icrc21FieldDisplayMessage {
        intent: "Create NFT Collection".to_string(),
        fields: vec![
            ("Name".to_string(), args.name),
            ("Symbol".to_string(), args.symbol),
            ("Description".to_string(), args.description),
            ("Template ID".to_string(), args.template_id.to_string()),
        ],
    };

    if use_fields {
        Ok(Icrc21ConsentMessage {
            generic_display_message,
            fields_display_message,
        })
    } else {
        Ok(Icrc21ConsentMessage {
            generic_display_message,
            fields_display_message,
        })
    }
}

fn build_create_template_message(
    arg: &[u8],
    _use_fields: bool,
) -> Result<Icrc21ConsentMessage, Icrc21Error> {
    let args = Decode!(arg, CreateTemplateArgs).map_err(|e| {
        Icrc21Error::UnsupportedCanisterCall(Icrc21ErrorInfo {
            description: format!("Failed to decode create_template arguments: {}", e),
        })
    })?;

    let json_preview = if args.template_json.len() > 200 {
        format!("{}...", &args.template_json[..200])
    } else {
        args.template_json.clone()
    };

    let generic_display_message = format!(
        "## Create Certificate Template\n\n\
        Create a new NFT certificate template.\n\n\
        - **Template JSON:** `{}`\n\n\
        This template can be used to mint NFT collections.",
        json_preview
    );

    let fields_display_message = Icrc21FieldDisplayMessage {
        intent: "Create Certificate Template".to_string(),
        fields: vec![("Template JSON".to_string(), json_preview)],
    };

    Ok(Icrc21ConsentMessage {
        generic_display_message,
        fields_display_message,
    })
}

fn build_update_template_message(
    arg: &[u8],
    _use_fields: bool,
) -> Result<Icrc21ConsentMessage, Icrc21Error> {
    let args = Decode!(arg, UpdateTemplateArgs).map_err(|e| {
        Icrc21Error::UnsupportedCanisterCall(Icrc21ErrorInfo {
            description: format!("Failed to decode update_template arguments: {}", e),
        })
    })?;

    let json_preview = if args.new_tempalte_json.len() > 200 {
        format!("{}...", &args.new_tempalte_json[..200])
    } else {
        args.new_tempalte_json.clone()
    };

    let generic_display_message = format!(
        "## Update Certificate Template\n\n\
        Update an existing NFT certificate template.\n\n\
        - **Template ID:** {}\n\
        - **New Template JSON:** `{}`\n\n\
        This will replace the existing template data. You must be the template owner.",
        args.template_id, json_preview
    );

    let fields_display_message = Icrc21FieldDisplayMessage {
        intent: "Update Certificate Template".to_string(),
        fields: vec![
            ("Template ID".to_string(), args.template_id.to_string()),
            ("New Template JSON".to_string(), json_preview),
        ],
    };

    Ok(Icrc21ConsentMessage {
        generic_display_message,
        fields_display_message,
    })
}

fn build_delete_template_message(
    arg: &[u8],
    _use_fields: bool,
) -> Result<Icrc21ConsentMessage, Icrc21Error> {
    let template_id = Decode!(arg, DeleteTemplateArgs).map_err(|e| {
        Icrc21Error::UnsupportedCanisterCall(Icrc21ErrorInfo {
            description: format!("Failed to decode delete_template arguments: {}", e),
        })
    })?;

    let generic_display_message = format!(
        "## Delete Certificate Template\n\n\
        Permanently delete an NFT certificate template.\n\n\
        - **Template ID:** {}\n\n\
        **Warning:** This action cannot be undone. You must be the template owner.",
        template_id
    );

    let fields_display_message = Icrc21FieldDisplayMessage {
        intent: "Delete Certificate Template".to_string(),
        fields: vec![("Template ID".to_string(), template_id.to_string())],
    };

    Ok(Icrc21ConsentMessage {
        generic_display_message,
        fields_display_message,
    })
}
