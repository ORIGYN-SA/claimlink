use candid::Principal;
use pocket_ic::PocketIc;
use types::CanisterId;

mod init;
mod tests;

pub struct TestEnv {
    pub pic: PocketIc,
    pub canister_ids: CanisterIds,
    pub principal_ids: PrincipalIds,
}

#[derive(Debug, Clone)]
pub struct PrincipalIds {
    pub controller: Principal,
}
#[derive(Debug)]
pub struct CanisterIds {
    pub ogy_sns_ledger: CanisterId,
}
