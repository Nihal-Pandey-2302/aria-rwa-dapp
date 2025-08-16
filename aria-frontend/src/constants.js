// Chain Configuration
export const CHAIN_ID = "galileo-4";
export const CHAIN_NAME = "Andromeda Testnet";
export const RPC_URL = "https://api.andromedaprotocol.io/rpc/testnet";
export const REST_URL = "https://api.andromedaprotocol.io/rest/testnet";
export const BECH32_PREFIX = "andr";
export const DENOM_MINIMAL = "uandr";
export const DENOM_DISPLAY = "ANDR";
export const DENOM_DECIMALS = 6;
export const GAS_PRICE_STEP = {
  low: 0.01,
  average: 0.025,
  high: 0.03,
};

// Backend API URL
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";

// Contract Addresses
export const VERIFIED_RWA_CONTRACT_ADDRESS = "andr132hquqqs0m64hthpv6wpjwgnmgpr2exrwvhw9kqpqeh4dk4ls4tq3ldsjm";
export const NEW_CW721_ADO_ADDRESS = "andr104t7skjtky657cr88fnfjzqmzxvpm0fgfkhazerd9aeq4ktneu7qm828l9";
export const MARKETPLACE_ADO_ADDRESS = "andr1f5l38d5ztvrxuwvsr9vvnk9u0qglsrfwp8t064fq4ze8uh0k3jqsv5hxjk";
export const SPLITTER_ADO_ADDRESS = "andr13tpamsp58gcu8xte4gwdkhd7laapfztqkucs7za9dnyekkrklgnqhs38k7";
export const ARIA_APP_ADDRESS = "andr1epwyxg4vt2f7g8udddzfzmhsdr0zm3lcs8j38rad7q03ma6l2vwqnhqnae";
export const STAKING_APP_ADDRESS = "andr1kjxasu7d504amhr7h3jnyvcryc702agtpqcsnu5648gtky0fjphszfupwr";