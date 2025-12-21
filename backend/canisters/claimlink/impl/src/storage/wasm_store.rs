use crate::{
    storage::memory::{wasm_store_memory, StableMemory},
    types::wasm::{Wasm, WasmHash},
};
use ic_stable_structures::BTreeMap;
use std::cell::RefCell;

pub(crate) const NFT_COLLECTION_BYTECODE: &[u8] =
    include_bytes!("../../wasm/origyn_nft_canister.wasm.gz");

pub type WasmStore = BTreeMap<WasmHash, Wasm, StableMemory>;

thread_local! {
    /// Persistent storage for WASM binaries indexed by their content hash.
    static WASM_STORE: RefCell<WasmStore> = RefCell::new(WasmStore::init(wasm_store_memory()));
}

/// Inserts WASM into stable storage if the hash does not already exist.
pub fn wasm_store_insert(wasm_store: &mut WasmStore, wasm: Wasm) {
    let wasm_hash = wasm.hash().clone();

    if !wasm_store.contains_key(&wasm_hash) {
        wasm_store.insert(wasm_hash, wasm);
    }
}

/// Retrieves a WASM binary from stable storage by its hash.
pub fn wasm_store_get(wasm_store: &WasmStore, wasm_hash: &WasmHash) -> Option<Wasm> {
    wasm_store.get(wasm_hash)
}

pub fn record_nft_collection_wasm(wasm_store: &mut WasmStore) -> WasmHash {
    let wasm = Wasm::new(NFT_COLLECTION_BYTECODE.to_vec());
    let wasm_hash = wasm.hash().clone();
    wasm_store_insert(wasm_store, wasm);

    wasm_hash
}

pub fn wasm_store_contain(wasm_store: &WasmStore, wasm_hash: &WasmHash) -> bool {
    match wasm_store_get(wasm_store, wasm_hash) {
        Some(_) => true,
        None => false,
    }
}

pub fn read_wasm_store<R>(f: impl FnOnce(&WasmStore) -> R) -> R {
    WASM_STORE.with(|w| f(&w.borrow()))
}

pub fn mutate_wasm_store<R>(f: impl FnOnce(&mut WasmStore) -> R) -> R {
    WASM_STORE.with(|w| f(&mut w.borrow_mut()))
}
