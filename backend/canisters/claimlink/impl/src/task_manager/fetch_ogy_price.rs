use crate::{
    guards::{TaskType, TimerGuard},
    state::{audit::process_event, mutate_state, read_state},
    types::events::EventType,
    utils::log::DEBUG,
};
use ic_canister_log::log;

const KONGSWAP_CANISTER_ID: &str = "2ipq2-uqaaa-aaaar-qailq-cai";
const OGY_CKUSDT_SYMBOL: &str = "OGY_ckUSDT";

pub async fn fetch_ogy_price() {
    let _guard = match TimerGuard::new(TaskType::FetchOgyPrice) {
        Ok(guard) => guard,
        Err(e) => {
            log!(DEBUG, "Failed retrieving fetch_ogy_price guard: {e:?}");
            return;
        }
    };

    let kongswap_canister_id = read_state(|s| s.data.kongswap_canister_id).unwrap_or_else(|| {
        candid::Principal::from_text(KONGSWAP_CANISTER_ID).expect("Invalid KongSwap canister ID")
    });

    let pools_result = kongswap_canister_c2c_client::pools(
        kongswap_canister_id,
        &Some(OGY_CKUSDT_SYMBOL.to_string()),
    )
    .await;

    let pools = match pools_result {
        Ok(Ok(pools)) => pools,
        Ok(Err(e)) => {
            log!(DEBUG, "KongSwap pools error: {e}");
            return;
        }
        Err(e) => {
            log!(DEBUG, "KongSwap call error: {e:?}");
            return;
        }
    };

    let pool = match pools
        .iter()
        .find(|p| p.symbol == OGY_CKUSDT_SYMBOL && !p.is_removed)
    {
        Some(pool) => pool,
        None => {
            log!(DEBUG, "OGY_ckUSDT pool not found in KongSwap response");
            return;
        }
    };

    let usd_per_ogy_e8s = (pool.price * 1e8) as u64;

    if usd_per_ogy_e8s == 0 {
        log!(DEBUG, "Calculated OGY/USD price is 0, skipping update");
        return;
    }

    mutate_state(|s| {
        process_event(s, EventType::UpdatedOgyPrice { usd_per_ogy_e8s });
    });

    log!(
        DEBUG,
        "Updated OGY price: {} e8s USD per OGY (raw price: {})",
        usd_per_ogy_e8s,
        pool.price
    );
}
