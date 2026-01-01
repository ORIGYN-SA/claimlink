/**
 * Centralized canister ID configuration
 *
 * Single source of truth for all canister IDs used in the application.
 * Environment variables are validated at runtime.
 */

// ClaimLink application canisters
export const CANISTER_IDS = {
  // Core application
  claimlink: import.meta.env.VITE_CLAIMLINK_CANISTER_ID || '',
  origynNft: import.meta.env.VITE_NFT_CANISTER_ID || '',
  certificate: import.meta.env.VITE_CERTIFICATE_CANISTER_ID || '',

  // Token ledgers (ICRC-1)
  icpLedger: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
  gldtLedger: '6c7su-kiaaa-aaaar-qaira-cai',
  ogyLedger: import.meta.env.VITE_LEDGER_CANISTER_ID || 'j5naj-nqaaa-aaaal-ajc7q-cai',
  ckusdtLedger: 'xevnm-gaaaa-aaaar-qafnq-cai',

  // Ledger index canisters (for transaction history)
  icpLedgerIndex: 'qhbym-qaaaa-aaaah-qcl4q-cai',
  gldtLedgerIndex: 'apia6-jaaaa-aaaar-qabma-cai',
  ogyLedgerIndex: 'j2mg5-aiaaa-aaaal-ajc7a-cai',
  ckusdtLedgerIndex: 'xevnm-gaaaa-aaaar-qafnq-cai',

  // DEX integration
  kongswap: '2ipq2-uqaaa-aaaar-qailq-cai',

  // Swap
  swap: import.meta.env.VITE_SWAP_CANISTER_ID || '',
} as const;

export type CanisterName = keyof typeof CANISTER_IDS;

/**
 * Get canister ID by name with validation
 * @throws Error if canister ID is not configured
 */
export function getCanisterId(name: CanisterName): string {
  const id = CANISTER_IDS[name];
  if (!id) {
    throw new Error(
      `Canister ID not configured: ${name}. ` +
        `Check your environment variables.`
    );
  }
  return id;
}

/**
 * Get canister ID by name, returning undefined if not configured
 * Use this when the canister might be optional
 */
export function getCanisterIdOptional(name: CanisterName): string | undefined {
  const id = CANISTER_IDS[name];
  return id || undefined;
}

/**
 * Check if a canister is configured
 */
export function isCanisterConfigured(name: CanisterName): boolean {
  return Boolean(CANISTER_IDS[name]);
}

// IC Host configuration
export const IC_HOST = import.meta.env.VITE_IC_HOST || 'https://ic0.app';

// Environment mode
export const APP_MODE = import.meta.env.MODE;
