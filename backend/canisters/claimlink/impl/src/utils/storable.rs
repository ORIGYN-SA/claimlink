#[macro_export]
macro_rules! impl_storable_minicbor {
    ($type:ty ) => {
        impl ic_stable_structures::storable::Storable for $type {
            fn to_bytes(&'_ self) -> std::borrow::Cow<'_, [u8]> {
                let mut buf = Vec::new();
                minicbor::encode(self, &mut buf).expect("minicbor encoding should always succeed");
                std::borrow::Cow::Owned(buf)
            }
            fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
                minicbor::decode(bytes.as_ref()).unwrap_or_else(|e| {
                    panic!(
                        "failed to decode minicbor bytes {}: {}",
                        hex::encode(&bytes),
                        e
                    )
                })
            }
            const BOUND: ic_stable_structures::storable::Bound =
                ic_stable_structures::storable::Bound::Unbounded;
        }
    };
}

#[cfg(test)]
mod tests {
    use candid::{Nat, Principal};
    use ic_stable_structures::storable::Storable;
    use minicbor::{Decode, Encode};
    use std::borrow::Cow;

    use crate::types::wasm::WasmHash;

    #[derive(Encode, Decode, Debug, PartialEq, Clone)]
    struct SimpleStruct {
        #[n(0)]
        id: u64,
        #[n(1)]
        name: String,
        #[n(2)]
        active: bool,
    }

    impl_storable_minicbor!(SimpleStruct);

    // Nested struct with collections plus custom cbor serializers
    #[derive(Encode, Decode, Debug, PartialEq, Clone)]
    struct NestedStruct {
        #[n(0)]
        simple: SimpleStruct,
        #[n(1)]
        tags: Vec<String>,
        #[n(2)]
        maybe_value: Option<i32>,
        #[n(3)]
        scores: Vec<u32>,
        #[cbor(n(4), with = "crate::cbor::principal")]
        principal: Principal,
        #[cbor(n(5), with = "crate::cbor::nat")]
        nat: Nat,
    }

    impl_storable_minicbor!(NestedStruct);

    //  More complex with bytes and custom type (using your WasmHash as example)
    #[derive(Encode, Decode, Debug, PartialEq, Clone)]
    struct ComplexStruct {
        #[n(0)]
        data: Vec<u8>,
        #[n(1)]
        hash: WasmHash,
        #[n(2)]
        matrix: Vec<Vec<f64>>,
    }

    impl_storable_minicbor!(ComplexStruct);

    #[test]
    fn test_round_trip_simple_struct() {
        let original = SimpleStruct {
            id: 42,
            name: "Test User".to_string(),
            active: true,
        };

        // Encode to bytes
        let bytes: Cow<[u8]> = original.to_bytes();
        assert!(!bytes.is_empty(), "Encoded bytes should not be empty");

        // Decode back
        let decoded: SimpleStruct = SimpleStruct::from_bytes(bytes);

        // Assert round-trip
        assert_eq!(original, decoded, "Round-trip failed for SimpleStruct");
    }

    #[test]
    fn test_round_trip_nested_struct() {
        let original = NestedStruct {
            simple: SimpleStruct {
                id: 100,
                name: "Nested".to_string(),
                active: false,
            },
            tags: vec!["rust".to_string(), "ic".to_string(), "cbor".to_string()],
            maybe_value: Some(-5),
            scores: vec![10, 20, 30],
            principal: Principal::anonymous(),
            nat: Nat::from(100_u32),
        };

        let bytes: Cow<[u8]> = original.to_bytes();
        assert!(!bytes.is_empty());

        let decoded: NestedStruct = NestedStruct::from_bytes(bytes);
        assert_eq!(original, decoded, "Round-trip failed for NestedStruct");
    }

    #[test]
    fn test_round_trip_complex_struct() {
        let original = ComplexStruct {
            data: vec![0xDE, 0xAD, 0xBE, 0xEF],
            hash: WasmHash::from([0xAB; 32]), // Assuming WasmHash is Hash<32>
            matrix: vec![vec![1.1, 2.2], vec![3.3, 4.4]],
        };

        let bytes: Cow<[u8]> = original.to_bytes();
        assert!(!bytes.is_empty());

        let decoded: ComplexStruct = ComplexStruct::from_bytes(bytes);
        assert_eq!(original, decoded, "Round-trip failed for ComplexStruct");
    }

    #[test]
    #[should_panic(expected = "failed to decode minicbor bytes")]
    fn test_invalid_decode_panics() {
        let invalid_bytes = Cow::Owned(vec![0xFF, 0xFF]); // Invalid CBOR

        // This should panic as per the macro's implementation
        let _ = SimpleStruct::from_bytes(invalid_bytes);
    }

    #[test]
    fn test_empty_struct_round_trip() {
        #[derive(Encode, Decode, Debug, PartialEq, Clone)]
        struct EmptyStruct {}

        impl_storable_minicbor!(EmptyStruct);

        let original = EmptyStruct {};

        let bytes: Cow<[u8]> = original.to_bytes();
        assert_eq!(
            bytes.len(),
            1,
            "Empty struct should encode to minimal CBOR (e.g., map 0)"
        );

        let decoded: EmptyStruct = EmptyStruct::from_bytes(bytes);
        assert_eq!(original, decoded, "Round-trip failed for EmptyStruct");
    }

    #[test]
    fn test_large_data() {
        let large_data = vec![0u8; 1024 * 1024]; // 1 MB blob

        #[derive(Encode, Decode, Debug, PartialEq, Clone)]
        struct LargeStruct {
            #[n(0)]
            blob: Vec<u8>,
        }

        impl_storable_minicbor!(LargeStruct);

        let original = LargeStruct {
            blob: large_data.clone(),
        };

        let bytes: Cow<[u8]> = original.to_bytes();
        assert!(bytes.len() > 1_000_000, "Encoded size should be large");

        let decoded: LargeStruct = LargeStruct::from_bytes(bytes);
        assert_eq!(
            original.blob.len(),
            decoded.blob.len(),
            "Large data length mismatch"
        );
        assert_eq!(original, decoded, "Round-trip failed for LargeStruct");
    }
}
