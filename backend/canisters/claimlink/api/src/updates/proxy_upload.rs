use crate::errors::ProxyUploadError;
use crate::mint::MintRequestId;
use candid::{CandidType, Nat};
use serde::{Deserialize, Serialize};

// proxy_init_upload
pub mod init {
    use super::*;

    pub type Args = ProxyInitUploadArgs;
    pub type Response = Result<(), ProxyUploadError>;

    #[derive(CandidType, Serialize, Deserialize, Debug)]
    pub struct ProxyInitUploadArgs {
        pub mint_request_id: MintRequestId,
        pub file_path: String,
        pub file_hash: String,
        pub file_size: Nat,
        pub chunk_size: Option<Nat>,
    }
}

// proxy_store_chunk
pub mod store {
    use super::*;
    use serde_bytes::ByteBuf;

    pub type Args = ProxyStoreChunkArgs;
    pub type Response = Result<(), ProxyUploadError>;

    #[derive(CandidType, Serialize, Deserialize, Debug)]
    pub struct ProxyStoreChunkArgs {
        pub mint_request_id: MintRequestId,
        pub file_path: String,
        pub chunk_id: Nat,
        pub chunk_data: ByteBuf,
    }
}

// proxy_finalize_upload
pub mod finalize {
    use super::*;

    pub type Args = ProxyFinalizeUploadArgs;
    pub type Response = Result<String, ProxyUploadError>;

    #[derive(CandidType, Serialize, Deserialize, Debug)]
    pub struct ProxyFinalizeUploadArgs {
        pub mint_request_id: MintRequestId,
        pub file_path: String,
    }
}
