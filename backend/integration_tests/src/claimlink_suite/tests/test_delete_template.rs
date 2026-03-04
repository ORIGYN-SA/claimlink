use crate::claimlink_suite::{
    init::init, tests::test_create_template::temaplte_creation_fails_if_limit_reaches, TestEnv,
};
use claimlink_api::{
    create_template::CreateTemplateArgs, get_templates_by_owner::GetTemplatesByOwnerArgs,
    types::collection::PaginationArgs,
};
#[test]
fn delete_template() {
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
    let templates_result = crate::client::claimlink::delete_template(
        &mut pic,
        principal_ids.controller,
        claimlink,
        &template_id,
    );

    println!("{:?}", templates_result);

    assert!(templates_result.is_ok());

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

    assert_eq!(templates_result.templates.len(), 0);
}
