use candid::Principal;
use minicbor::{Decode, Encode};

use crate::types::wasm::WasmHash;

#[derive(Debug, Encode, Decode, Clone)]
pub enum Canister {
    /// Canister created with the given principal
    /// but wasm module is not yet installed.
    #[n(0)]
    Created {
        #[cbor(n(0), with = "crate::cbor::principal")]
        canister_id: Principal,
    },

    /// Canister created and wasm module installed.
    /// The wasm_hash reflects the installed wasm module by the lsm
    /// but *may differ* from the one being currently deployed (if another controller did an upgrade)
    #[n(1)]
    Installed {
        #[cbor(n(0), with = "crate::cbor::principal")]
        canister_id: Principal,
        #[n(1)]
        installed_wasm_hash: WasmHash,
    },
}

impl Canister {
    pub fn canister_id(&self) -> &Principal {
        match self {
            Canister::Created { canister_id } | Canister::Installed { canister_id, .. } => {
                canister_id
            }
        }
    }

    pub fn installed_wasm_hash(&self) -> Option<&WasmHash> {
        match self {
            Canister::Created { .. } => None,
            Canister::Installed {
                installed_wasm_hash,
                ..
            } => Some(installed_wasm_hash),
        }
    }
}
