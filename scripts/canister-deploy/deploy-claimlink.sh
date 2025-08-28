#!/usr/bin/env bash

## As argument, preferably pass $1 previously defined by calling the pre-deploy script with the dot notation.

show_help() {
  cat << EOF
claimlink canister deployment script.
Must be run from the repository's root folder, and with a running replica if for local deployment.
'staging' and 'ic' networks can only be selected from a Gitlab CI/CD environment.
The NETWORK argument should preferably be passed from the env variable that was previously defined
by the pre-deploy script (using the dot notation, or inside a macro deploy script).

The canister will always be reinstalled locally, and only upgraded in staging and production (ic).

Usage:
  scripts/deploy-claimlink.sh [options] <NETWORK>

Options:
  -h, --help        Show this message and exit
EOF
}



if [[ $# -gt 0 ]]; then
  while [[ "$1" =~ ^- && ! "$1" == "--" ]]; do
    case $1 in
      -h | --help )
        show_help
        exit
        ;;
    esac;
    shift;
  done
  if [[ "$1" == '--' ]]; then shift; fi
else
  echo "Error: missing <NETWORK> argument"
  exit 1
fi

NETWORK=$1

if [[ ! $NETWORK =~ ^(local|staging|ic)$ ]]; then
  echo "Error: unknown network for deployment"
  exit 2
fi

LEDGER_CANISTER_ID=$(dfx canister id sns_ledger --network $NETWORK)

if [[ $NETWORK =~ ^(local|staging)$ ]]; then
  TESTMODE="true"
  ARGUMENTS="(record {
    test_mode = $TESTMODE;
    authorized_principals = vec { principal \"jqdha-t6k7d-iitf4-6mxtc-dzkp2-kpk7c-mmtnp-ab2ef-xotlg-5m5qc-3qe\" };
    ledger_canister_id = principal \"$LEDGER_CANISTER_ID\";
  } )"
else
  TESTMODE="false"
  ARGUMENTS="(record {
    test_mode = $TESTMODE;
    authorized_principals = vec { principal \"jqdha-t6k7d-iitf4-6mxtc-dzkp2-kpk7c-mmtnp-ab2ef-xotlg-5m5qc-3qe\" };
    ledger_canister_id = principal \"$LEDGER_CANISTER_ID\";
  } )"
fi


. ./scripts/deploy-backend-canister.sh collection_index $NETWORK "$ARGUMENTS"
