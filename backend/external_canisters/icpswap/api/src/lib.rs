use candid::{CandidType, Nat};
use serde::{Deserialize, Serialize};

/// ICPSwap pool canister types for fetching swap prices.
/// Pool canister for OGY/ICP: ttnzy-lyaaa-aaaag-qj2bq-cai

pub mod quote {
    use super::*;

    /// Arguments for getting a price quote from the pool.
    /// `amountIn` is the amount of the input token (in e8s).
    /// `zeroForOne` indicates direction: true = token0→token1, false = token1→token0.
    #[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
    pub struct Args {
        #[serde(rename = "amountIn")]
        pub amount_in: String,
        #[serde(rename = "zeroForOne")]
        pub zero_for_one: bool,
    }

    pub type Response = Result<Nat, QuoteError>;

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
    pub enum QuoteError {
        InternalError(String),
    }
}

pub mod metadata {
    use super::*;

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
    pub struct PoolMetadata {
        pub fee: Nat,
        pub key: String,
        pub sqrtPriceX96: Nat,
        pub tick: candid::Int,
        pub liquidity: Nat,
        pub token0: TokenMetadata,
        pub token1: TokenMetadata,
        pub maxLiquidityPerTick: Nat,
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
    pub struct TokenMetadata {
        pub address: String,
        pub standard: String,
    }

    pub type Args = ();
    pub type Response = Result<PoolMetadata, MetadataError>;

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
    pub enum MetadataError {
        InternalError(String),
    }
}
