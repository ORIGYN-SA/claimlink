use crate::{guards, state::read_state};
use candid::Nat;
use claimlink_api::errors::BurnNftError;
pub use claimlink_api::updates::burn_nft::{Args as BurnNftArgs, Response as BurnNftResponse};
use icrc_ledger_types::icrc1::account::Account;
use utils::env::Environment;

#[ic_cdk::update(guard = "guards::reject_anonymous_caller")]
#[bity_ic_canister_tracing_macros::trace]
pub async fn burn_nft(args: BurnNftArgs) -> BurnNftResponse {
    let caller = read_state(|s| s.env.caller());

    // Validate collection exists in claimlink state
    let collection_exists = read_state(|s| {
        s.data
            .collection_requests
            .values()
            .any(|c| c.canister_id == Some(args.collection_canister_id))
    });

    if !collection_exists {
        return Err(BurnNftError::CollectionNotFound);
    }

    // Verify caller owns the token
    let owner_result = origyn_nft_canister_c2c_client::icrc7_owner_of(
        args.collection_canister_id,
        &vec![args.token_id.clone()],
    )
    .await;

    match owner_result {
        Ok(owners) => {
            if let Some(Some(owner)) = owners.first() {
                if owner.owner != caller {
                    return Err(BurnNftError::CallerNotTokenOwner);
                }
            } else {
                return Err(BurnNftError::BurnError("Token not found".to_string()));
            }
        }
        Err(e) => return Err(BurnNftError::BurnError(e.to_string())),
    }

    // Burn the NFT via collection canister
    let burn_result =
        origyn_nft_canister_c2c_client::burn_nft(args.collection_canister_id, &args.token_id)
            .await;

    match burn_result {
        Ok(Ok(())) => Ok(()),
        Ok(Err(e)) => Err(BurnNftError::BurnError(format!("{e:?}"))),
        Err(e) => Err(BurnNftError::BurnError(e.to_string())),
    }
}
