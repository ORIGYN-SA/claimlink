#[cfg(test)]
pub mod wasm_store {

    use crate::{
        storage::wasm_store::{
            mutate_wasm_store, read_wasm_store, record_nft_collection_wasm, wasm_store_contain,
            wasm_store_get, wasm_store_insert, NFT_COLLECTION_BYTECODE,
        },
        types::wasm::Wasm,
    };

    #[test]
    fn test_record_and_retrieve_nft_collection_wasm() {
        let hash = mutate_wasm_store(|store| record_nft_collection_wasm(store));

        read_wasm_store(|store| {
            assert!(
                wasm_store_contain(store, &hash),
                "Store should contain the recorded NFT wasm"
            );

            let stored_wasm =
                wasm_store_get(store, &hash).expect("Failed to retrieve recorded wasm");

            assert_eq!(
                stored_wasm.to_bytes(),
                NFT_COLLECTION_BYTECODE.to_vec(),
                "Stored binary should match the source constant"
            );
        })
    }

    #[test]
    fn test_arbitrary_wasm_insertion() {
        // fake WASM binary
        let arbitrary_data = b"\x00\x61\x73\x6d\x01\x00\x00\x00".to_vec(); // Minimal WASM header
        let wasm_obj = Wasm::new(arbitrary_data.clone());
        let expected_hash = wasm_obj.hash().clone();

        mutate_wasm_store(|store| {
            wasm_store_insert(store, wasm_obj);
        });

        read_wasm_store(|store| {
            let retrieved =
                wasm_store_get(store, &expected_hash).expect("Should retrieve arbitrary wasm");

            assert_eq!(
                retrieved.to_bytes(),
                arbitrary_data,
                "Arbitrary binary content should remain unchanged"
            );
        })
    }

    #[test]
    fn test_duplicate_insertion_ignored() {
        let data = b"duplicate_test".to_vec();
        let wasm_1 = Wasm::new(data.clone());
        let wasm_2 = Wasm::new(data);

        let hash = wasm_1.hash().clone();

        mutate_wasm_store(|store| {
            // Insert first time
            wasm_store_insert(store, wasm_1);
            assert!(wasm_store_contain(store, &hash));

            // Insert second time (should not panic or error)
            wasm_store_insert(store, wasm_2);

            assert!(wasm_store_contain(store, &hash));
        });
    }
}
