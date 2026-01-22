#!/bin/bash

# ClaimLink Local Testing Environment Setup Script
# This script automates the setup of a complete local testing environment
# including OGY ledger, test accounts, and ClaimLink backend deployment.

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Constants
E8S_PER_OGY=100000000
TEST_USER_100K_BALANCE=$((100000 * E8S_PER_OGY))  # 100,000 OGY
TEST_USER_1M_BALANCE=$((1000000 * E8S_PER_OGY))   # 1,000,000 OGY
TRANSFER_FEE=200000  # 0.002 OGY

# File to store principal IDs
PRINCIPALS_FILE=".local-test-principals"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}ClaimLink Local Testing Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to print section headers
print_section() {
    echo ""
    echo -e "${GREEN}>>> $1${NC}"
    echo ""
}

# Function to print warnings
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to print errors
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Check if dfx is running
check_dfx_running() {
    if ! dfx ping > /dev/null 2>&1; then
        print_error "dfx replica is not running!"
        echo "Please start it with: dfx start --clean"
        exit 1
    fi
    print_success "dfx replica is running"
}

# Create test identities
create_test_identities() {
    print_section "Phase 1: Creating Test Identities"

    # Save current identity
    ORIGINAL_IDENTITY=$(dfx identity whoami)
    echo "Current identity: $ORIGINAL_IDENTITY"

    # Create identities if they don't exist
    for identity in test_user_100k test_user_1m bank_principal; do
        if dfx identity list | grep -q "^${identity}$"; then
            print_warning "Identity '$identity' already exists, skipping creation"
        else
            dfx identity new "$identity" --storage-mode plaintext
            print_success "Created identity: $identity"
        fi
    done

    # Get principal IDs
    echo ""
    echo "Collecting principal IDs..."

    dfx identity use test_user_100k
    TEST_USER_100K=$(dfx identity get-principal)
    print_success "test_user_100k: $TEST_USER_100K"

    dfx identity use test_user_1m
    TEST_USER_1M=$(dfx identity get-principal)
    print_success "test_user_1m: $TEST_USER_1M"

    dfx identity use bank_principal
    BANK_PRINCIPAL=$(dfx identity get-principal)
    print_success "bank_principal: $BANK_PRINCIPAL"

    dfx identity use "$ORIGINAL_IDENTITY"
    CONTROLLER_PRINCIPAL=$(dfx identity get-principal)
    print_success "controller (default): $CONTROLLER_PRINCIPAL"

    # Save principals to file
    cat > "$PRINCIPALS_FILE" <<EOF
# Local Test Principal IDs
# Generated: $(date)
CONTROLLER_PRINCIPAL=$CONTROLLER_PRINCIPAL
TEST_USER_100K=$TEST_USER_100K
TEST_USER_1M=$TEST_USER_1M
BANK_PRINCIPAL=$BANK_PRINCIPAL
EOF

    print_success "Principal IDs saved to $PRINCIPALS_FILE"
}

# Build ClaimLink canister
build_claimlink() {
    print_section "Phase 2: Building ClaimLink Canister"

    if [ ! -f "./scripts/build-canister.sh" ]; then
        print_error "build-canister.sh not found. Are you in the repository root?"
        exit 1
    fi

    ./scripts/build-canister.sh claimlink
    print_success "ClaimLink canister built successfully"
}

# Deploy OGY Ledger
deploy_ogy_ledger() {
    print_section "Phase 3: Deploying OGY Ledger with Test Accounts"

    echo "Deploying with initial balances:"
    echo "  - test_user_100k: 100,000 OGY"
    echo "  - test_user_1m: 1,000,000 OGY"
    echo "  - Transfer fee: 0.002 OGY"
    echo ""

    dfx deploy ogy_ledger --argument "(variant {
  Init = record {
    minting_account = record {
      owner = principal \"$CONTROLLER_PRINCIPAL\";
      subaccount = null;
    };
    initial_balances = vec {
      record {
        record {
          owner = principal \"$TEST_USER_100K\";
          subaccount = null;
        };
        $TEST_USER_100K_BALANCE : nat;
      };
      record {
        record {
          owner = principal \"$TEST_USER_1M\";
          subaccount = null;
        };
        $TEST_USER_1M_BALANCE : nat;
      };
    };
    transfer_fee = $TRANSFER_FEE : nat;
    token_name = \"Origyn\";
    token_symbol = \"OGY\";
    metadata = vec {};
    archive_options = record {
      trigger_threshold = 1000 : nat64;
      num_blocks_to_archive = 1000 : nat64;
      controller_id = principal \"$CONTROLLER_PRINCIPAL\";
    };
  }
})"

    OGY_LEDGER_ID=$(dfx canister id ogy_ledger)
    print_success "OGY Ledger deployed: $OGY_LEDGER_ID"
}

# Deploy ClaimLink Backend
deploy_claimlink_backend() {
    print_section "Phase 4: Deploying ClaimLink Backend"

    echo "Deploying with configuration:"
    echo "  - test_mode: true"
    echo "  - ledger_canister_id: $OGY_LEDGER_ID"
    echo "  - bank_principal_id: $BANK_PRINCIPAL"
    echo ""

    dfx deploy claimlink_backend --argument "(variant { InitArg = record {
  test_mode = true;
  commit_hash = \"local-test-v1\";
  ledger_canister_id = principal \"$OGY_LEDGER_ID\";
  authorized_principals = vec {
    record { name = \"controller\"; \"principal\" = principal \"$CONTROLLER_PRINCIPAL\"; };
    record { name = \"nfid\"; \"principal\" = principal \"mk3po-2rero-6inmo-h4i2f-bl64j-aztzo-xhpgm-odagi-qjncn-os2ve-zqe\"; };
  };
  bank_principal_id = principal \"$BANK_PRINCIPAL\";
  cycles_management = record {
    cycles_top_up_increment = 500_000_000_000 : nat;
    cycles_for_collection_creation = 7_000_000_000_000 : nat;
  };
  collection_request_fee = 1_500_000_000_000 : nat;
  ogy_transfer_fee = 200_000 : nat;
  max_creation_retries = 3 : nat;
  max_template_per_owner = 100 : nat;
}})"

    CLAIMLINK_BACKEND_ID=$(dfx canister id claimlink_backend)
    print_success "ClaimLink Backend deployed: $CLAIMLINK_BACKEND_ID"

    # Fund the canister with cycles for collection creation
    echo ""
    echo "Funding ClaimLink Backend with cycles for development..."
    dfx canister deposit-cycles 30000000000000 claimlink_backend --network local
    print_success "Added 30T cycles to ClaimLink Backend"
}

# Generate frontend .env.local file
generate_frontend_env() {
    print_section "Phase 5: Generating Frontend Environment File"

    FRONTEND_DIR="frontend/claimlink_dashboard"
    ENV_FILE="$FRONTEND_DIR/.env.local"

    if [ ! -d "$FRONTEND_DIR" ]; then
        print_warning "Frontend directory not found at $FRONTEND_DIR"
        return
    fi

    cat > "$ENV_FILE" <<EOF
# ClaimLink Local Testing Environment Variables
# Auto-generated: $(date)

# Canister IDs
VITE_CLAIMLINK_CANISTER_ID=$CLAIMLINK_BACKEND_ID
VITE_NFT_CANISTER_ID=$CLAIMLINK_BACKEND_ID
VITE_CERTIFICATE_CANISTER_ID=$CLAIMLINK_BACKEND_ID
VITE_LEDGER_CANISTER_ID=$OGY_LEDGER_ID

# CRITICAL: Use local IC replica (port 4943 matches ORIGYN NFT test_mode URLs)
VITE_IC_HOST=http://localhost:4943

# NFID Configuration for localhost signing
VITE_NFID_LOCALHOST_TARGETS=http://localhost:5173,http://localhost:4943
VITE_NFID_DERIVATION_ORIGIN=http://localhost:5173
EOF

    print_success "Frontend .env.local created at $ENV_FILE"
}

# Verify deployment
verify_deployment() {
    print_section "Phase 6: Verifying Deployment"

    # Check test user balances
    echo "Verifying test user balances..."

    BALANCE_100K=$(dfx canister call ogy_ledger icrc1_balance_of "(record { owner = principal \"$TEST_USER_100K\"; subaccount = null; })")
    echo "  test_user_100k balance: $BALANCE_100K"

    BALANCE_1M=$(dfx canister call ogy_ledger icrc1_balance_of "(record { owner = principal \"$TEST_USER_1M\"; subaccount = null; })")
    echo "  test_user_1m balance: $BALANCE_1M"

    BALANCE_BANK=$(dfx canister call ogy_ledger icrc1_balance_of "(record { owner = principal \"$BANK_PRINCIPAL\"; subaccount = null; })")
    echo "  bank_principal balance: $BALANCE_BANK"

    print_success "All balances verified"
}

# Print summary
print_summary() {
    print_section "Setup Complete! 🎉"

    echo -e "${GREEN}Canister IDs:${NC}"
    echo "  OGY Ledger:       $OGY_LEDGER_ID"
    echo "  ClaimLink Backend: $CLAIMLINK_BACKEND_ID"
    echo ""

    echo -e "${GREEN}Test Principals:${NC}"
    echo "  Controller:       $CONTROLLER_PRINCIPAL"
    echo "  test_user_100k:   $TEST_USER_100K (100,000 OGY)"
    echo "  test_user_1m:     $TEST_USER_1M (1,000,000 OGY)"
    echo "  bank_principal:   $BANK_PRINCIPAL (receives payments)"
    echo ""

    echo -e "${GREEN}Principal IDs saved to:${NC} $PRINCIPALS_FILE"
    echo ""

    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Start the frontend:"
    echo "   cd frontend/claimlink_dashboard && pnpm dev"
    echo ""
    echo "2. Test collection creation via CLI:"
    echo "   dfx identity use test_user_100k"
    echo "   # First approve ClaimLink to spend OGY:"
    echo "   dfx canister call ogy_ledger icrc2_approve '(record { spender = record { owner = principal \"$CLAIMLINK_BACKEND_ID\"; subaccount = null; }; amount = 1_500_200_000_000 : nat; })'"
    echo "   # Then create collection (see backend API for full arguments)"
    echo ""
    echo "3. Export test identities for NFID (optional):"
    echo "   dfx identity export test_user_100k > test_user_100k.pem"
    echo "   dfx identity export test_user_1m > test_user_1m.pem"
    echo ""
    echo -e "${GREEN}Happy testing! 🚀${NC}"
}

# Main execution
main() {
    # Ensure we're in the repository root
    if [ ! -f "dfx.json" ]; then
        print_error "dfx.json not found. Please run this script from the repository root."
        exit 1
    fi

    # Check if dfx is running
    check_dfx_running

    # Run setup phases
    create_test_identities
    build_claimlink
    deploy_ogy_ledger
    deploy_claimlink_backend
    generate_frontend_env
    verify_deployment
    print_summary
}

# Run main function
main
