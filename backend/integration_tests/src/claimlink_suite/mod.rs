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
    pub principal_100k_ogy: Principal,
    pub principal_1m_ogy: Principal,
}
#[derive(Debug)]
pub struct CanisterIds {
    pub ogy_sns_ledger: CanisterId,
    pub claimlink: CanisterId,
}
