import {
  ICP_LEDGER_CANISTER_ID,
  GLDT_LEDGER_CANISTER_ID,
  OGY_LEDGER_CANISTER_ID,
  CKUSDT_LEDGER_CANISTER_ID,
  ICP_LEDGER_INDEX_CANISTER_ID,
  GLDT_LEDGER_INDEX_CANISTER_ID,
  OGY_LEDGER_INDEX_CANISTER_ID,
  CKUSDT_LEDGER_INDEX_CANISTER_ID,
} from "../constants";
import type { Token } from "../types/tokens";

export const TOKEN_ICP: Token = {
  id: "icp",
  name: "ICP",
  display_name: "ICP",
  label: "Internet Computer",
  canister_id: ICP_LEDGER_CANISTER_ID,
  canister_id_ledger_index: ICP_LEDGER_INDEX_CANISTER_ID,
};

export const TOKEN_GLDT: Token = {
  id: "gldt",
  name: "GLDT",
  display_name: "GLDT",
  label: "Gold Token",
  canister_id: GLDT_LEDGER_CANISTER_ID,
  canister_id_ledger_index: GLDT_LEDGER_INDEX_CANISTER_ID,
};

export const TOKEN_OGY: Token = {
  id: "ogy",
  name: "OGY",
  display_name: "OGY",
  label: "Origyn",
  canister_id: OGY_LEDGER_CANISTER_ID,
  canister_id_ledger_index: OGY_LEDGER_INDEX_CANISTER_ID,
};

export const TOKEN_CKUSDT: Token = {
  id: "ckusdt",
  name: "ckUSDT",
  display_name: "ckUSDT",
  label: "Chain Key USDT",
  canister_id: CKUSDT_LEDGER_CANISTER_ID,
  canister_id_ledger_index: CKUSDT_LEDGER_INDEX_CANISTER_ID,
};

export const SUPPORTED_TOKENS: Token[] = [
  TOKEN_ICP,
  TOKEN_GLDT,
  TOKEN_OGY,
  TOKEN_CKUSDT,
];

export const getTokenByName = (name: string): Token | undefined => {
  return SUPPORTED_TOKENS.find(token => token.name === name);
};

export const getTokenById = (id: string): Token | undefined => {
  return SUPPORTED_TOKENS.find(token => token.id === id);
};

export const getTokenByCanisterId = (canisterId: string): Token | undefined => {
  return SUPPORTED_TOKENS.find(token => token.canister_id === canisterId);
};
