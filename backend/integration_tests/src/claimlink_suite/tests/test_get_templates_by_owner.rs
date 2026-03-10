use crate::claimlink_suite::{
    init::{init, MAX_TEMPLATES_PER_OWNER},
    TestEnv,
};
use claimlink_api::{
    collection::PaginationArgs, create_template::CreateTemplateArgs,
    get_templates_by_owner::GetTemplatesByOwnerArgs,
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
fn query_all_templates_at_max_limit() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;
    let claimlink = canister_ids.claimlink;

    // Create exactly MAX_TEMPLATES_PER_OWNER (5) templates
    let ids = create_n_templates(
        &mut pic,
        principal_ids.controller,
        claimlink,
        MAX_TEMPLATES_PER_OWNER,
    );
    assert_eq!(ids.len() as u64, MAX_TEMPLATES_PER_OWNER);

    // Query all templates — should return all 5
    let result = crate::client::claimlink::get_templates_by_owner(
        &pic,
        principal_ids.controller,
        claimlink,
        &GetTemplatesByOwnerArgs {
            owner: principal_ids.controller,
            pagination: PaginationArgs {
                offset: None,
                limit: None,
            },
        },
    )
    .unwrap();

    assert_eq!(result.total_count, MAX_TEMPLATES_PER_OWNER);
    assert_eq!(result.templates.len() as u64, MAX_TEMPLATES_PER_OWNER);

    // Verify each template has the correct ID and valid JSON
    for (i, template) in result.templates.iter().enumerate() {
        assert_eq!(template.template_id, ids[i]);
        let parsed: serde_json::Value =
            serde_json::from_str(&template.template_json).expect("should be valid JSON");
        assert_eq!(parsed["template_index"], i as u64);
    }
}

#[test]
fn query_with_pagination_offset_and_limit() {
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

    // Page 1: offset=0, limit=2 → templates 0,1
    let page1 = crate::client::claimlink::get_templates_by_owner(
        &pic,
        principal_ids.controller,
        claimlink,
        &GetTemplatesByOwnerArgs {
            owner: principal_ids.controller,
            pagination: PaginationArgs {
                offset: Some(0),
                limit: Some(2),
            },
        },
    )
    .unwrap();

    assert_eq!(page1.total_count, MAX_TEMPLATES_PER_OWNER);
    assert_eq!(page1.templates.len(), 2);
    assert_eq!(page1.templates[0].template_id, ids[0]);
    assert_eq!(page1.templates[1].template_id, ids[1]);

    // Page 2: offset=2, limit=2 → templates 2,3
    let page2 = crate::client::claimlink::get_templates_by_owner(
        &pic,
        principal_ids.controller,
        claimlink,
        &GetTemplatesByOwnerArgs {
            owner: principal_ids.controller,
            pagination: PaginationArgs {
                offset: Some(2),
                limit: Some(2),
            },
        },
    )
    .unwrap();

    assert_eq!(page2.total_count, MAX_TEMPLATES_PER_OWNER);
    assert_eq!(page2.templates.len(), 2);
    assert_eq!(page2.templates[0].template_id, ids[2]);
    assert_eq!(page2.templates[1].template_id, ids[3]);

    // Page 3: offset=4, limit=2 → only template 4 (partial page)
    let page3 = crate::client::claimlink::get_templates_by_owner(
        &pic,
        principal_ids.controller,
        claimlink,
        &GetTemplatesByOwnerArgs {
            owner: principal_ids.controller,
            pagination: PaginationArgs {
                offset: Some(4),
                limit: Some(2),
            },
        },
    )
    .unwrap();

    assert_eq!(page3.total_count, MAX_TEMPLATES_PER_OWNER);
    assert_eq!(page3.templates.len(), 1);
    assert_eq!(page3.templates[0].template_id, ids[4]);
}

#[test]
fn query_with_offset_beyond_total_returns_empty() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;
    let claimlink = canister_ids.claimlink;

    create_n_templates(
        &mut pic,
        principal_ids.controller,
        claimlink,
        MAX_TEMPLATES_PER_OWNER,
    );

    // Offset past all templates
    let result = crate::client::claimlink::get_templates_by_owner(
        &pic,
        principal_ids.controller,
        claimlink,
        &GetTemplatesByOwnerArgs {
            owner: principal_ids.controller,
            pagination: PaginationArgs {
                offset: Some(100),
                limit: None,
            },
        },
    )
    .unwrap();

    assert_eq!(result.total_count, MAX_TEMPLATES_PER_OWNER);
    assert_eq!(result.templates.len(), 0);
}

#[test]
fn query_owner_with_no_templates_returns_empty() {
    let env = init();
    let TestEnv {
        pic,
        canister_ids,
        principal_ids,
    } = env;
    let claimlink = canister_ids.claimlink;

    // principal_100k_ogy is authorized but has no templates
    let result = crate::client::claimlink::get_templates_by_owner(
        &pic,
        principal_ids.principal_100k_ogy,
        claimlink,
        &GetTemplatesByOwnerArgs {
            owner: principal_ids.principal_100k_ogy,
            pagination: PaginationArgs {
                offset: None,
                limit: None,
            },
        },
    )
    .unwrap();

    assert_eq!(result.total_count, 0);
    assert_eq!(result.templates.len(), 0);
}

#[test]
fn query_after_delete_reflects_correct_count() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;
    let claimlink = canister_ids.claimlink;

    // Fill to max
    let ids = create_n_templates(
        &mut pic,
        principal_ids.controller,
        claimlink,
        MAX_TEMPLATES_PER_OWNER,
    );

    // Delete the middle template (index 2)
    crate::client::claimlink::delete_template(
        &mut pic,
        principal_ids.controller,
        claimlink,
        &ids[2],
    )
    .unwrap();

    let result = crate::client::claimlink::get_templates_by_owner(
        &pic,
        principal_ids.controller,
        claimlink,
        &GetTemplatesByOwnerArgs {
            owner: principal_ids.controller,
            pagination: PaginationArgs {
                offset: None,
                limit: None,
            },
        },
    )
    .unwrap();

    assert_eq!(result.total_count, MAX_TEMPLATES_PER_OWNER - 1);
    assert_eq!(result.templates.len() as u64, MAX_TEMPLATES_PER_OWNER - 1);

    // Deleted template should not appear
    let returned_ids: Vec<candid::Nat> = result
        .templates
        .iter()
        .map(|t| t.template_id.clone())
        .collect();
    assert!(!returned_ids.contains(&ids[2]));
}

#[test]
fn create_after_delete_allows_new_template_and_query_works() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;
    let claimlink = canister_ids.claimlink;

    // Fill to max
    let ids = create_n_templates(
        &mut pic,
        principal_ids.controller,
        claimlink,
        MAX_TEMPLATES_PER_OWNER,
    );

    // Should not be able to create another
    let over_limit = crate::client::claimlink::create_template(
        &mut pic,
        principal_ids.controller,
        claimlink,
        &CreateTemplateArgs {
            template_json: r#"{"over": "limit"}"#.to_string(),
        },
    );
    assert!(over_limit.is_err());

    // Delete one template
    crate::client::claimlink::delete_template(
        &mut pic,
        principal_ids.controller,
        claimlink,
        &ids[0],
    )
    .unwrap();

    // Now we can create a new one
    let new_id = crate::client::claimlink::create_template(
        &mut pic,
        principal_ids.controller,
        claimlink,
        &CreateTemplateArgs {
            template_json: r#"{"replacement": true}"#.to_string(),
        },
    )
    .unwrap();

    // Query should return MAX count again with the new template
    let result = crate::client::claimlink::get_templates_by_owner(
        &pic,
        principal_ids.controller,
        claimlink,
        &GetTemplatesByOwnerArgs {
            owner: principal_ids.controller,
            pagination: PaginationArgs {
                offset: None,
                limit: None,
            },
        },
    )
    .unwrap();

    assert_eq!(result.total_count, MAX_TEMPLATES_PER_OWNER);
    assert_eq!(result.templates.len() as u64, MAX_TEMPLATES_PER_OWNER);

    let returned_ids: Vec<candid::Nat> = result
        .templates
        .iter()
        .map(|t| t.template_id.clone())
        .collect();
    assert!(!returned_ids.contains(&ids[0])); // deleted one gone
    assert!(returned_ids.contains(&new_id)); // new one present
}

#[test]
fn two_owners_templates_are_isolated() {
    let env = init();
    let TestEnv {
        mut pic,
        canister_ids,
        principal_ids,
    } = env;
    let claimlink = canister_ids.claimlink;

    // Controller creates max templates
    let controller_ids = create_n_templates(
        &mut pic,
        principal_ids.controller,
        claimlink,
        MAX_TEMPLATES_PER_OWNER,
    );

    // principal_100k_ogy creates 2 templates
    let ogy_ids = create_n_templates(&mut pic, principal_ids.principal_100k_ogy, claimlink, 2);

    // Controller sees only their own
    let controller_result = crate::client::claimlink::get_templates_by_owner(
        &pic,
        principal_ids.controller,
        claimlink,
        &GetTemplatesByOwnerArgs {
            owner: principal_ids.controller,
            pagination: PaginationArgs {
                offset: None,
                limit: None,
            },
        },
    )
    .unwrap();

    assert_eq!(controller_result.total_count, MAX_TEMPLATES_PER_OWNER);
    assert_eq!(
        controller_result.templates.len() as u64,
        MAX_TEMPLATES_PER_OWNER
    );
    for (i, t) in controller_result.templates.iter().enumerate() {
        assert_eq!(t.template_id, controller_ids[i]);
    }

    // principal_100k_ogy sees only their own
    let ogy_result = crate::client::claimlink::get_templates_by_owner(
        &pic,
        principal_ids.principal_100k_ogy,
        claimlink,
        &GetTemplatesByOwnerArgs {
            owner: principal_ids.principal_100k_ogy,
            pagination: PaginationArgs {
                offset: None,
                limit: None,
            },
        },
    )
    .unwrap();

    assert_eq!(ogy_result.total_count, 2);
    assert_eq!(ogy_result.templates.len(), 2);
    for (i, t) in ogy_result.templates.iter().enumerate() {
        assert_eq!(t.template_id, ogy_ids[i]);
    }
}

#[test]
fn pagination_limit_of_one_iterates_all_templates() {
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

    // Fetch one-by-one and collect
    let mut collected_ids = vec![];
    for offset in 0..MAX_TEMPLATES_PER_OWNER {
        let result = crate::client::claimlink::get_templates_by_owner(
            &pic,
            principal_ids.controller,
            claimlink,
            &GetTemplatesByOwnerArgs {
                owner: principal_ids.controller,
                pagination: PaginationArgs {
                    offset: Some(offset),
                    limit: Some(1),
                },
            },
        )
        .unwrap();

        assert_eq!(result.total_count, MAX_TEMPLATES_PER_OWNER);
        assert_eq!(result.templates.len(), 1);
        collected_ids.push(result.templates[0].template_id.clone());
    }

    assert_eq!(collected_ids, ids);
}
