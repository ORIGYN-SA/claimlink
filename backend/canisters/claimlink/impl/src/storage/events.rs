use ic_stable_structures::StableLog;
use std::cell::RefCell;

use crate::{
    storage::memory::{events_data_memory, events_index_memory, StableMemory},
    types::events::{Event, EventType},
};

type EventLog = StableLog<Event, StableMemory, StableMemory>;

thread_local! {
       /// The log of the canister state modifications.
    static EVENTS: RefCell<EventLog> =
              RefCell::new(
StableLog::init
            (events_index_memory(), events_data_memory())
            .expect("Failed to initialize events log")
    );



}

/// Appends the event to the event log.
pub fn record_event(payload: EventType) {
    EVENTS
        .with(|events| {
            events.borrow().append(&Event {
                timestamp: ic_cdk::api::time(),
                payload,
            })
        })
        .expect("recording an event should succeed");
}

/// Returns the total number of events in the audit log.
pub fn total_event_count() -> u64 {
    EVENTS.with(|events| events.borrow().len())
}

pub fn with_event_iter<F, R>(f: F) -> R
where
    F: for<'a> FnOnce(Box<dyn Iterator<Item = Event> + 'a>) -> R,
{
    EVENTS.with(|events| f(Box::new(events.borrow().iter())))
}
