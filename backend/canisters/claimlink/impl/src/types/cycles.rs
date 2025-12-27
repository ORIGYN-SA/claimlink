#[derive(Clone, Eq, PartialEq, Ord, PartialOrd, Debug)]
pub struct CyclesManagement {
    pub cycles_for_collection_creation: u128,
    pub cycles_top_up_increment: u128,
}

impl Default for CyclesManagement {
    fn default() -> Self {
        const TEN_TRILLIONS: u128 = 10_000_000_000_000;

        const FIVE_TRILLIONS: u128 = 5_000_000_000_000;

        Self {
            cycles_for_collection_creation: (TEN_TRILLIONS),
            cycles_top_up_increment: (FIVE_TRILLIONS),
        }
    }
}

impl CyclesManagement {
    /// Minimum amount of cycles the Manager should always have and some slack.
    ///
    /// The chosen amount must ensure that the orchestrator is always able to spawn a new ICRC1 ledger suite.
    pub fn minimum_manager_cycles(&self) -> u128 {
        (self.cycles_for_collection_creation + self.cycles_top_up_increment) * 5
    }

    /// Minimum amount of cycles all monitored canisters should always have and some slack.
    ///
    /// The chosen amount must ensure that the NFT collection be able to spawn an storage canister
    /// at any time.
    pub fn minimum_monitored_canister_cycles(&self) -> u128 {
        self.cycles_top_up_increment
    }
}
