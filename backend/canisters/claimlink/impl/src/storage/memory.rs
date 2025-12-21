use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::DefaultMemoryImpl;
use std::cell::RefCell;

pub type StableMemory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );
}

const WASM_STORE_MEMORY_ID: MemoryId = MemoryId::new(0);

pub fn wasm_store_memory() -> StableMemory {
    MEMORY_MANAGER.with(|m| m.borrow().get(WASM_STORE_MEMORY_ID))
}
