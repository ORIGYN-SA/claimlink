use candid::{CandidType, Nat};
use serde::{Deserialize, Serialize};

/// KongSwap canister types for fetching pool prices.
/// KongSwap canister: 2ipq2-uqaaa-aaaar-qailq-cai
pub mod pools {
    use super::*;

    /// Optional symbol filter e.g. Some("OGY_ckUSDT")
    pub type Args = Option<String>;

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
    pub struct PoolReply {
        pub lp_token_symbol: String,
        pub name: String,
        pub lp_fee_0: Nat,
        pub lp_fee_1: Nat,
        pub balance_0: Nat,
        pub balance_1: Nat,
        pub address_0: String,
        pub address_1: String,
        pub symbol_0: String,
        pub symbol_1: String,
        pub pool_id: u32,
        pub price: f64,
        pub chain_0: String,
        pub chain_1: String,
        pub is_removed: bool,
        pub symbol: String,
        pub lp_fee_bps: u8,
    }

    pub type Response = Result<Vec<PoolReply>, String>;
}
