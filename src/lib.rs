use std::collections::BTreeMap;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::store::UnorderedMap;
use near_sdk::near_bindgen;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct NamedCounter {
    counts: UnorderedMap<String, u64>,
}

impl Default for NamedCounter {
    fn default() -> Self {
        Self {
            counts: UnorderedMap::new(b"r"),
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

    pub fn get_accounts(&self) -> BTreeMap<&String, &u64> {
        self.counts.iter().collect()
    }
}
