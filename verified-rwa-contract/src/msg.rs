use cosmwasm_std::Uint128;
use serde::{Deserialize, Serialize};
use schemars::JsonSchema;
use cosmwasm_schema::QueryResponses;
// Import CW721 ExecuteMsg alias and TokenExtension from ADO


/// Instantiate message for Verified RWA NFT contract
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub cw721_ado_address: String, // Address of the deployed CW721 ADO
    pub ai_agent_address: String,  // Address of the AI agent (Python backend signing wallet)
    pub kernel_address: String,    // Andromeda Kernel address
}



/// Execute messages for custom logic
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    // ... (existing VerifyAndMint)
    VerifyAndMint {
        token_id: String,
        owner: String,
        token_uri: Option<String>,
        ai_report: String,
        suggested_value: Uint128,
        rwa_publisher: String,
    },
    /// Allows the contract owner to update the CW721 ADO address
    UpdateCw721AdoAddress {
        new_address: String,
    },
}

/// Query messages for contract state

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema, QueryResponses)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    /// Returns contract configuration
    #[returns(crate::state::Config)]
    GetConfig {},
}
