use bity_ic_canister_client::{generate_candid_c2c_call, generate_candid_c2c_call_no_args};
use icpswap_pool_canister_api::*;

generate_candid_c2c_call!(quote);
generate_candid_c2c_call_no_args!(metadata);
