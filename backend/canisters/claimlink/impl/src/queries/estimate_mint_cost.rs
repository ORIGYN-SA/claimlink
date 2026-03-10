use crate::state::read_state;
use crate::updates::initialize_mint::calculate_mint_cost;
use claimlink_api::errors::EstimateMintCostError;
use claimlink_api::pricing::{MintCostBreakdown, MintCostEstimate};
pub use claimlink_api::queries::estimate_mint_cost::{
    Args as EstimateMintCostArgs, Response as EstimateMintCostResponse,
};

#[ic_cdk::query]
#[bity_ic_canister_tracing_macros::trace]
pub fn estimate_mint_cost(args: EstimateMintCostArgs) -> EstimateMintCostResponse {
    let (mint_pricing, usd_per_ogy_e8s) = read_state(|s| {
        (
            s.data.mint_pricing,
            s.data.ogy_price.map(|p| p.usd_per_ogy_e8s),
        )
    });

    let usd_per_ogy_e8s = usd_per_ogy_e8s.ok_or(EstimateMintCostError::OgyPriceNotAvailable)?;

    let mint_pricing = mint_pricing.ok_or(EstimateMintCostError::MintPricingNotConfigured)?;

    let total_file_size_bytes: u64 = args.total_file_size_bytes.0.try_into().unwrap_or(u64::MAX);

    let (total_usd_e8s, total_ogy_e8s) = calculate_mint_cost(
        args.num_mints,
        total_file_size_bytes,
        mint_pricing.base_mint_fee_usd_e8s,
        mint_pricing.storage_fee_per_mb_usd_e8s,
        usd_per_ogy_e8s,
    );

    let base_fee_usd_e8s = mint_pricing.base_mint_fee_usd_e8s * args.num_mints;
    let storage_fee_usd_e8s = total_usd_e8s.saturating_sub(base_fee_usd_e8s);

    Ok(MintCostEstimate {
        total_usd_e8s,
        total_ogy_e8s: total_ogy_e8s as u64,
        ogy_usd_price_e8s: usd_per_ogy_e8s,
        breakdown: MintCostBreakdown {
            base_fee_usd_e8s,
            storage_fee_usd_e8s,
        },
    })
}
