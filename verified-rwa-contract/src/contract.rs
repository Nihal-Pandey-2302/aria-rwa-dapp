// src/contract.rs
use cosmwasm_std::{
    entry_point, to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response,
    CosmosMsg, WasmMsg, Uint128, // Added Addr import for OWNER type
};

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{Config, CONFIG, OWNER}; // Added OWNER import
use andromeda_non_fungible_tokens::cw721::{ExecuteMsg as Cw721AdoExecuteMsg, TokenExtension};

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    // Validate addresses
    let config = Config {
        cw721_ado_address: deps.api.addr_validate(&msg.cw721_ado_address)?,
        ai_agent_address: deps.api.addr_validate(&msg.ai_agent_address)?,
        kernel_address: deps.api.addr_validate(&msg.kernel_address)?,
    };
    CONFIG.save(deps.storage, &config)?;

    // Store the contract owner (the address that instantiated this contract)
    OWNER.save(deps.storage, &info.sender)?; // Save the owner

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender)
        .add_attribute("cw721_ado_address", msg.cw721_ado_address)
        .add_attribute("ai_agent_address", msg.ai_agent_address))
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::VerifyAndMint {
            token_id,
            owner,
            token_uri,
            ai_report,
            suggested_value,
            rwa_publisher,
        } => execute_verify_and_mint(deps, info, token_id, owner, token_uri, ai_report, suggested_value, rwa_publisher),
        
        // --- NEW: UpdateCw721AdoAddress message ---
        ExecuteMsg::UpdateCw721AdoAddress { new_address } => {
            let owner = OWNER.load(deps.storage)?;
            // Only the contract owner can update this address
            if info.sender != owner {
                return Err(ContractError::Unauthorized {});
            }

            let mut config = CONFIG.load(deps.storage)?;
            config.cw721_ado_address = deps.api.addr_validate(&new_address)?; // Validate and update
            CONFIG.save(deps.storage, &config)?;

            Ok(Response::new()
                .add_attribute("action", "update_cw721_ado_address")
                .add_attribute("new_address", new_address))
        }
    }
}

pub fn execute_verify_and_mint(
    deps: DepsMut,
    info: MessageInfo,
    token_id: String,
    owner: String,
    token_uri: Option<String>,
    _ai_report: String,
    _suggested_value: Uint128,
    rwa_publisher: String,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;

    // Access control: only the AI agent can call this
    if info.sender != config.ai_agent_address {
        return Err(ContractError::Unauthorized {});
    }

    let mint_msg = Cw721AdoExecuteMsg::Mint {
        token_id: token_id.clone(),
        owner: owner.clone(),
        token_uri,
        extension: TokenExtension {
            publisher: rwa_publisher,
        },
    };

    let cosmos_mint_msg: CosmosMsg = CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: config.cw721_ado_address.to_string(),
        msg: to_json_binary(&mint_msg)?,
        funds: vec![],
    });

    Ok(Response::new()
        .add_message(cosmos_mint_msg)
        .add_attribute("action", "verify_and_mint")
        .add_attribute("token_id", token_id)
        .add_attribute("nft_owner", owner))
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> Result<Binary, ContractError> {
    match msg {
        QueryMsg::GetConfig {} => Ok(to_json_binary(&CONFIG.load(deps.storage)?)?),
    }
}