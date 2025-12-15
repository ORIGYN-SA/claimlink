// module for handling NFT collections wasm types
use minicbor::{Decode, Encode};
use serde::{Deserialize, Serialize};
use serde_bytes::ByteArray;
use std::str::FromStr;

use crate::impl_storable_minicbor;

const WASM_HASH_LENGTH: usize = 32;

/// `Wasm` is a wrapper around a wasm binary and its memoized hash.
/// It provides a type-safe way to handle wasm binaries for different canisters.
#[derive(Debug, Encode, Decode)]
pub struct Wasm {
    #[n(0)]
    binary: Vec<u8>,
    #[n(1)]
    hash: WasmHash,
}

pub type WasmHash = Hash<WASM_HASH_LENGTH>;

/// Fixed-size hash type used for Wasm module hashes (32 bytes = 64 hex chars).
/// The const generic `N` lets us reuse this for any hash length (e.g. 32-byte SHA-256).
#[derive(Clone, Eq, PartialEq, Ord, PartialOrd, Debug, Deserialize, Serialize, Encode, Decode)]
#[serde(from = "serde_bytes::ByteArray<N>", into = "serde_bytes::ByteArray<N>")]
pub struct Hash<const N: usize>(#[n(0)] [u8; N]);

impl<const N: usize> Default for Hash<N> {
    fn default() -> Self {
        Self([0; N])
    }
}

// These two impls let Serde treat `Hash<N>` as a byte array transparently
// (required because Serde doesn't know how to serialize fixed-size arrays >32 by default)
impl<const N: usize> From<ByteArray<N>> for Hash<N> {
    fn from(value: ByteArray<N>) -> Self {
        Self(value.into_array())
    }
}

impl<const N: usize> From<Hash<N>> for ByteArray<N> {
    fn from(value: Hash<N>) -> Self {
        ByteArray::new(value.0)
    }
}

impl<const N: usize> AsRef<[u8]> for Hash<N> {
    fn as_ref(&self) -> &[u8] {
        &self.0
    }
}

impl<const N: usize> From<[u8; N]> for Hash<N> {
    fn from(value: [u8; N]) -> Self {
        Self(value)
    }
}

impl<const N: usize> From<Hash<N>> for [u8; N] {
    fn from(value: Hash<N>) -> Self {
        value.0
    }
}

/// Parses a hash from its hexadecimal string representation.
/// Example: "a1b2c3...64 hex chars" → Hash<32>
impl<const N: usize> FromStr for Hash<N> {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let expected_num_hex_chars = N * 2;

        // Enforce exact length to prevent accidental truncation or padding issues
        if s.len() != expected_num_hex_chars {
            return Err(format!(
                "Invalid hash: expected {} characters, got {}",
                expected_num_hex_chars,
                s.len()
            ));
        }

        let mut bytes = [0u8; N];
        // `hex::decode_to_slice` writes directly into the array and fails on invalid chars
        hex::decode_to_slice(s, &mut bytes).map_err(|e| format!("Invalid hex string: {}", e))?;

        Ok(Self(bytes))
    }
}

impl_storable_minicbor!(Wasm);
