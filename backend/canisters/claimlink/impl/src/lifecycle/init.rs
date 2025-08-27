pub use claimlink_api::init::InitArgs;
use ic_cdk_macros::init;
use tracing::info;
use utils::env::CanisterEnv;

use crate::state::{Data, RuntimeState};

use super::init_canister;

#[init]
fn init(args: InitArgs) {
    bity_ic_canister_logger::init(args.test_mode);

    let env = CanisterEnv::new(args.test_mode);

    let runtime_state = RuntimeState::new(
        env.clone(),
        Data::new(args.ledger_canister_id, args.authorized_principals),
    );

    init_canister(runtime_state);

    info!("Init complete.")
}
