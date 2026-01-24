use crate::claimlink_suite::{init::init, TestEnv};
use claimlink_api::{
    create_template::CreateTemplateArgs, get_templates_by_owner::GetTemplatesByOwnerArgs,
    types::collection::PaginationArgs,
};
use serde_json::Value;
#[test]
fn update_template() {
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

    let new_tempalte_json = r#"
        {
            "name": "Jeff Doe",
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
    let templates_update_result = crate::client::claimlink::update_template(
        &mut pic,
        principal_ids.controller,
        claimlink,
        &claimlink_api::update_template::UpdateTemplateArgs {
            template_id,
            new_tempalte_json: new_tempalte_json.to_string(),
        },
    );

    assert!(templates_update_result.is_ok());

    pic.tick();
    pic.tick();

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

    assert_eq!(
        serde_json::from_str::<Value>(&templates_result.templates[0].template_json).unwrap(),
        serde_json::from_str::<Value>(new_tempalte_json).unwrap()
    );
}
