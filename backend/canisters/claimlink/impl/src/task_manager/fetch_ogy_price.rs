use crate::{
    guards::{TaskType, TimerGuard},
    state::{audit::process_event, mutate_state, read_state},
    types::events::EventType,
    utils::log::DEBUG,
};
use ic_canister_log::log;

pub async fn fetch_ogy_price() {
    let _guard = match TimerGuard::new(TaskType::FetchOgyPrice) {
        Ok(guard) => guard,
        Err(e) => {
            log!(DEBUG, "Failed retrieving fetch_ogy_price guard: {e:?}");
            return;
        }
    };

    // In test mode, skip external calls — price is set via set_ogy_price endpoint
    let is_test_mode = read_state(|s| s.env.is_test_mode());
    if is_test_mode {
        return;
    }

    let icpswap_pool_canister_id = match read_state(|s| s.data.icpswap_pool_canister_id) {
        Some(id) => id,
        None => {
            log!(DEBUG, "ICPSwap pool canister ID not configured, skipping price fetch");
            return;
        }
    };

    // Step 1: Get OGY/ICP price from ICPSwap
    // Quote 1 OGY (1e8 = 100_000_000) to get ICP output
    let quote_args = icpswap_pool_canister_api::quote::Args {
        amount_in: "100000000".to_string(), // 1 OGY in e8s
        zero_for_one: true,
    };

    let ogy_per_icp_result =
        icpswap_pool_canister_c2c_client::quote(icpswap_pool_canister_id, &quote_args).await;

    let icp_per_ogy_e8s: u64 = match ogy_per_icp_result {
        Ok(Ok(amount)) => match amount.0.try_into() {
            Ok(v) => v,
            Err(e) => {
                log!(DEBUG, "Failed to convert ICPSwap quote to u64: {e:?}");
                return;
            }
        },
        Ok(Err(e)) => {
            log!(DEBUG, "ICPSwap quote error: {e:?}");
            return;
        }
        Err(e) => {
            log!(DEBUG, "ICPSwap call error: {e:?}");
            return;
        }
    };

    // Step 2: Get ICP/USD price from XRC
    let xrc_canister_id = candid::Principal::from_text("uf6dk-hyaaa-aaaaq-qaaaq-cai")
        .expect("Invalid XRC canister ID");

    let xrc_args = xrc_canister_api::get_exchange_rate::GetExchangeRateRequest {
        base_asset: xrc_canister_api::get_exchange_rate::Asset {
            symbol: "ICP".to_string(),
            class: xrc_canister_api::get_exchange_rate::AssetClass::Cryptocurrency,
        },
        quote_asset: xrc_canister_api::get_exchange_rate::Asset {
            symbol: "USD".to_string(),
            class: xrc_canister_api::get_exchange_rate::AssetClass::FiatCurrency,
        },
        timestamp: None,
    };

    let xrc_result =
        xrc_canister_c2c_client::get_exchange_rate(xrc_canister_id, &xrc_args).await;

    let (icp_usd_rate, xrc_decimals) = match xrc_result {
        Ok(Ok(exchange_rate)) => (exchange_rate.rate, exchange_rate.metadata.decimals),
        Ok(Err(e)) => {
            log!(DEBUG, "XRC exchange rate error: {e:?}");
            return;
        }
        Err(e) => {
            log!(DEBUG, "XRC call error: {e:?}");
            return;
        }
    };

    // Step 3: Calculate OGY/USD
    // icp_per_ogy_e8s = how many ICP e8s you get for 1 OGY (1e8 input)
    // icp_usd_rate = ICP/USD rate with `xrc_decimals` decimal places
    //
    // OGY/USD = (icp_per_ogy_e8s / 1e8) * (icp_usd_rate / 10^xrc_decimals)
    // We want the result in e8s (8 decimal places):
    //   usd_per_ogy_e8s = icp_per_ogy_e8s * icp_usd_rate / 10^xrc_decimals
    //
    // This works because icp_per_ogy_e8s already has 1e8 factored in from
    // quoting 1e8 input, and we want 1e8 in the output (e8s), so they cancel.
    let xrc_divisor = 10u128.pow(xrc_decimals);
    let usd_per_ogy_e8s =
        ((icp_per_ogy_e8s as u128) * (icp_usd_rate as u128) / xrc_divisor) as u64;

    if usd_per_ogy_e8s == 0 {
        log!(DEBUG, "Calculated OGY/USD price is 0, skipping update");
        return;
    }

    mutate_state(|s| {
        process_event(s, EventType::UpdatedOgyPrice { usd_per_ogy_e8s });
    });

    log!(
        DEBUG,
        "Updated OGY price: {} e8s USD per OGY (XRC decimals: {})",
        usd_per_ogy_e8s,
        xrc_decimals
    );
}
