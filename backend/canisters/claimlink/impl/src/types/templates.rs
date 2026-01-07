use claimlink_api::impl_storable_minicbor;
use minicbor::{Decode, Encode};
use serde::{Deserialize, Serialize};

pub type NftTemplateId = u64;

#[derive(Clone, Eq, PartialEq, Ord, PartialOrd, Debug, Deserialize, Serialize, Encode, Decode)]
pub struct NftTemplateBytes(#[n(0)] pub Vec<u8>);

impl AsRef<[u8]> for NftTemplateBytes {
    fn as_ref(&self) -> &[u8] {
        &self.0
    }
}

impl_storable_minicbor!(NftTemplateBytes);
