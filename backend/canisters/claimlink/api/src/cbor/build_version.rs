use bity_ic_types::BuildVersion;
use minicbor;
use minicbor::encode::Write;
use minicbor::{Decoder, Encoder};

pub fn decode<Ctx>(
    d: &mut Decoder<'_>,
    _ctx: &mut Ctx,
) -> Result<BuildVersion, minicbor::decode::Error> {
    let len = d.array()?;
    if len != Some(3) {
        return Err(minicbor::decode::Error::message(
            "failed to parse BuildVersion: expected array of length 3",
        ));
    }

    let major = d.u32()?;
    let minor = d.u32()?;
    let patch = d.u32()?;

    Ok(BuildVersion {
        major,
        minor,
        patch,
    })
}

/// Encodes a BuildVersion into a CBOR array [major, minor, patch]
pub fn encode<Ctx, W: Write>(
    v: &BuildVersion,
    e: &mut Encoder<W>,
    _ctx: &mut Ctx,
) -> Result<(), minicbor::encode::Error<W::Error>> {
    e.array(3)?;

    e.u32(v.major)?;
    e.u32(v.minor)?;
    e.u32(v.patch)?;

    Ok(())
}
