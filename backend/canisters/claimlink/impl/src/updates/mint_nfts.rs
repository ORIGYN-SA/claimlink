use crate::{
    guards,
    state::{audit::process_event, mutate_state, read_state},
    types::events::EventType,
};
use candid::Nat;
use claimlink_api::errors::MintNftsError;
pub use claimlink_api::updates::mint_nfts::{Args as MintNftsArgs, Response as MintNftsResponse};
use utils::env::Environment;

const MAX_ITEMS_PER_CALL: usize = 50;

#[ic_cdk::update(guard = "guards::reject_anonymous_caller")]
#[bity_ic_canister_tracing_macros::trace]
pub async fn mint_nfts(args: MintNftsArgs) -> MintNftsResponse {
    if args.mint_items.is_empty() {
        return Err(MintNftsError::NoItemsProvided);
    }

    if args.mint_items.len() > MAX_ITEMS_PER_CALL {
        return Err(MintNftsError::TooManyItems {
            max: Nat::from(MAX_ITEMS_PER_CALL as u64),
        });
    }

    let count = args.mint_items.len() as u64;

    let collection_canister_id = read_state(|s| {
        let caller = s.env.caller();
        let request = s
            .data
            .get_mint_request(args.mint_request_id)
            .ok_or(MintNftsError::MintRequestNotFound)?;

        if request.owner != caller {
            return Err(MintNftsError::Unauthorized);
        }

        if !request.is_active() {
            return Err(MintNftsError::MintRequestNotActive);
        }

        if !request.can_mint(count) {
            return Err(MintNftsError::MintLimitExceeded {
                allowed: Nat::from(request.num_mints),
                already_minted: Nat::from(request.minted_count),
                requested: Nat::from(count),
            });
        }

        Ok(request.collection_canister_id)
    })?;

    // Consume items by moving them into ORIGYN MintRequests (no clone)
    let mint_requests: Vec<origyn_nft_canister_api::mint::MintRequest> = args
        .mint_items
        .into_iter()
        .map(|item| origyn_nft_canister_api::mint::MintRequest {
            token_owner: item.token_owner,
            metadata: item.metadata,
            memo: item.memo,
        })
        .collect();

    let mint_args = origyn_nft_canister_api::mint::Args { mint_requests };

    let result = origyn_nft_canister_c2c_client::mint(collection_canister_id, &mint_args).await;

    match result {
        Ok(Ok(first_token_id)) => {
            let first_id: u64 = first_token_id.0.try_into().unwrap_or(0);

            // Generate token IDs (ORIGYN NFT returns the first ID, sequential from there)
            let token_ids: Vec<u64> = (first_id..first_id + count).collect();
            let token_nats: Vec<Nat> = token_ids.iter().map(|id| Nat::from(*id)).collect();

            mutate_state(|s| {
                process_event(
                    s,
                    EventType::NftsMinted {
                        mint_request_id: args.mint_request_id,
                        count,
                        token_ids,
                    },
                );

                let request = s.data.get_mint_request(args.mint_request_id).unwrap();
                if request.minted_count == request.num_mints {
                    process_event(
                        s,
                        EventType::MintRequestCompleted {
                            mint_request_id: args.mint_request_id,
                        },
                    );
                }
            });

            Ok(token_nats)
        }
        Ok(Err(e)) => Err(MintNftsError::MintError(format!("{e:?}"))),
        Err(e) => Err(MintNftsError::MintError(e.to_string())),
    }
}
