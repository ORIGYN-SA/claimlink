use crate::claimlink_suite::{init::init, TestEnv};
use claimlink_api::{
    create_template::CreateTemplateArgs, errors::GetTemplateByIdError,
    get_template_by_id::GetTemplateByIdArgs,
};

#[test]
fn returns_template_by_id() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;
    let claimlink = canister_ids.claimlink;

    let template_json = r#"{"name": "test_template", "value": 42}"#.to_string();
    let template_id = crate::client::claimlink::create_template(
        &mut pic,
        principal_ids.controller,
        claimlink,
        &CreateTemplateArgs {
            template_json: template_json.clone(),
        },
    )
    .unwrap();

    let result = crate::client::claimlink::get_template_by_id(
        &pic,
        principal_ids.controller,
        claimlink,
        &GetTemplateByIdArgs {
            template_id: template_id.clone(),
        },
    )
    .unwrap();

    assert_eq!(result.template_id, template_id);
    // create_template re-serializes JSON, so compare parsed values
    let expected: serde_json::Value = serde_json::from_str(&template_json).unwrap();
    let actual: serde_json::Value = serde_json::from_str(&result.template_json).unwrap();
    assert_eq!(actual, expected);
}

#[test]
fn returns_error_for_nonexistent_template() {
    let env = init();
    let TestEnv {
        pic,
        canister_ids,
        principal_ids,
    } = env;
    let claimlink = canister_ids.claimlink;

    let result = crate::client::claimlink::get_template_by_id(
        &pic,
        principal_ids.controller,
        claimlink,
        &GetTemplateByIdArgs {
            template_id: candid::Nat::from(9999u64),
        },
    );

    assert_eq!(result.unwrap_err(), GetTemplateByIdError::TemplateNotFound);
}

#[test]
fn returns_error_after_template_deleted() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;
    let claimlink = canister_ids.claimlink;

    let template_id = crate::client::claimlink::create_template(
        &mut pic,
        principal_ids.controller,
        claimlink,
        &CreateTemplateArgs {
            template_json: r#"{"will_delete": true}"#.to_string(),
        },
    )
    .unwrap();

    // Verify it exists first
    let result = crate::client::claimlink::get_template_by_id(
        &pic,
        principal_ids.controller,
        claimlink,
        &GetTemplateByIdArgs {
            template_id: template_id.clone(),
        },
    );
    assert!(result.is_ok());

    // Delete it
    crate::client::claimlink::delete_template(
        &mut pic,
        principal_ids.controller,
        claimlink,
        &template_id,
    )
    .unwrap();

    // Now it should return TemplateNotFound
    let result = crate::client::claimlink::get_template_by_id(
        &pic,
        principal_ids.controller,
        claimlink,
        &GetTemplateByIdArgs {
            template_id: template_id.clone(),
        },
    );
    assert_eq!(result.unwrap_err(), GetTemplateByIdError::TemplateNotFound);
}

#[test]
fn any_caller_can_fetch_template_by_id() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;
    let claimlink = canister_ids.claimlink;

    // Controller creates a template
    let template_id = crate::client::claimlink::create_template(
        &mut pic,
        principal_ids.controller,
        claimlink,
        &CreateTemplateArgs {
            template_json: r#"{"public": true}"#.to_string(),
        },
    )
    .unwrap();

    // Another principal can fetch it (templates are public data)
    let result = crate::client::claimlink::get_template_by_id(
        &pic,
        principal_ids.principal_100k_ogy,
        claimlink,
        &GetTemplateByIdArgs {
            template_id: template_id.clone(),
        },
    )
    .unwrap();

    assert_eq!(result.template_id, template_id);
    let expected: serde_json::Value = serde_json::from_str(r#"{"public": true}"#).unwrap();
    let actual: serde_json::Value = serde_json::from_str(&result.template_json).unwrap();
    assert_eq!(actual, expected);
}
