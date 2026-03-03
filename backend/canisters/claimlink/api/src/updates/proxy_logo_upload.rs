use crate::errors::ProxyLogoUploadError;
use candid::{CandidType, Nat, Principal};
use serde::{Deserialize, Serialize};

// proxy_logo_init_upload
pub mod init {
    use super::*;

    pub type Args = ProxyLogoInitUploadArgs;
    pub type Response = Result<(), ProxyLogoUploadError>;

    #[derive(CandidType, Serialize, Deserialize, Debug)]
    pub struct ProxyLogoInitUploadArgs {
        pub collection_canister_id: Principal,
        pub file_path: String,
        pub file_hash: String,
        pub file_size: u64,
        pub chunk_size: Option<u64>,
    }
}

// proxy_logo_store_chunk
pub mod store {
    use super::*;

    pub type Args = ProxyLogoStoreChunkArgs;
    pub type Response = Result<(), ProxyLogoUploadError>;

    #[derive(CandidType, Serialize, Deserialize, Debug)]
    pub struct ProxyLogoStoreChunkArgs {
        pub collection_canister_id: Principal,
        pub file_path: String,
        pub chunk_id: Nat,
        pub chunk_data: Vec<u8>,
    }
}

// proxy_logo_finalize_upload
pub mod finalize {
    use super::*;

    pub type Args = ProxyLogoFinalizeUploadArgs;
    pub type Response = Result<String, ProxyLogoUploadError>;

    #[derive(CandidType, Serialize, Deserialize, Debug)]
    pub struct ProxyLogoFinalizeUploadArgs {
        pub collection_canister_id: Principal,
        pub file_path: String,
    }
}
