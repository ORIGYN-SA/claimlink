use candid::CandidType;
use serde::{Deserialize, Serialize};

/// Exchange Rate Canister (XRC) types.
/// XRC canister ID: uf6dk-hyaaa-aaaaq-qaaaq-cai
pub mod get_exchange_rate {
    use super::*;

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
    pub struct GetExchangeRateRequest {
        pub base_asset: Asset,
        pub quote_asset: Asset,
        pub timestamp: Option<u64>,
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
    pub struct Asset {
        pub symbol: String,
        pub class: AssetClass,
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
    pub enum AssetClass {
        Cryptocurrency,
        FiatCurrency,
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
    pub struct ExchangeRate {
        pub base_asset: Asset,
        pub quote_asset: Asset,
        pub timestamp: u64,
        pub rate: u64,
        pub metadata: ExchangeRateMetadata,
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
    pub struct ExchangeRateMetadata {
        pub decimals: u32,
        pub base_asset_num_queried_sources: u64,
        pub base_asset_num_received_rates: u64,
        pub quote_asset_num_queried_sources: u64,
        pub quote_asset_num_received_rates: u64,
        pub standard_deviation: u64,
        pub forex_timestamp: Option<u64>,
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
    pub enum ExchangeRateError {
        AnonymousPrincipalNotAllowed,
        CryptoQuoteAssetNotFound,
        FailedToAcceptCycles,
        ForexBaseAssetNotFound,
        ForexAssetsNotFound,
        ForexInvalidTimestamp,
        ForexQuoteAssetNotFound,
        StablecoinRateNotFound,
        StablecoinRateTooFewRates,
        CryptoBaseAssetNotFound,
        InconsistentRatesReceived,
        RateLimited,
        NotEnoughCycles,
        Pending,
        Other(OtherError),
    }

    #[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
    pub struct OtherError {
        pub code: u32,
        pub description: String,
    }

    pub type Args = GetExchangeRateRequest;
    pub type Response = Result<ExchangeRate, ExchangeRateError>;
}
