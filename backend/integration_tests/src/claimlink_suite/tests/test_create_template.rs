use crate::claimlink_suite::{
    init::{init, MAX_TEMPLATES_PER_OWNER},
    TestEnv,
};
use claimlink_api::{
    collection::PaginationArgs, create_template::CreateTemplateArgs,
    get_templates_by_owner::GetTemplatesByOwnerArgs,
};
use serde_json::Value;

#[test]
fn create_template_basic() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;
    let claimlink = canister_ids.claimlink;

    let template_json_string = r#"
        {
            "name": "John Doe",
            "age": 43,
            "phones": [
                "+44 1234567",
                "+44 2345678"
            ]
        }"#;

    let template_id = crate::client::claimlink::create_template(
        &mut pic,
        principal_ids.controller,
        claimlink,
        &CreateTemplateArgs {
            template_json: template_json_string.to_string(),
        },
    )
    .unwrap();

    // get template by owner should return the template
    let templates_result = crate::client::claimlink::get_templates_by_owner(
        &pic,
        principal_ids.controller,
        claimlink,
        &GetTemplatesByOwnerArgs {
            owner: principal_ids.controller,
            pagination: PaginationArgs {
                offset: Some(0),
                limit: None,
            },
        },
    )
    .unwrap();

    assert_eq!(templates_result.templates[0].template_id, template_id);
    assert_eq!(
        serde_json::from_str::<Value>(&templates_result.templates[0].template_json).unwrap(),
        serde_json::from_str::<Value>(template_json_string).unwrap()
    );

    assert_eq!(templates_result.total_count, 1)
}

#[test]
pub fn temaplte_creation_fails_if_limit_reaches() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;
    let claimlink = canister_ids.claimlink;

    let template_json_string = r#"
        {
            "name": "John Doe",
            "age": 43,
            "phones": [
                "+44 1234567",
                "+44 2345678"
            ]
        }"#;

    for i in 0..=MAX_TEMPLATES_PER_OWNER {
        let template_result = crate::client::claimlink::create_template(
            &mut pic,
            principal_ids.controller,
            claimlink,
            &CreateTemplateArgs {
                template_json: template_json_string.to_string(),
            },
        );
        if i == MAX_TEMPLATES_PER_OWNER {
            assert!(template_result.is_err());
        }
    }
}
