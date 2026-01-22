pub mod create_canister {

    pub type Args = ic_management_canister_types::CreateCanisterArgs;
    pub type Response = ic_management_canister_types::CreateCanisterResult;
}

pub mod install_code {
    pub type Args = ic_management_canister_types::InstallCodeArgs;
    pub type Response = ();
}
