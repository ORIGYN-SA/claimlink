#!/bin/bash

# Constants
NUM_TOKENS=1000
COLLECTION_CANISTER_ID="b77ix-eeaaa-aaaaa-qaada-cai"
CANISTER_ID="bkyz2-fmaaa-aaaaa-qaaaq-cai"


for ((i=1; i<=NUM_TOKENS; i++))
do
    # IDENTITY_NAME="plugarc"
    # dfx identity use "$IDENTITY_NAME"

    NAME=""
    DESC=""
    ASSET=""
    THUMB=""
    METADATA="null"

    AMOUNT=1

    echo "Creating NFT with name: $NAME, description: $DESC..."

    ADD_RESULT=$(dfx canister call "$CANISTER_ID" mintExtNonFungible \
        "(principal \"$COLLECTION_CANISTER_ID\", \"$NAME\", \"$DESC\", \"$ASSET\", \"$THUMB\", $METADATA, $AMOUNT)" 2>&1)
    
    if [[ $? -eq 0 ]]; then
        echo "NFTs minted successfully: $ADD_RESULT."
    else
        echo "Error minting NFTs: $ADD_RESULT"
    fi

done

# dfx identity use default

echo "Created $NUM_TOKENS NFTs."
