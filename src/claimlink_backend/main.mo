import ExtTokenClass "../extv2/ext_v2/v2";
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import List "mo:base/List";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import AID "../extv2/motoko/util/AccountIdentifier";

import ExtCore "../extv2/motoko/ext/Core";

actor Main {

    type AccountIdentifier = ExtCore.AccountIdentifier;
    type TokenIndex  = ExtCore.TokenIndex;
    type TokenIdentifier  = ExtCore.TokenIdentifier;
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
            description : Text;
            asset : Text;
            thumbnail : Text;
            metadata: ?MetadataContainer;
        };
    };
    type TransferRequest = ExtCore.TransferRequest;
    type TransferResponse = ExtCore.TransferResponse;
    type Deposit = {
        tokenId: TokenIndex;
        sender : Principal;
        collectionCanister : Principal;
        timestamp : Time.Time;
        pubKey : Principal;
    };
    type User = ExtCore.User;

    // Maps user and the collection canisterIds they create
    private var usersCollectionMap = TrieMap.TrieMap<Principal, [Principal]>(Principal.equal, Principal.hash);
    
    // Stores details about the tokens coming into this vault
    private stable var deposits : [Deposit] = [];

    // Collection creation
    public shared ({caller = user}) func createExtCollection(_title : Text, _symbol : Text, _metadata : Text) : async (Principal,Principal) {
        Cycles.add<system>(500_500_000_000);
        let extToken = await ExtTokenClass.EXTNFT(Principal.fromActor(Main));
        let extCollectionCanisterId = await extToken.getCanisterId();
        let collectionCanisterActor = actor (Principal.toText(extCollectionCanisterId)) : actor{
            ext_setCollectionMetadata : (
                name : Text, 
                symbol : Text, 
                metadata : Text
            ) -> async ();
            setMinter : ( minter : Principal)-> async();
            ext_admin : () -> async Principal
        };
        await collectionCanisterActor.setMinter(user);
        await collectionCanisterActor.ext_setCollectionMetadata(_title, _symbol, _metadata);
        // Updating the userCollectionMap 
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

    // Getting Collection Metadata 
    public shared ({caller = user}) func getUserCollectionDetails() : async ?[(Principal, Text, Text, Text)] {
        let collections = usersCollectionMap.get(user);
        switch (collections) {
            case (null) {
                return null;
            };
            case (?collections) {
                var result: [(Principal, Text, Text, Text)] = [];
                for (collectionCanisterId in collections.vals()) {
                    let collectionCanister = actor (Principal.toText(collectionCanisterId)) : actor {
                        getCollectionDetails: () -> async (Text, Text, Text);
                    };
                    let details = await collectionCanister.getCollectionDetails();
                    result := Array.append(result, [(collectionCanisterId, details.0, details.1, details.2)]);
                };
                return ?result;
            };
        };
    };

    // Getting Collections that user own(only gets canisterIds of respective collections)
    public shared query ({caller = user}) func getUserCollections() : async ?[Principal] {
        return usersCollectionMap.get(user);
        
    };
    
    // Getting all the collections ever created(only gets the canisterIds)
    public shared query func getAllCollections() : async [(Principal, [Principal])] {
        var result : [(Principal, [Principal])] = [];
        for ((key, value) in usersCollectionMap.entries()) {
            result := Array.append([(key, value)], result);
        };
        return result;
    };

    
    // Minting  a NFT pass the collection canisterId in which you want to mint and the required details to add, this enables minting multiple tokens
    public shared ({caller = user}) func mintExtNonFungible(
        _collectionCanisterId : Principal,
        name : Text,
        desc : Text,
        asset : Text,
        thumb : Text,
        metadata : ?MetadataContainer,
        amount : Nat

    ) : async [TokenIndex] {
        
        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor{
            ext_mint : (
                request : [(AccountIdentifier, Metadata)]
            ) -> async [TokenIndex]
        };
        let metadataNonFungible : Metadata = #nonfungible{
            name = name;
            description = desc;
            asset = asset;
            thumbnail = thumb;
            metadata = metadata;
        };

        let receiver = AID.fromPrincipal(user,null);
        var request : [(AccountIdentifier,Metadata)] = [];
        var i : Nat = 0;
        while (i < amount) {
            request := Array.append(request , [(receiver,metadataNonFungible)]);
            i := i + 1;
        }; 
        let extMint = await collectionCanisterActor.ext_mint(request);
        extMint
    };
    
    // Minting  a Fungible token pass the collection canisterId in which you want to mint and the required details to add, this enables minting multiple tokens
    public shared ({caller = user}) func mintExtFungible(
        _collectionCanisterId : Principal,
        name : Text,
        symbol : Text,
        decimals : Nat8,
        metadata: ?MetadataContainer,
        amount : Nat

    ) : async [TokenIndex] {
        
        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor{
            ext_mint : (
                request : [(AccountIdentifier, Metadata)]
            ) -> async [TokenIndex]
        };
        let metadataFungible : Metadata = #fungible{
            name = name;
            symbol = symbol;
            decimals = decimals;
            metadata = metadata;
        };

        let receiver = AID.fromPrincipal(user,null);
        var request : [(AccountIdentifier,Metadata)] = [];
        var i : Nat = 0;
        while (i < amount) {
            request := Array.append(request , [(receiver,metadataFungible)]);
            i := i + 1;
        }; 
        let extMint = await collectionCanisterActor.ext_mint(request);
        extMint
    };
    // Stores the data of token now but mints it later at the time of claiming, gives you details to be added in Link
    public shared func mintAtClaim(
        _collectionCanisterId : Principal,
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

    func principalToUser(principal: Principal) : User {
        #principal(principal)
    };

    // Token will be transfered to this Vault and gives you req details to construct a link out of it, which you can share
    public shared ({caller = user}) func createLink(
        _collectionCanisterId : Principal,
        _tokenId : TokenIndex,
        _pubKey : Principal,

    ) : async Int {
            let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor{
                ext_transfer : (
                   request: TransferRequest
                ) ->async TransferResponse
            };
           
            let userFrom: User = principalToUser(user);

            let userTo: User = principalToUser(Principal.fromActor(Main));
            let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, _tokenId);
            let transferRequest: TransferRequest = {
                from = userFrom; 
                to = userTo;
                token = tokenIdentifier;              
                amount = 1;                        
                memo = "";                        
                notify = false;                    
                subaccount = null;                 
            };

            let response = await collectionCanisterActor.ext_transfer(transferRequest);

            switch(response) {
                case (#ok(balance)) {
                    let newDeposit: Deposit = {
                        tokenId = _tokenId;
                        sender = user;
                        collectionCanister = _collectionCanisterId;
                        timestamp = Time.now();
                        pubKey = _pubKey;
                    };

                    deposits := Array.append(deposits, [newDeposit]);

                    Array.size(deposits) - 1
                };
                case (#err(err)) {
                     switch(err) {
                        case (#CannotNotify(accountId)) {
                            Debug.print("Error: Cannot notify account " # accountId);
                        };
                        case (#InsufficientBalance) {
                            Debug.print("Error: Insufficient balance");
                        };
                        case (#InvalidToken(tokenId)) {
                            Debug.print("Error: Invalid token " # tokenId);
                        };
                        case (#Other(text)) {
                            Debug.print("Error: " # text);
                        };
                        case (#Rejected) {
                            Debug.print("Error: Transfer rejected");
                        };
                        case (#Unauthorized(accountId)) {
                            Debug.print("Error: Unauthorized account " # accountId);
                        };
                    };
                    -1
                };
            }
             
    };

    // Token will be transfered to user who claims through the shared link
    public shared ({caller = user}) func claimLink(
        _collectionCanisterId : Principal,
        _depositIndex : Nat,

    ) : async Int {

            let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor{
                ext_transfer : (
                   request: TransferRequest
                ) ->async TransferResponse
            };

            let userFrom: User = principalToUser(Principal.fromActor(Main));
            let depositObj : Deposit = deposits[_depositIndex];
            let userTo: User = principalToUser(user);
            let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, depositObj.tokenId);
            let transferRequest: TransferRequest = {
                from = userFrom; 
                to = userTo;
                token = tokenIdentifier;              
                amount = 1;                        
                memo = "";                        
                notify = false;                    
                subaccount = null;                 
            };

            let response = await collectionCanisterActor.ext_transfer(transferRequest);

            switch(response) {
                case (#ok(balance)) {
                    var newDeposits: [Deposit] = [];
                    for (i in Iter.range(0,(Array.size(deposits) - 1)) ) {
                        if (i != _depositIndex) {
                            newDeposits := Array.append(newDeposits, [deposits[i]]);
                        };
                    };
                    deposits := newDeposits;
                    0
                };
                case (#err(err)) {
                    switch(err) {
                        case (#CannotNotify(accountId)) {
                            Debug.print("Error: Cannot notify account " # accountId);
                        };
                        case (#InsufficientBalance) {
                            Debug.print("Error: Insufficient balance");
                        };
                        case (#InvalidToken(tokenId)) {
                            Debug.print("Error: Invalid token " # tokenId);
                        };
                        case (#Other(text)) {
                            Debug.print("Error: " # text);
                        };
                        case (#Rejected) {
                            Debug.print("Error: Transfer rejected");
                        };
                        case (#Unauthorized(accountId)) {
                            Debug.print("Error: Unauthorized account " # accountId);
                        };
                    };
                    -1
                };
            }
             
    };

    // Gets all details about the tokens that were transfered into this vault 
    public shared query func getDeposits() : async [Deposit] {
        return deposits;
    };

}