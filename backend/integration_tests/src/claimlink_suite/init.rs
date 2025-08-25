use candid::Principal;
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

    let get_app_subnets = pic.topology().get_app_subnets()[1];

    println!("topology {:?}", pic.topology());
    println!("get_app_subnets {:?}", get_app_subnets.to_string());
    println!("pic set");

    let principal_ids: PrincipalIds = PrincipalIds {
        controller: random_principal(),
    };

    let canisters = install_canisters(&mut pic, principal_ids.controller);
    let canister_ids: CanisterIds = CanisterIds {
        ogy_sns_ledger: canisters.ogy_sns_ledger,
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

fn install_canisters(pic: &mut PocketIc, controller: Principal) -> CanisterIds {
    let origyn_sns_ledger_canister_id: Principal = create_canister(pic, controller);

    let origyn_sns_ledger_canister_wasm = wasms::IC_ICRC1_LEDGER.clone();

    install_canister(
        pic,
        controller,
        origyn_sns_ledger_canister_id,
        origyn_sns_ledger_canister_wasm.clone(),
        {},
    );

    let origyn_sns_ledger_init_args = LedgerArgument::Init(InitArgs {
        minting_account: Account::from(controller),
        initial_balances: Vec::new(),
        transfer_fee: E8S_FEE_OGY.into(),
        token_name: "Origyn".into(),
        token_symbol: "OGY".into(),
        metadata: Vec::new(),
        archive_options: ArchiveOptionsIcrc {
            trigger_threshold: 1000,
            num_blocks_to_archive: 1000,
            controller_id: controller,
        },
    });

    install_canister(
        pic,
        controller,
        origyn_sns_ledger_canister_id,
        origyn_sns_ledger_canister_wasm,
        origyn_sns_ledger_init_args,
    );

    CanisterIds {
        ogy_sns_ledger: origyn_sns_ledger_canister_id,
    }
}
