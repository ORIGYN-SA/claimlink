#!/bin/bash

set -e

NETWORK="local"
while [[ $# -gt 0 ]]; do
    case $1 in
        --network)
            NETWORK="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--network local|ic]"
            exit 1
            ;;
    esac
done

if ! command -v dfx &> /dev/null; then
    echo "dfx is not installed. Please install dfx first."
    echo "https://internetcomputer.org/docs/building-apps/getting-started/install"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo "jq is not installed. Please install jq first."
    echo "https://jqlang.org/download/"
    exit 1
fi

WASM_FILE="assets/core_nft_canister.wasm.gz"
if [ ! -f "$WASM_FILE" ]; then
    echo "WASM file for origyn nft not found: $WASM_FILE"
    echo "Get one from: https://github.com/ORIGYN-SA/nft/releases/"
    exit 1
fi

echo "Found WASM file: $WASM_FILE"

if [ ! -f "canister_ids.json" ]; then
    echo "canister_ids.json not found!"
    exit 1
fi

get_canister_id() {
    local canister_name=$1
    local network=$2
    jq -r ".$canister_name.$network // empty" canister_ids.json 2>/dev/null
}

CLAIMLINK_BACKEND_ID=$(get_canister_id "claimlink_backend" "$NETWORK")
CLAIMLINK_FRONTEND_ID=$(get_canister_id "claimlink_frontend" "$NETWORK")
REGISTRY_ID=$(get_canister_id "registry" "$NETWORK")
LEDGER_ID=$(get_canister_id "ledger" "$NETWORK")

echo "Loaded canister IDs for $NETWORK network:"
echo "  claimlink_backend: $CLAIMLINK_BACKEND_ID"
echo "  claimlink_frontend: $CLAIMLINK_FRONTEND_ID"
echo "  registry: $REGISTRY_ID"
echo "  ledger: $LEDGER_ID"

if [ "$NETWORK" = "local" ] && [ -n "$LEDGER_ID" ]; then
    echo "Deploying icp_ledger_canister with specific ID: $LEDGER_ID"
    
    MINTER_PRINCIPAL_ID="jqdha-t6k7d-iitf4-6mxtc-dzkp2-kpk7c-mmtnp-ab2ef-xotlg-5m5qc-3qe"
    MINTER_ACCOUNT_ID=$(dfx ledger account-id --of-principal "$MINTER_PRINCIPAL_ID")
    PRINCIPAL_ID=$(dfx identity get-principal)
    DEFAULT_ACCOUNT_ID=$(dfx ledger account-id --of-principal "$PRINCIPAL_ID")
    
    dfx deploy icp_ledger_canister --specified-id "$LEDGER_ID" --argument "
    (variant {
        Init = record {
        minting_account = \"$MINTER_ACCOUNT_ID\";
        initial_values = vec {
            record {
            \"$DEFAULT_ACCOUNT_ID\";
            record {
                e8s = 10_000_000_000 : nat64;
            };
            };
        };
        send_whitelist = vec {};
        transfer_fee = opt record {
            e8s = 10_000 : nat64;
        };
        token_symbol = opt \"LICP\";
        token_name = opt \"Local ICP\";
        }
    })
    "
    echo "icp_ledger_canister deployed successfully with ID: $LEDGER_ID"
fi


# 1. Deploy the registry canister first, because of dependency
if [ -n "$REGISTRY_ID" ]; then
    echo "Deploying registry with specific ID: $REGISTRY_ID"
    PRINCIPAL_ID=$(dfx identity get-principal)
    dfx deploy registry --specified-id "$REGISTRY_ID" --argument "principal \"$PRINCIPAL_ID\""
fi

# 2. Deploy the claimlink_backend canister
if [ -n "$CLAIMLINK_BACKEND_ID" ]; then
    echo "Deploying claimlink_backend with specific ID: $CLAIMLINK_BACKEND_ID"
    dfx deploy claimlink_backend --specified-id "$CLAIMLINK_BACKEND_ID"
fi


echo "Deployment completed successfully!"

# Upload WASM in chunks to avoid payload size limits
echo "Uploading WASM in chunks to avoid payload size limits..."

WASM_SIZE=$(stat -f%z "$WASM_FILE" 2>/dev/null || stat -c%s "$WASM_FILE" 2>/dev/null)
CHUNK_SIZE=1000000  # 1MB chunks
TOTAL_CHUNKS=$(( (WASM_SIZE + CHUNK_SIZE - 1) / CHUNK_SIZE ))

echo "WASM file size: $WASM_SIZE bytes"
echo "Chunk size: $CHUNK_SIZE bytes"
echo "Total chunks: $TOTAL_CHUNKS"

echo "Starting WASM upload..."
dfx canister call claimlink_backend startWasmUpload "($TOTAL_CHUNKS)"

for ((i=0; i<TOTAL_CHUNKS; i++)); do
    echo "Uploading chunk $((i+1))/$TOTAL_CHUNKS..."
    
    TEMP_DIR=$(mktemp -d)
    CHUNK_FILE="$TEMP_DIR/chunk_$i.bin"
    ARG_FILE="$TEMP_DIR/chunk_arg.did"
    
    # extract chunk from WASM file
    dd if="$WASM_FILE" of="$CHUNK_FILE" bs=$CHUNK_SIZE skip=$i count=1 2>/dev/null
    
    CHUNK_HEX=$(xxd -p -u "$CHUNK_FILE" | tr -d '\n')
    echo "($i, blob \"$CHUNK_HEX\")" > "$ARG_FILE"
    
    dfx canister call claimlink_backend uploadWasmChunk --argument-file "$ARG_FILE"
    
    rm -rf "$TEMP_DIR"
done

echo "Completing WASM upload..."
dfx canister call claimlink_backend completeWasmUpload

echo "Setting canister IDs for network: $NETWORK"

if [ -n "$LEDGER_ID" ]; then
    echo "Setting Ledger Canister ID: $LEDGER_ID"
    # TODO: Update this to be a single `config` update call
    dfx canister call claimlink_backend setLedgerCanisterId "\"$LEDGER_ID\""
fi

if [ -n "$REGISTRY_ID" ]; then
    echo "Setting Registry Canister ID: $REGISTRY_ID"
    dfx canister call claimlink_backend setRegistryCanisterId "\"$REGISTRY_ID\""
fi

if [ $? -ne 0 ]; then
    echo "Failed to set canister IDs!"
    exit 1
fi

echo "Canister IDs set successfully!"

echo "Verifying WASM was set correctly..."
WASM_SET=$(dfx canister call claimlink_backend isOrigynNFTWasmSet)

if [[ "$WASM_SET" == *"true"* ]]; then
    echo "WASM verification successful!"
else
    echo "WASM verification failed!"
    exit 1
fi

echo "🎉 ClaimLink Backend and Registry deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "   Backend Canister ID: $CANISTER_ID"
echo "   Registry Canister ID: $REGISTRY_CANISTER_ID_DEPLOYED"
echo "   Principal ID: $PRINCIPAL_ID"
echo "   Network: $NETWORK"
echo "   Ledger Canister ID: $LEDGER_ID"
echo "   Registry Canister ID (configured): $REGISTRY_ID"
echo "   WASM Status: ✅ Set and verified"
echo ""
echo "🔗 Next steps:"
echo "   1. Update your frontend to use the new canister IDs"
echo "   2. Test the createOrigynCollection function"
echo "   3. Deploy to mainnet when ready"
echo ""

echo "Deployment script completed! 🚀"
