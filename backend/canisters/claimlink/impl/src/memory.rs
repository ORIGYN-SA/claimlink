use ic_stable_structures::{
    memory_manager::{ MemoryId, MemoryManager, VirtualMemory },
    DefaultMemoryImpl,
};

const UPGRADES: MemoryId = MemoryId::new(0);
const COLLECTIONS: MemoryId = MemoryId::new(1);
const COLLECTIONS_BY_OWNER: MemoryId = MemoryId::new(2);
const COLLECTIONS_ORDERED: MemoryId = MemoryId::new(3);

pub type VM = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    static MEMORY_MANAGER: MemoryManager<DefaultMemoryImpl> = MemoryManager::init(
        DefaultMemoryImpl::default()
    );
}

pub fn get_upgrades_memory() -> VM {
    get_memory(UPGRADES)
}

pub fn get_collections_memory() -> VM {
    get_memory(COLLECTIONS)
}

pub fn get_collections_by_owner_memory() -> VM {
    get_memory(COLLECTIONS_BY_OWNER)
}

pub fn get_collections_ordered_memory() -> VM {
    get_memory(COLLECTIONS_ORDERED)
}

fn get_memory(id: MemoryId) -> VM {
    MEMORY_MANAGER.with(|m| m.get(id))
}
