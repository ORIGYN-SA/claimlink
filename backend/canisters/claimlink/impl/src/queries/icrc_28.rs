pub use claimlink_api::icrc_28::Icrc28TrustedOriginsResponse;

#[ic_cdk::query]
pub fn icrc28_trusted_origins() -> Icrc28TrustedOriginsResponse {
    Icrc28TrustedOriginsResponse {
        trusted_origins: vec![
            String::from("https://minting.origyn.ch"),
            String::from("https://minting.origyn.com"),
            String::from("https://eghlv-zqaaa-aaaah-qqlxa-cai.icp0.io"),
            String::from("https://eghlv-zqaaa-aaaah-qqlxa-cai.raw.icp0.io"),
            String::from("https://eghlv-zqaaa-aaaah-qqlxa-cai.ic0.app"),
            String::from("https://eghlv-zqaaa-aaaah-qqlxa-cai.raw.ic0.app"),
            String::from("https://eghlv-zqaaa-aaaah-qqlxa-cai.icp0.icp-api.io"),
            String::from("https://eghlv-zqaaa-aaaah-qqlxa-cai.icp-api.io"),
            String::from("https://eghlv-zqaaa-aaaah-qqlxa-cai.icp0.io"),
            String::from("https://eghlv-zqaaa-aaaah-qqlxa-cai.raw.icp0.io"),
            String::from("https://eghlv-zqaaa-aaaah-qqlxa-cai.ic0.app"),
            String::from("https://eghlv-zqaaa-aaaah-qqlxa-cai.raw.ic0.app"),
            String::from("https://eghlv-zqaaa-aaaah-qqlxa-cai.icp0.icp-api.io"),
            String::from("https://eghlv-zqaaa-aaaah-qqlxa-cai.icp-api.io"),
            String::from("https://s73wp-uiaaa-aaaap-qrqsq-cai.icp0.io"),
            String::from("https://s73wp-uiaaa-aaaap-qrqsq-cai.raw.icp0.io"),
            String::from("https://s73wp-uiaaa-aaaap-qrqsq-cai.ic0.app"),
            String::from("https://s73wp-uiaaa-aaaap-qrqsq-cai.raw.ic0.app"),
            String::from("https://s73wp-uiaaa-aaaap-qrqsq-cai.icp0.icp-api.io"),
            String::from("https://s73wp-uiaaa-aaaap-qrqsq-cai.icp-api.io"),
            String::from("https://s73wp-uiaaa-aaaap-qrqsq-cai.icp0.io"),
            String::from("https://s73wp-uiaaa-aaaap-qrqsq-cai.raw.icp0.io"),
            String::from("https://s73wp-uiaaa-aaaap-qrqsq-cai.ic0.app"),
            String::from("https://s73wp-uiaaa-aaaap-qrqsq-cai.raw.ic0.app"),
            String::from("https://s73wp-uiaaa-aaaap-qrqsq-cai.icp0.icp-api.io"),
            String::from("https://s73wp-uiaaa-aaaap-qrqsq-cai.icp-api.io"),
        ],
    }
}
