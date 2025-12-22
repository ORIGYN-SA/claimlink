use minicbor::{Decode, Encode};
use serde::{Deserialize, Serialize};

use crate::impl_storable_minicbor;

pub type NftTemplateId = u64;

#[derive(Clone, Eq, PartialEq, Ord, PartialOrd, Debug, Deserialize, Serialize, Encode, Decode)]
pub struct NftTemplateBytes(#[n(0)] Vec<u8>);

impl_storable_minicbor!(NftTemplateBytes);
