// src/state.rs
use cosmwasm_std::Addr;
use cw_storage_plus::Item;
use serde::{Deserialize, Serialize};
use schemars::JsonSchema;

// Stores the contract's immutable configuration
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Config {
    pub cw721_ado_address: Addr, // The address of the CW721 ADO this contract will mint on
    pub ai_agent_address: Addr,  // The address authorized to call VerifyAndMint
    pub kernel_address: Addr,    // The Andromeda Kernel address
}

// Global singleton item to store the contract's configuration
pub const CONFIG: Item<Config> = Item::new("config");


pub const OWNER: Item<Addr> = Item::new("owner"); // Add this line