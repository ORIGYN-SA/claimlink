use minicbor::{Decode, Encode};
use serde::{Deserialize, Serialize};
use serde_bytes::ByteArray;
use sha2::Digest;
use std::str::FromStr;

use crate::impl_storable_minicbor;

const WASM_HASH_LENGTH: usize = 32;

pub type WasmHash = Hash<WASM_HASH_LENGTH>;

#[derive(Debug, Encode, Decode)]
pub struct Wasm {
    #[n(0)]
    binary: Vec<u8>,
    #[n(1)]
    hash: WasmHash,
}

#[derive(Clone, Eq, PartialEq, Ord, PartialOrd, Debug, Deserialize, Serialize, Encode, Decode)]
#[serde(from = "serde_bytes::ByteArray<N>", into = "serde_bytes::ByteArray<N>")]
pub struct Hash<const N: usize>(#[n(0)] [u8; N]);

impl<const N: usize> Default for Hash<N> {
    fn default() -> Self {
        Self([0; N])
    }
}

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

impl Wasm {
    /// Creates a new Wasm container and pre-calculates the SHA-256 hash.
    pub fn new(binary: Vec<u8>) -> Self {
        let hash = sha2::Sha256::digest(&binary).into();
        Self {
            binary,
            hash: Hash(hash),
        }
    }

    pub fn to_bytes(self) -> Vec<u8> {
        self.binary
    }

    pub fn hash(&self) -> &WasmHash {
        &self.hash
    }
}

impl Clone for Wasm {
    /// Clone existing hash to avoid expensive re-calculation of the SHA-256 digest.
    fn clone(&self) -> Self {
        Self {
            binary: self.binary.clone(),
            hash: self.hash.clone(),
        }
    }
}

impl PartialEq for Wasm {
    fn eq(&self, other: &Self) -> bool {
        self.binary.eq(&other.binary)
    }
}

impl From<Vec<u8>> for Wasm {
    fn from(v: Vec<u8>) -> Self {
        Self::new(v)
    }
}

impl From<&[u8]> for Wasm {
    fn from(value: &[u8]) -> Self {
        Self::new(value.to_vec())
    }
}

impl<const N: usize> FromStr for Hash<N> {
    type Err = String;

    /// Validates and decodes a hex string into a fixed-size byte array.
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        if s.len() != N * 2 {
            return Err(format!(
                "Hash length mismatch: expected {} hex chars",
                N * 2
            ));
        }

        let mut bytes = [0u8; N];
        hex::decode_to_slice(s, &mut bytes).map_err(|e| e.to_string())?;
        Ok(Self(bytes))
    }
}

impl_storable_minicbor!(Wasm);
impl_storable_minicbor!(WasmHash);
