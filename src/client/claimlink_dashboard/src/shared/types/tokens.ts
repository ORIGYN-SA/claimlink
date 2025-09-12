export type TokenID = "icp" | "gldt" | "ogy" | "ckusdt";
export type TokenName = "ICP" | "GLDT" | "OGY" | "ckUSDT";

export interface Token {
  id: TokenID;
  name: TokenName;
  display_name: TokenName;
  label: string;
  canister_id: string;
  canister_id_ledger_index: string;
}

export interface LedgerBalanceData {
  balance: number;         // Human-readable balance
  balance_e8s: bigint;     // Raw balance in smallest units
  balance_usd: number;     // USD value
  decimals: number;        // Token decimals
  fee: number;            // Human-readable fee
  fee_e8s: bigint;        // Raw fee in smallest units
  fee_usd: number;        // Fee in USD
  price_usd: number;      // Token price in USD
}

export interface Transaction {
  from: string;
  to: string;
  amount: bigint;
  fee: bigint;
  timestamp: bigint;
  is_credit: boolean;
  memo?: string;
}

export interface TransactionsPage {
  data: Transaction[];
  cursor_index: number | null;
}
