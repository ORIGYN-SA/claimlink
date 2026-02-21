use candid::CandidType;
use minicbor::{Decode, Encode};
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Encode, Decode, PartialEq, Eq, CandidType, Serialize, Deserialize)]
pub struct MintPricingConfig {
    /// Base fee per NFT mint in USD e8s (e.g., $0.01 = 1_000_000)
    #[n(0)]
    pub base_mint_fee_usd_e8s: u64,
    /// Storage fee per MB (5 years) in USD e8s (e.g., $0.046 = 4_600_000)
    #[n(1)]
    pub storage_fee_per_mb_usd_e8s: u64,
}

#[derive(Clone, Debug, Encode, Decode, PartialEq, Eq, CandidType, Serialize, Deserialize)]
pub struct OgyPriceData {
    /// USD per OGY in e8s (e.g., $0.006 = 600_000)
    #[n(0)]
    pub usd_per_ogy_e8s: u64,
    /// Timestamp when price was last updated
    #[n(1)]
    pub updated_at: u64,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct MintCostEstimate {
    pub total_usd_e8s: u64,
    pub total_ogy_e8s: u64,
    pub ogy_usd_price_e8s: u64,
    pub breakdown: MintCostBreakdown,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct MintCostBreakdown {
    pub base_fee_usd_e8s: u64,
    pub storage_fee_usd_e8s: u64,
}
