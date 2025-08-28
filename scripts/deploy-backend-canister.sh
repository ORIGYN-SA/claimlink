#!/usr/bin/env bash

## As argument, preferably pass $1 previously defined by calling the pre-deploy script with the dot notation.

show_help() {
  cat << EOF
backend canister deployment script.
Must be run from the repository's root folder, and with a running replica if for local deployment.
'staging' and 'ic' networks can only be selected from a Gitlab CI/CD environment.
The NETWORK argument should preferably be passed from the env variable that was previously defined
by the pre-deploy script (using the dot notation, or inside a macro deploy script).

The canister will always be reinstalled locally, and only upgraded in staging and production (ic).

Usage:
  scripts/deploy-backend-canister.sh [options] <CANISTER> <NETWORK> <ARGUMENTS>

Options:
  -h, --help        Show this message and exit
  -r, --reinstall   Completely reinstall the canister, instead of simply upgrade it
EOF
}

if [[ $# -gt 3 ]]; then
  while [[ "$1" =~ ^- && ! "$1" == "--" ]]; do
    case $1 in
      -h | --help )
        show_help
        exit
        ;;
      -r | --reinstall )
        REINSTALL="--mode reinstall"
        ;;
    esac;
    shift;
  done
  if [[ "$1" == '--' ]]; then shift; fi
else
  echo "Error: missing <CANISTER> <NETWORK> <ARGUMENTS> arguments"
  exit 1
fi

CANISTER=$1
NETWORK=$2
ARGUMENTS=$3


echo -e "CANISTER: $CANISTER \nNETWORK: $NETWORK \nARGUMENTS: $ARGUMENTS \nTAG: $CI_COMMIT_TAG"

if [[ ! $NETWORK =~ ^(local|staging|ic)$ ]]; then
  echo "Error: unknown network for deployment"
  exit 2
fi

if [[ $NETWORK == ic && ! $CI_COMMIT_TAG =~ ^($CANISTER-v[0-9]+\.[0-9]+\.[0-9]+)$ ]]; then
  echo "Error: Enter valid commit tag to deploy to production"
  exit 2
fi

echo "Deploying $CANISTER directly via dfx."
dfx deploy $CANISTER --network $NETWORK ${REINSTALL} --argument "$ARGUMENTS" -y

return
