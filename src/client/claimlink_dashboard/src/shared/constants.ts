// Environment mode
export const APP_MODE = import.meta.env.MODE;

// Canister IDs for ClaimLink
export const CLAIMLINK_CANISTER_ID = import.meta.env.VITE_CLAIMLINK_CANISTER_ID;
export const NFT_CANISTER_ID = import.meta.env.VITE_NFT_CANISTER_ID;
export const CERTIFICATE_CANISTER_ID = import.meta.env.VITE_CERTIFICATE_CANISTER_ID;
export const LEDGER_CANISTER_ID = import.meta.env.VITE_LEDGER_CANISTER_ID;

// IC Host
export const IC_HOST = import.meta.env.VITE_IC_HOST || "https://ic0.app";

// Token Ledger Canister IDs
export const ICP_LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";
export const GLDT_LEDGER_CANISTER_ID = "6c7su-kiaaa-aaaar-qaira-cai";
export const OGY_LEDGER_CANISTER_ID = "lkwrt-vyaaa-aaaaq-aadhq-cai";
export const CKUSDT_LEDGER_CANISTER_ID = "xevnm-gaaaa-aaaar-qafnq-cai";

// Token Ledger Index Canister IDs (for transaction history)
export const ICP_LEDGER_INDEX_CANISTER_ID = "qhbym-qaaaa-aaaah-qcl4q-cai";
export const GLDT_LEDGER_INDEX_CANISTER_ID = "apia6-jaaaa-aaaar-qabma-cai";
export const OGY_LEDGER_INDEX_CANISTER_ID = "lkwrt-vyaaa-aaaaq-aadhq-cai"; // Same as ledger for OGY
export const CKUSDT_LEDGER_INDEX_CANISTER_ID = "xevnm-gaaaa-aaaar-qafnq-cai"; // Same as ledger for ckUSDT

// DEX Integration
export const KONGSWAP_CANISTER_ID_IC = "2ipq2-uqaaa-aaaar-qailq-cai";

// NFID Configuration for localhost development
export const NFID_LOCALHOST_TARGETS = import.meta.env.VITE_NFID_LOCALHOST_TARGETS;
export const NFID_DERIVATION_ORIGIN = import.meta.env.VITE_NFID_DERIVATION_ORIGIN;

// Helper function to get NFID targets based on environment
export const getNfidTargets = (): string[] => {
  // In development mode, include localhost URLs
  if (APP_MODE === 'development') {
    const localhostTargets = NFID_LOCALHOST_TARGETS?.split(',').filter(Boolean) || [];
    const canisterTargets = [
      CLAIMLINK_CANISTER_ID,
      NFT_CANISTER_ID,
      CERTIFICATE_CANISTER_ID,
      LEDGER_CANISTER_ID,
    ].filter(Boolean); // Filter out undefined values

    return [...localhostTargets, ...canisterTargets];
  }

  // In production, only use canister IDs
  return [
    CLAIMLINK_CANISTER_ID,
    NFT_CANISTER_ID,
    CERTIFICATE_CANISTER_ID,
    LEDGER_CANISTER_ID,
  ].filter(Boolean);
};

// Helper function to get derivation origin
export const getDerivationOrigin = (): string | undefined => {
  if (APP_MODE === 'development') {
    return NFID_DERIVATION_ORIGIN;
  }
  return undefined; // Production will use the actual domain
};
