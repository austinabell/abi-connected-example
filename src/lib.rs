use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::near_bindgen;
use near_sdk::store::LookupMap;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct NamedCounter {
    counts: LookupMap<String, u64>,
}

impl Default for NamedCounter {
    fn default() -> Self {
        Self {
            counts: LookupMap::new(b"r"),
        }
    }
}

#[near_bindgen]
impl NamedCounter {
    pub fn add(&mut self, name: String, amount: u64) {
        *self.counts.entry(name).or_default() += amount;
    }

    pub fn get_amount(&self, name: &String) -> Option<&u64> {
        self.counts.get(name)
    }
}
