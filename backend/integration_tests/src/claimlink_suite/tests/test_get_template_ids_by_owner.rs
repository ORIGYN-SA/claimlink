use crate::claimlink_suite::{
    init::{init, MAX_TEMPLATES_PER_OWNER},
    TestEnv,
};
use claimlink_api::{
    create_template::CreateTemplateArgs, get_template_ids_by_owner::GetTemplateIdsByOwnerArgs,
};

/// Helper: create N templates for a given principal, returning their IDs.
fn create_n_templates(
    pic: &mut pocket_ic::PocketIc,
    caller: candid::Principal,
    canister: candid::Principal,
    count: u64,
) -> Vec<candid::Nat> {
    (0..count)
        .map(|i| {
            let json = format!(r#"{{"template_index": {}}}"#, i);
            crate::client::claimlink::create_template(
                pic,
                caller,
                canister,
                &CreateTemplateArgs {
                    template_json: json,
                },
            )
            .unwrap()
        })
        .collect()
}

#[test]
fn returns_all_template_ids() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;
    let claimlink = canister_ids.claimlink;

    let ids = create_n_templates(
        &mut pic,
        principal_ids.controller,
        claimlink,
        MAX_TEMPLATES_PER_OWNER,
    );

    let result = crate::client::claimlink::get_template_ids_by_owner(
        &pic,
        principal_ids.controller,
        claimlink,
        &GetTemplateIdsByOwnerArgs {
            owner: principal_ids.controller,
        },
    );

    assert_eq!(result.total_count, MAX_TEMPLATES_PER_OWNER);
    assert_eq!(result.template_ids.len() as u64, MAX_TEMPLATES_PER_OWNER);
    assert_eq!(result.template_ids, ids);
}

#[test]
fn returns_empty_for_owner_with_no_templates() {
    let env = init();
    let TestEnv {
        pic,
        canister_ids,
        principal_ids,
    } = env;
    let claimlink = canister_ids.claimlink;

    let result = crate::client::claimlink::get_template_ids_by_owner(
        &pic,
        principal_ids.principal_100k_ogy,
        claimlink,
        &GetTemplateIdsByOwnerArgs {
            owner: principal_ids.principal_100k_ogy,
        },
    );

    assert_eq!(result.total_count, 0);
    assert_eq!(result.template_ids.len(), 0);
}

#[test]
fn reflects_deletion() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;
    let claimlink = canister_ids.claimlink;

    let ids = create_n_templates(&mut pic, principal_ids.controller, claimlink, 3);

    // Delete the middle one
    crate::client::claimlink::delete_template(
        &mut pic,
        principal_ids.controller,
        claimlink,
        &ids[1],
    )
    .unwrap();

    let result = crate::client::claimlink::get_template_ids_by_owner(
        &pic,
        principal_ids.controller,
        claimlink,
        &GetTemplateIdsByOwnerArgs {
            owner: principal_ids.controller,
        },
    );

    assert_eq!(result.total_count, 2);
    assert_eq!(result.template_ids.len(), 2);
    assert!(!result.template_ids.contains(&ids[1]));
    assert!(result.template_ids.contains(&ids[0]));
    assert!(result.template_ids.contains(&ids[2]));
}

#[test]
fn owners_are_isolated() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;
    let claimlink = canister_ids.claimlink;

    let controller_ids = create_n_templates(
        &mut pic,
        principal_ids.controller,
        claimlink,
        MAX_TEMPLATES_PER_OWNER,
    );
    let ogy_ids = create_n_templates(&mut pic, principal_ids.principal_100k_ogy, claimlink, 2);

    let controller_result = crate::client::claimlink::get_template_ids_by_owner(
        &pic,
        principal_ids.controller,
        claimlink,
        &GetTemplateIdsByOwnerArgs {
            owner: principal_ids.controller,
        },
    );

    assert_eq!(controller_result.total_count, MAX_TEMPLATES_PER_OWNER);
    assert_eq!(controller_result.template_ids, controller_ids);

    let ogy_result = crate::client::claimlink::get_template_ids_by_owner(
        &pic,
        principal_ids.principal_100k_ogy,
        claimlink,
        &GetTemplateIdsByOwnerArgs {
            owner: principal_ids.principal_100k_ogy,
        },
    );

    assert_eq!(ogy_result.total_count, 2);
    assert_eq!(ogy_result.template_ids, ogy_ids);
}
