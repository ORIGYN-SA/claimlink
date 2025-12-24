use std::cell::RefCell;

use ic_stable_structures::BTreeMap;

use crate::{
    storage::memory::{template_store_memory, wasm_store_memory, StableMemory},
    types::{
        templates::{NftTemplateBytes, NftTemplateId},
        wasm::{Wasm, WasmHash},
    },
};

pub mod memory;

pub(crate) const NFT_COLLECTION_BYTECODE: &[u8] =
    include_bytes!("../../wasm/origyn_nft_canister.wasm.gz");

thread_local! {
    /// Persistent storage for nft template binaries indexed by unique Id.
    static STABLE_STORAGE: RefCell<Option<StableStorage>> = RefCell::new(Some(StableStorage {
        wasms: WasmStore::init(wasm_store_memory()),
        templates: TemplateStore::init(template_store_memory())
    }))
}

pub type WasmStore = BTreeMap<WasmHash, Wasm, StableMemory>;
pub type TemplateStore = BTreeMap<NftTemplateId, NftTemplateBytes, StableMemory>;

pub struct StableStorage {
    pub wasms: WasmStore,
    pub templates: TemplateStore,
}

impl StableStorage {
    /// Inserts WASM into stable storage if the hash does not already exist.
    pub fn record_wasm(&mut self, wasm: Wasm) {
        let wasm_hash = wasm.hash().clone();

        if !self.wasms.contains_key(&wasm_hash) {
            self.wasms.insert(wasm_hash, wasm);
        }
    }

    /// Retrieves a WASM binary from stable storage by its hash.
    pub fn get_wasm(&self, wasm_hash: &WasmHash) -> Option<Wasm> {
        self.wasms.get(wasm_hash)
    }

    pub fn wasm_exisit(self: &mut StableStorage, wasm_hash: &WasmHash) -> bool {
        self.get_wasm(wasm_hash).is_some()
    }

    pub fn record_nft_template(
        &mut self,
        temaplte_id: NftTemplateId,
        template_bytes: NftTemplateBytes,
    ) {
        if !self.templates.contains_key(&temaplte_id) {
            self.templates.insert(temaplte_id, template_bytes);
        }
    }

    pub fn get_template(&self, temaplte_id: &NftTemplateId) -> Option<NftTemplateBytes> {
        self.templates.get(temaplte_id)
    }
}

pub fn read_stable_storage<R>(f: impl FnOnce(&StableStorage) -> R) -> R {
    STABLE_STORAGE.with(|cell| {
        f(cell
            .borrow()
            .as_ref()
            .expect("BUG: stable storage is not initialized"))
    })
}

// / Mutates (part of) the current state using `f`.
// /
// / Panics if there is no state.
pub fn mutate_stable_storage<F, R>(f: F) -> R
where
    F: FnOnce(&mut StableStorage) -> R,
{
    STABLE_STORAGE.with(|cell| {
        f(cell
            .borrow_mut()
            .as_mut()
            .expect("BUG: stable storage is not initialized"))
    })
}

pub fn record_nft_collection_wasm() -> WasmHash {
    let wasm = Wasm::new(NFT_COLLECTION_BYTECODE.to_vec());
    let wasm_hash = wasm.hash().clone();
    mutate_stable_storage(|s| s.record_wasm(wasm));

    wasm_hash
}

#[cfg(test)]
pub mod tests;
