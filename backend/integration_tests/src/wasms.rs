use lazy_static::lazy_static;
use std::fs::File;
use std::io::Read;
use types::CanisterWasm;

lazy_static! {
    // external canisters
    pub static ref IC_ICRC1_LEDGER: CanisterWasm =
        get_external_canister_wasm("icrc_ledger");
    // internal canisters
    pub static ref CLAIMLINK: CanisterWasm = get_internal_canister_wasm("claimlink");
}

fn get_internal_canister_wasm(canister: &str) -> Vec<u8> {
    read_file_from_relative_bin(&format!(
        "../canisters/{canister}/target/wasm32-unknown-unknown/release/{canister}_canister.wasm.gz"
    ))
    .unwrap()
}
fn get_external_canister_wasm(canister: &str) -> Vec<u8> {
    read_file_from_relative_bin(&format!(
        "../external_canisters/{canister}/wasm/{canister}_canister.wasm.gz"
    ))
    .unwrap()
}

fn read_file_from_relative_bin(file_path: &str) -> Result<Vec<u8>, std::io::Error> {
    // Open the wasm file
    let mut file = File::open(file_path)?;

    // Read the contents of the file into a vector
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer)?;

    Ok(buffer)
}
