use candid::{Nat, Principal};
use claimlink_api::{
    cycles::CyclesManagement,
    init::{AuthordiedPrincipal, InitArg},
    pricing::MintPricingConfig,
    types::lifecycle::ClaimlinkArgs,
};
use icrc_ledger_canister::init::{ArchiveOptions as ArchiveOptionsIcrc, InitArgs, LedgerArgument};

use icrc_ledger_types::icrc1::account::Account;
use pocket_ic::{PocketIc, PocketIcBuilder};
use std::{env, path::Path};
use utils::consts::E8S_FEE_OGY;

use crate::{
    claimlink_suite::PrincipalIds,
    client::pocket::{create_canister, install_canister},
    utils::random_principal,
    wasms,
};

pub const OGY_TO_PAY: u64 = 1_500_000_000_000; // 15k ogy
pub const MAX_TEMPLATES_PER_OWNER: u64 = 5;

use super::{CanisterIds, TestEnv};

pub static POCKET_IC_BIN: &str = "./pocket-ic";

pub fn init() -> TestEnv {
    validate_pocketic_installation();
    println!("install validate");

    let mut pic = PocketIcBuilder::new()
        .with_application_subnet()
        .with_application_subnet()
        .with_sns_subnet()
        .with_fiduciary_subnet()
        .with_nns_subnet()
        .with_system_subnet()
        .build();

    println!("pic set");

    let principal_ids: PrincipalIds = PrincipalIds {
        controller: random_principal(),
        principal_100k_ogy: random_principal(),
        principal_1m_ogy: random_principal(),
        bank_principal_id: random_principal(),
    };

    let canisters = install_canisters(&mut pic, &principal_ids);
    let canister_ids: CanisterIds = CanisterIds {
        ogy_sns_ledger: canisters.ogy_sns_ledger,
        claimlink: canisters.claimlink,
    };

    TestEnv {
        pic,
        canister_ids,
        principal_ids,
    }
}

pub fn validate_pocketic_installation() {
    let path = POCKET_IC_BIN;

    if !Path::new(&path).exists() {
        println!(
            "
        Could not find the PocketIC binary to run canister integration tests.

        I looked for it at {:?}. You can specify another path with the environment variable POCKET_IC_BIN (note that I run from {:?}).
        ",
            &path,
            &env
                ::current_dir()
                .map(|x| x.display().to_string())
                .unwrap_or_else(|_| "an unknown directory".to_string())
        );
    }
}

fn install_canisters(pic: &mut PocketIc, principal_ids: &PrincipalIds) -> CanisterIds {
    let origyn_sns_ledger_canister_id: Principal = create_canister(pic, principal_ids.controller);
    let origyn_sns_ledger_canister_wasm = wasms::IC_ICRC1_LEDGER.clone();

    let accounts_with_ogy: Vec<(Account, Nat)> = vec![
        (
            Account::from(principal_ids.principal_100k_ogy),
            Nat::from(100_000 * utils::consts::E8S_PER_OGY),
        ),
        (
            Account::from(principal_ids.principal_1m_ogy),
            Nat::from(1_000_000 * utils::consts::E8S_PER_OGY),
        ),
    ];

    let origyn_sns_ledger_init_args = LedgerArgument::Init(InitArgs {
        minting_account: Account::from(principal_ids.bank_principal_id),
        initial_balances: accounts_with_ogy,
        transfer_fee: E8S_FEE_OGY.into(),
        token_name: "Origyn".into(),
        token_symbol: "OGY".into(),
        metadata: Vec::new(),
        archive_options: ArchiveOptionsIcrc {
            trigger_threshold: 1000,
            num_blocks_to_archive: 1000,
            controller_id: principal_ids.controller,
        },
    });

    install_canister(
        pic,
        principal_ids.controller,
        origyn_sns_ledger_canister_id,
        origyn_sns_ledger_canister_wasm.clone(),
        origyn_sns_ledger_init_args,
    );

    let claimlink_canister_id: Principal = create_canister(pic, principal_ids.controller);
    let claimlink_canister_wasm = wasms::CLAIMLINK.clone();

    let claimlink_init_args = ClaimlinkArgs::InitArg(InitArg {
        test_mode: true,
        ledger_canister_id: origyn_sns_ledger_canister_id,
        authorized_principals: vec![
            AuthordiedPrincipal {
                name: "Contoller".to_string(),
                principal: principal_ids.controller,
            },
            AuthordiedPrincipal {
                name: "100kOGY".to_string(),
                principal: principal_ids.principal_100k_ogy,
            },
        ],
        bank_principal_id: principal_ids.bank_principal_id,
        commit_hash: "a1b2c3d4e5f67890abcdef1234567890abcTESTTEST".to_string(),
        cycles_management: CyclesManagement {
            cycles_for_collection_creation: 2_500_000_000_000,
            cycles_top_up_increment: 5_000_000_000_000,
        },
        collection_request_fee: OGY_TO_PAY.into(),
        ogy_transfer_fee: E8S_FEE_OGY.into(),
        max_creation_retries: 5_u8.into(),
        max_template_per_owner: MAX_TEMPLATES_PER_OWNER.into(),
        base_url: Some(String::from("https://{canister_id}.raw.icp0.io")),
        mint_pricing: Some(MintPricingConfig {
            base_mint_fee_usd_e8s: 1_000_000,       // $0.01
            storage_fee_per_mb_usd_e8s: 4_600_000,   // $0.046
        }),
        icpswap_pool_canister_id: None,
        kongswap_canister_id: None,
    });

    install_canister(
        pic,
        principal_ids.controller,
        claimlink_canister_id,
        claimlink_canister_wasm,
        claimlink_init_args,
    );

    CanisterIds {
        ogy_sns_ledger: origyn_sns_ledger_canister_id,
        claimlink: claimlink_canister_id,
    }
}
