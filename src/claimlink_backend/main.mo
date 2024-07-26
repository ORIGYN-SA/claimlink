import ExtTokenClass "../extv2/ext_v2/v2";
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import List "mo:base/List";
import Nat64 "mo:base/Nat64";
import Array "mo:base/Array";
import ExtCore "../extv2/motoko/ext/Core";

actor Main{

    type AccountIdentifier = ExtCore.AccountIdentifier;
    type TokenIndex  = ExtCore.TokenIndex;
    type MetadataValue = (Text , {
        #text : Text;
        #blob : Blob;
        #nat : Nat;
        #nat8: Nat8;
    });
    type MetadataContainer = {
        #data : [MetadataValue];
        #blob : Blob;
        #json : Text;
    };
    type Metadata = {
        #fungible : {
        name : Text;
        symbol : Text;
        decimals : Nat8;
        metadata: ?MetadataContainer;
        };
        #nonfungible : {
        name : Text;
        asset : Text;
        thumbnail : Text;
        metadata: ?MetadataContainer;
        };
    };
    type TransferRequest = ExtCore.TransferRequest;
    type TransferResponse = ExtCore.TransferResponse;



    private var usersCollectionMap = TrieMap.TrieMap<Principal, [Principal]>(Principal.equal, Principal.hash);
    

    public shared ({caller = user}) func createExtCollection(_title : Text, _symbol : Text, _metadata : Text) : async (Principal,Principal) {
        Cycles.add<system>(500_500_000_000);
        let extToken = await ExtTokenClass.EXTNFT(Principal.fromActor(Main));
        let extCollectionCanisterId = await extToken.getCanisterId();
        let collectionCanisterActor = actor (Principal.toText(extCollectionCanisterId)) : actor{
            ext_setCollectionMetadata : (
                name : Text, 
                symbol : Text, 
                metadata : Text
            ) -> async ()
        };
        await collectionCanisterActor.ext_setCollectionMetadata(_title, _symbol, _metadata);
        let collections = usersCollectionMap.get(user);
        switch(collections){
            case null {
                let updatedCollections = [extCollectionCanisterId];
                usersCollectionMap.put(user,updatedCollections);
                return (user, extCollectionCanisterId);
            };
            case (?collections){
                let updatedObj = List.push(extCollectionCanisterId,List.fromArray(collections));
                usersCollectionMap.put(user,List.toArray(updatedObj));
                return (user, extCollectionCanisterId);
            };
        };
            
    };

    public shared ({caller = user}) func getUserCollections() : async ?[Principal] {
        return usersCollectionMap.get(user);
        
    };
    public shared func getAllCollections() : async [(Principal, [Principal])] {
        var result : [(Principal, [Principal])] = [];
        for ((key, value) in usersCollectionMap.entries()) {
            result := Array.append([(key, value)], result);
        };
        return result;
        
    };

    public shared func mintExt(
        _collectionCanisterId : Principal,
        _amount : Nat64,
        _request : [(AccountIdentifier, Metadata)]

    ) : async [TokenIndex] {
        
        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor{
            ext_mint : (
                request : [(AccountIdentifier, Metadata)]
            ) -> async [TokenIndex]
        };
        let extMint = await collectionCanisterActor.ext_mint(_request);
        extMint

    };


    public shared func createLink(
        _collectionCanisterId : Principal,
        _amount : Nat64,
        _tokenId : Nat64,
        _pubKey : Principal
    ) {
            let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor{
                ext_transfer : (
                   request: TransferRequest
                ) -> async TransferResponse 
            };
    };

    


           

}
