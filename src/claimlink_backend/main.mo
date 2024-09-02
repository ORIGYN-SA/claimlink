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
import Error "mo:base/Error";
import Nat32 "mo:base/Nat32";
import Hash "mo:base/Hash";
import Timer "mo:base/Timer";
import Nat64 "mo:base/Nat64";
import Bool "mo:base/Bool";
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
            metadata : ?MetadataContainer;
        };
        #nonfungible : {
            name : Text;
            description : Text;
            asset : Text;
            thumbnail : Text;
            metadata : ?MetadataContainer;
        };
    };
    type TransferRequest = ExtCore.TransferRequest;
    type TransferResponse = ExtCore.TransferResponse;
    type Deposit = {
        tokenId : TokenIndex;
        sender : Principal;
        collectionCanister : Principal;
        timestamp : Time.Time;
        claimPattern : Text;
        status :Text;
    };
    type User = ExtCore.User;
    type Campaign = {
        id : Text;
        title : Text;
        tokenType : Text;
        collection : Principal;
        claimPattern : Text;
        tokenIds : [TokenIndex];
        walletOption : Text;
        displayWallets : [Text];
        expirationDate : Time.Time;
        createdBy : Principal;
        createdAt : Time.Time;
        depositIndices : [Nat32];
    };
    type QRSet = {
        id: Text;
        title: Text;
        quantity: Nat;
        campaignId: Text;
        createdAt: Time.Time;
        creator: Principal;
    };
    type Dispenser = {
        id : Text;
        title : Text;
        startDate : Time.Time;
        createdAt: Time.Time;
        duration : Int;
        createdBy: Principal;
        campaignId : Text;
        whitelist : ?[Principal]
    };




    // Maps user and the collection canisterIds they create
    private var usersCollectionMap = TrieMap.TrieMap<Principal, [(Time.Time,Principal)]>(Principal.equal, Principal.hash);
    private stable var stableuserCollectionMap : [(Principal,[(Time.Time,Principal)])] = [];
    //  Maps related to Campaigns
    private var campaigns = TrieMap.TrieMap<Text, Campaign>(Text.equal, Text.hash);
    private stable var stableCampaigns : [(Text,Campaign)] = [];
    private var campaignLinks = TrieMap.TrieMap<Text, [Nat32]>(Text.equal, Text.hash);
    private stable var stableCampaignLinks : [(Text, [Nat32])] = [];
    private var userCampaignsMap = TrieMap.TrieMap<Principal, [Campaign]>(Principal.equal, Principal.hash);
    private stable var stableUserCampaignsMap : [(Principal, [Campaign])] = [];
    // Maps related to dispensers
    private var dispensers = TrieMap.TrieMap<Text, Dispenser>(Text.equal, Text.hash);
    private stable var stableDispensers : [(Text,Dispenser)] = [];
    private var userDispensersMap = TrieMap.TrieMap<Principal, [Dispenser]>(Principal.equal, Principal.hash);
    private stable var stableUserDispensersMap : [(Principal, [Dispenser])] = [];
    // Maps related to QR set
    private var qrSetMap = TrieMap.TrieMap<Text, QRSet>(Text.equal, Text.hash);
    private stable var stableQrSetMap : [(Text,QRSet)] = [];
    private var userQRSetMap = TrieMap.TrieMap<Principal, [QRSet]>(Principal.equal, Principal.hash);
    private stable var stableUserQrSetMap : [(Principal, [QRSet])] = [];
    // Token data Store
    func nat32Hash(value: Nat32) : Hash.Hash {
        let natValue = Nat32.toNat(value);
        return Hash.hash(natValue);
    };
    private var tokensDataToBeMinted = TrieMap.TrieMap<Principal,[(Nat32,Metadata)]>(Principal.equal,Principal.hash);
    private stable var stableTokensDataToBeMinted : [(Principal,[(Nat32,Metadata)])] = [];
    private var nextTokenIndex : Nat32 = 0;
    // Campaign Timer
    private var campaignTimers = TrieMap.TrieMap<Text, Timer.TimerId>(Text.equal, Text.hash);
    private stable var stableCampaignTimers : [(Text, Timer.TimerId)] = [];

    // Stores details about the tokens coming into this vault
    private stable var deposits : [Deposit] = [];
    private var depositItemsMap = TrieMap.TrieMap<Nat32, Deposit>(Nat32.equal,nat32Hash);

    public shared query func getAlldepositItemsMap() : async [(Nat32, Deposit)] {
        var result : [(Nat32, Deposit)] = [];
        for ((key, value) in depositItemsMap.entries()) {
            result := Array.append([(key, value)], result);
        };
        return result;
    };


    system func preupgrade() {
        stableuserCollectionMap := Iter.toArray(usersCollectionMap.entries());
        stableCampaigns := Iter.toArray(campaigns.entries());
        stableCampaignLinks := Iter.toArray(campaignLinks.entries());
        stableUserCampaignsMap := Iter.toArray(userCampaignsMap.entries());
        stableDispensers := Iter.toArray(dispensers.entries());
        stableUserDispensersMap := Iter.toArray(userDispensersMap.entries());
        stableQrSetMap := Iter.toArray(qrSetMap.entries());
        stableUserQrSetMap := Iter.toArray(userQRSetMap.entries());
        stableTokensDataToBeMinted := Iter.toArray(tokensDataToBeMinted.entries());
        stableCampaignTimers := Iter.toArray(campaignTimers.entries());

    };

    // Postupgrade function to restore the data from stable variables
    system func postupgrade() {

        usersCollectionMap := TrieMap.fromEntries(stableuserCollectionMap.vals(), Principal.equal, Principal.hash);
        campaigns := TrieMap.fromEntries(stableCampaigns.vals(), Text.equal, Text.hash);
        campaignLinks := TrieMap.fromEntries(stableCampaignLinks.vals(), Text.equal, Text.hash);
        userCampaignsMap := TrieMap.fromEntries(stableUserCampaignsMap.vals(), Principal.equal, Principal.hash);
        dispensers := TrieMap.fromEntries(stableDispensers.vals(), Text.equal, Text.hash);
        userDispensersMap := TrieMap.fromEntries(stableUserDispensersMap.vals(), Principal.equal, Principal.hash);
        qrSetMap := TrieMap.fromEntries(stableQrSetMap.vals(), Text.equal, Text.hash);
        userQRSetMap := TrieMap.fromEntries(stableUserQrSetMap.vals(), Principal.equal, Principal.hash);
        tokensDataToBeMinted := TrieMap.fromEntries(stableTokensDataToBeMinted.vals(), Principal.equal, Principal.hash);
        campaignTimers := TrieMap.fromEntries(stableCampaignTimers.vals(), Text.equal, Text.hash);
    };

    public shared query func getDeposits() : async [Deposit] {
        return deposits;
    };

    func generateKey(caller: AccountIdentifier, timestamp: Time.Time, tokenId: TokenIndex): Hash.Hash {
        let callerNat = AID.hash(caller);
        let timestampNat = Int.hash(timestamp);
        let combinedNat : Nat = Nat32.toNat((callerNat) + (timestampNat) + (tokenId));
        return Hash.hash(combinedNat);
    };

    // func knowAdmin(caller : Principal) : async Bool{
    //     let extToken = await ExtTokenClass.EXTNFT(caller);
    //     extToken._isAdmin(caller);
    // };

    public shared ({caller = user }) func addCollectionToUserMap (collection_id : Principal) : async Text {

        let userCollections = usersCollectionMap.get(user);
        let currentTime = Time.now();
        switch (userCollections) {
            case null {
                // No collections exist, create a new list with the current collection
                let newCollections: [(Time.Time, Principal)] = [(currentTime, collection_id)];
                usersCollectionMap.put(user, newCollections);
                return "Collection added";
            };
            case (?collections) {
                // Check if the collection already exists
                let collectionExists = List.some<(Time.Time, Principal)>(
                    List.fromArray(collections),
                    func x { x.1 == collection_id }
                );
                if (collectionExists) {
                    return "Collection already added";
                } else {
                    // Add the new collection with a timestamp
                    let updatedCollections = List.push<(Time.Time, Principal)>((currentTime, collection_id), List.fromArray(collections));
                    usersCollectionMap.put(user, List.toArray(updatedCollections));
                    return "Collection added";
                };
            };
        };
    }; 

    public shared ({caller = user}) func removeCollectionFromUserMap (collection_id : Principal) : async Text {

        let userCollections = usersCollectionMap.get(user);
        switch (userCollections) {
            case null {
                return "There are no collections added yet!";
            };
            case (?collections) {
                // Filter out the collection to remove
                let updatedCollections = List.filter<(Time.Time, Principal)>(
                    List.fromArray(collections),
                    func x { x.1 != collection_id }
                );
                if (List.isNil(updatedCollections)) {
                    usersCollectionMap.delete(user);
                } else {
                    usersCollectionMap.put(user, List.toArray(updatedCollections));
                };
                return "Collection removed";
            };
        };
    };

    // Collection creation
    public shared ({ caller = user }) func createExtCollection(_title : Text, _symbol : Text, _metadata : Text) : async (Principal, Principal) {
        Cycles.add<system>(500_500_000_000);
        let extToken = await ExtTokenClass.EXTNFT(Principal.fromActor(Main));
        let extCollectionCanisterId = await extToken.getCanisterId();
        let collectionCanisterActor = actor (Principal.toText(extCollectionCanisterId)) : actor {
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
                let updatedCollections = [(Time.now(), extCollectionCanisterId)];
                usersCollectionMap.put(user,updatedCollections);
                return (user, extCollectionCanisterId);
            };
            case (?collections){
                let updatedObj = List.push((Time.now(), extCollectionCanisterId),List.fromArray(collections));
                usersCollectionMap.put(user,List.toArray(updatedObj));
                return (user, extCollectionCanisterId);
            };
        };
            
    };

    // Getting Collection Metadata 
    public shared ({caller = user}) func getUserCollectionDetails() : async ?[(Time.Time, Principal, Text, Text, Text)] {
        let collections = usersCollectionMap.get(user);
        switch (collections) {
            case (null) {
                return null;
            };
            case (?collections) {
                var result : [(Time.Time, Principal, Text, Text, Text)] = [];
                for ((timestamp, collectionCanisterId) in collections.vals()) {
                    let collectionCanister = actor (Principal.toText(collectionCanisterId)) : actor {
                        getCollectionDetails: () -> async (Text, Text, Text);
                    };
                    let details = await collectionCanister.getCollectionDetails();
                    result := Array.append(result, [(timestamp, collectionCanisterId, details.0, details.1, details.2)]);
                };
                return ?result;
            };
        };
    };

    // Getting Collections that user own(only gets canisterIds of respective collections)
    public shared query ({caller = user}) func getUserCollections() : async ?[(Time.Time,Principal)] {
        return usersCollectionMap.get(user);
    };
    
    // Getting all the collections ever created(only gets the canisterIds)
    public shared query func getAllCollections() : async [(Principal, [(Time.Time, Principal)])] {
        var result : [(Principal, [(Time.Time, Principal)])] = [];
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
    public shared func storeTokendetails(
        _collectionCanisterId : Principal,
        name : Text,
        desc : Text,
        asset : Text,
        thumb : Text,
        metadata : ?MetadataContainer,
        amount : Nat
    ) : async [Nat32] {
        
        let metadataNonFungible : Metadata = #nonfungible{
            name = name;
            description = desc;
            asset = asset;
            thumbnail = thumb;
            metadata = metadata;
        };

        var i = 0;
        var nextTokenIds : [Nat32] = [];
        while (i < amount) {
            try {
                let currentTokens = switch(tokensDataToBeMinted.get(_collectionCanisterId)) {
                    case (?existingTokens) existingTokens;
                    case null [];
                };
                let updatedTokens = Array.append(currentTokens, [(nextTokenIndex, metadataNonFungible)]);
                tokensDataToBeMinted.put(_collectionCanisterId, updatedTokens);
                
                nextTokenIds := Array.append(nextTokenIds, [nextTokenIndex]);
                nextTokenIndex := nextTokenIndex + 1;
                i := i + 1;

            } catch (e) {
                throw Error.reject("Error occurred while storing token details");
            }
        };

        return nextTokenIds;
    };

    public shared func getStoredTokens(
        _collectionCanisterId : Principal    
    ) : async ?[(Nat32, Metadata)] {
        tokensDataToBeMinted.get(_collectionCanisterId)
    };

    public shared ({caller = user}) func mintAtClaim(
        user : Principal,
        _collectionCanisterId : Principal,
        _depositItem : Deposit,
        _depositKey : Nat32

    ) : async Int {
        
        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor{
            ext_mint : (
                request : [(AccountIdentifier, Metadata)]
            ) -> async [TokenIndex]
        };
        // if (_depositIndex >= Array.size(deposits)) {
        //     throw Error.reject("Invalid deposit Index (out of bounds)");
        //     return -1;
        // };

        let depositItem : Deposit = _depositItem;

        if (_collectionCanisterId != depositItem.collectionCanister) {
            throw Error.reject("Collection canister ID mismatch");
            return -1;
        };

        switch (tokensDataToBeMinted.get(_collectionCanisterId)) {
            case (?tokensList) {
                var foundToken: ?(Nat32, Metadata) = null;
                var remainingTokens: [(Nat32, Metadata)] = [];

                for (token in tokensList.vals()) {
                    if (token.0 == depositItem.tokenId) {
                        foundToken := ?token;
                    } else {
                        remainingTokens := Array.append(remainingTokens, [token]);
                    };
                };

                switch (foundToken) {
                    case (?(_, metadata)) {
                        let receiver = AID.fromPrincipal(user, null);
                        let request: [(AccountIdentifier, Metadata)] = [(receiver, metadata)]; 

                        let response = await collectionCanisterActor.ext_mint(request);

                        // Assuming minting was successful
                        deposits := Array.filter<Deposit>(deposits, func(d: Deposit) : Bool {
                            return d != depositItem;
                        });
                        depositItemsMap.delete(_depositKey);
                        if (Array.size(remainingTokens) > 0) {
                            tokensDataToBeMinted.put(depositItem.collectionCanister, remainingTokens);
                        } else {
                            tokensDataToBeMinted.delete(_collectionCanisterId);
                        };

                        return 0;
                    };
                    case null {
                        Debug.print("Token ID does not match any in the deposit object");
                        return -1;
                    };
                };
            };
            case null {
                Debug.print("No metadata found for the given token");
                return -1;
            };
        };
      
    };
    
    // Get Fungible token details for specific collection
    public shared func getFungibleTokens(
        _collectionCanisterId : Principal
    ) : async [(TokenIndex, AccountIdentifier, Metadata)] {
        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor{
            getAllFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Metadata)]
        };
        await collectionCanisterActor.getAllFungibleTokenData();
    };

    // Get NFT details for specific collection
    public shared func getNonFungibleTokens(
        _collectionCanisterId : Principal    
    ) : async [(TokenIndex, AccountIdentifier, Metadata)] {
        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor{
            getAllNonFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Metadata)]
        };
        await collectionCanisterActor.getAllNonFungibleTokenData();
    };

    
    


    func principalToUser(principal: Principal) : User {
        #principal(principal)
    };

    // Token will be transfered to this Vault and gives you req details to construct a link out of it, which you can share
    public shared ({caller = user}) func createLink(
        _collectionCanisterId : Principal,
        _from : Principal,
        _tokenId : TokenIndex,

    ) : async Nat32 {
            let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor{
                ext_transfer : (
                   request: TransferRequest
                ) ->async TransferResponse
            };
           
            let userFrom: User = principalToUser(_from);
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
            let userAID = AID.fromPrincipal(_from,null); 
            let response = await collectionCanisterActor.ext_transfer(transferRequest);

            switch(response) {
                case (#ok(balance)) {
                    let key = generateKey(userAID, Time.now(), _tokenId);
                    let newDeposit: Deposit = {
                        tokenId = _tokenId;
                        sender = _from;
                        collectionCanister = _collectionCanisterId;
                        timestamp = Time.now();
                        claimPattern = "transfer";
                        status = "created";
                    };
                    depositItemsMap.put(key,newDeposit);

                    deposits := Array.append(deposits, [newDeposit]);

                    // Array.size(deposits) - 1
                    key
                };
                case (#err(err)) {
                     switch(err) {
                        case (#CannotNotify(accountId)) {
                            throw Error.reject("Error: Cannot notify account " # accountId);
                        };
                        case (#InsufficientBalance) {
                            throw Error.reject("Error: Insufficient balance");
                        };
                        case (#InvalidToken(tokenId)) {
                            throw Error.reject("Error: Invalid token " # tokenId);
                        };
                        case (#Other(text)) {
                            throw Error.reject("Error: " # text);
                        };
                        case (#Rejected) {
                            throw Error.reject("Error: Transfer rejected");
                        };
                        case (#Unauthorized(accountId)) {
                            throw Error.reject("Error: Unauthorized account " # accountId);
                        };
                    };
                    throw Error.reject("Error");
                    0
                };
            }
             
    };

    public shared ({caller = user}) func createLinkForNonMinted(
        _collectionCanisterId : Principal,
        _from : Principal,
        _tokenId : Nat32
    ) : async Nat32 {
        // Check if the tokenId exists in the tokensDataToBeMinted for the given collection
        switch (tokensDataToBeMinted.get(_collectionCanisterId)) {
            case (?tokensList) {
                var matchingToken: ?(Nat32, Metadata) = null;

                for (token in tokensList.vals()) {
                    if (token.0 == _tokenId) {
                        matchingToken := ?token;
                    }
                };
                let userAID = AID.fromPrincipal(_from,null); 

                switch (matchingToken) {
                    case (?(_, metadata)) {
                        // Create a deposit entry for the non-minted token
                        let key = generateKey(userAID, Time.now(), _tokenId);
                        let newDeposit: Deposit = {
                            tokenId = _tokenId;
                            sender = _from;
                            collectionCanister = _collectionCanisterId;
                            timestamp = Time.now();
                            claimPattern = "mint";
                            status = "created";
                        };
                        depositItemsMap.put(key,newDeposit);

                        deposits := Array.append(deposits, [newDeposit]);

                        // Return the index of the deposit in the deposits array
                        // return Array.size(deposits) - 1;
                        key;
                    };
                    case null {
                        throw Error.reject("Token ID does not match any stored metadata");
                        return 0;
                    };
                };
            };
            case null {
                throw Error.reject("No stored tokens found for the given collection canister");
                return 0;
            };
        };
    };

    public shared ({caller = user}) func claimToken(
        _collectionCanisterId: Principal,
        _depositKey: Nat32
    ) : async Int {
        // if (_depositIndex >= Array.size(deposits)) {
        //     throw Error.reject("Invalid deposit Index (out of bounds)");
        //     return -1;
        // };

        // let depositItem = deposits[_depositIndex];
        let depositItem = switch(depositItemsMap.get(_depositKey)){
            case(?deposit){
                deposit
            };
            case null throw Error.reject("Deposit index not found");
        };


        // Determine the claim pattern and call the appropriate function
        switch (depositItem.claimPattern) {
            case ("transfer") {
                // Call claimLink for already minted tokens
                return await claimLink(user, _collectionCanisterId, depositItem,_depositKey);
            };
            case ("mint") {
                // Call mintAtClaim for tokens that need to be minted
                return await mintAtClaim(user, _collectionCanisterId, depositItem, _depositKey);
            };
            case _ {
                Debug.print("Invalid claim pattern: " # depositItem.claimPattern);
                return -1;
            };
        };
    };

    


    // Token will be transfered to user who claims through the shared link
    func claimLink(
        user : Principal,
        _collectionCanisterId : Principal,
        _depositItem : Deposit,
        _depositKey : Nat32
    ) : async Int {
            
            let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor{
                ext_transfer : (
                   request: TransferRequest
                ) ->async TransferResponse
            };

            // if (_depositIndex >= Array.size(deposits)) {
            //     throw Error.reject("Invalid deposit Index (out of bounds)");
            //     return -1;
            // };

            let depositObj : Deposit = _depositItem;

            if (_collectionCanisterId != depositObj.collectionCanister) {
                throw Error.reject("Collection canister ID mismatch");
                return -1;
            };

            let userFrom: User = principalToUser(Principal.fromActor(Main));
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
                    deposits := Array.filter<Deposit>(deposits, func(d: Deposit) : Bool {
                        return d != depositObj;
                    });
                    depositItemsMap.delete(_depositKey);
                    for (campaignId in campaignLinks.keys()) {
                        switch (campaignLinks.get(campaignId)) {
                            case (?linkIndices) {
                                var newLinks : [Nat32] = [];
                                // Adjust indices and filter out the claimed one
                                newLinks := Array.filter<Nat32>(linkIndices, func(key: Nat32) : Bool {
                                    return key != _depositKey;
                                });
                                
                                // Store the updated indices back in campaignLinks
                                campaignLinks.put(campaignId, newLinks);
                            };
                            case null {
                                Debug.print("No link created while campaign creation")
                            }; // CampaignId not found in campaignLinks
                        };
                    };
                    return 0; 
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

    // Campaign creation
    public shared ({caller = user}) func createCampaign (
        title: Text,
        tokenType: Text,
        collection : Principal,
        claimPattern: Text,
        tokenIds: [TokenIndex],
        walletOption: Text,
        displayWallets : [Text],
        expirationDate: Time.Time,
    ) : async (Text,[Nat32]) {
        let campaignId = generateCampaignId(user);
        var linkResponses: [Nat32] = [];

        for (tokenId in tokenIds.vals()) {
            var linkKeys : Nat32 = 0;
            if(claimPattern == "transfer"){
                linkKeys := await createLink(collection, user, tokenId);
            } else if (claimPattern == "mint") {
                linkKeys := await createLinkForNonMinted(collection, user, tokenId);
            } else {
                throw Error.reject("Invalid claimPattern: " # claimPattern);
            };

            if (linkKeys == 0) {
                // If createLink or createLinksForNonMinted fails, throw an error and abort campaign creation
                throw Error.reject("Failed to create campaign: " # claimPattern # " failed for tokenId " # Nat32.toText(tokenId));
            };

            linkResponses := Array.append(linkResponses, [linkKeys]);
            campaignLinks.put(campaignId, linkResponses);
        };

        let campaign : Campaign = {
            id = campaignId;
            title = title;
            tokenType = tokenType;
            collection = collection;
            claimPattern = claimPattern;
            tokenIds = tokenIds;
            walletOption = walletOption;
            displayWallets = displayWallets;
            expirationDate = expirationDate;
            createdBy = user;
            createdAt = Time.now();
            depositIndices = linkResponses;
        };
        campaigns.put(campaignId, campaign);

        let userCampaigns = userCampaignsMap.get(user);
        switch (userCampaigns) {
            case null {
                userCampaignsMap.put(user, [campaign]);
            };
            case (?userCampaigns) {
                userCampaignsMap.put(user, Array.append(userCampaigns, [campaign]));
            };
        };

        switch (?expirationDate) {
            case (?exp) await scheduleCampaignDeletion(campaignId, exp);
            case null Debug.print("Invalid expiration date format");
        };

        return (campaignId, linkResponses);
    };

    func scheduleCampaignDeletion(campaignId : Text, expiration: Time.Time) : async () {
        let now = Time.now();
        let duration = if (expiration > now) expiration - now else now - expiration;
        let natDuration = Nat64.toNat(Nat64.fromIntWrap(duration));
        if (duration > 0) {
            let id = Timer.setTimer<system>(#nanoseconds natDuration, func () : async () {
                deleteCampaign(campaignId);
            });
            campaignTimers.put(campaignId, id);
        };
    };

    // internal function to take care of link expiration
    func deleteCampaign(campaignId: Text) {
        // Delete QR sets related to the campaign
        qrSetMap.delete(campaignId);

        // Delete dispensers related to the campaign
        dispensers.delete(campaignId);

        // Delete links related to the campaign
        campaignLinks.delete(campaignId);

        // Delete the campaign itself
        campaigns.delete(campaignId);

        // Cancel the scheduled timer if it exists
        switch (campaignTimers.get(campaignId)) {
            case (?timerId) {
                Timer.cancelTimer(timerId);
                campaignTimers.delete(campaignId);
            };
            case null {};
        };

        // Remove the campaign from the user's campaign map
        for ((user, userCampaigns) in userCampaignsMap.entries()) {
            let updatedCampaigns = Array.filter<Campaign>(userCampaigns ,func (campaign) : Bool {
                campaign.id != campaignId
            });
            if (updatedCampaigns.size() == 0) {
                userCampaignsMap.delete(user);
            } else {
                userCampaignsMap.put(user, updatedCampaigns);
            };
        };

        // Remove related QR sets from user's QR set map
        for ((user, userQRSets) in userQRSetMap.entries()) {
            let updatedQRSets = Array.filter<QRSet>(userQRSets ,func (qrSet) : Bool {
                qrSet.campaignId != campaignId
            });
            if (updatedQRSets.size() == 0) {
                userQRSetMap.delete(user);
            } else {
                userQRSetMap.put(user, updatedQRSets);
            };
        };

        // Remove related dispensers from user's dispenser map
        for ((user, userDispensers) in userDispensersMap.entries()) {
            let updatedDispensers = Array.filter<Dispenser>(
                userDispensers,
                func(dispenser) : Bool {
                    dispenser.campaignId != campaignId;
                },
            );
            if (updatedDispensers.size() == 0) {
                userDispensersMap.delete(user);
            } else {
                userDispensersMap.put(user, updatedDispensers);
            };
        };
    };



    // Get details of a specific Campaign
    public shared query func getCampaignDetails(campaignId : Text) : async ?Campaign {
        campaigns.get(campaignId);
    };
    // Get Links created inside a Campaign
    public shared query func getCampaignLinks(campaignId : Text) : async ?[Nat32] {
        campaignLinks.get(campaignId);
    };
    // Get all campaigns created by a user
    public shared query ({ caller = user }) func getUserCampaigns() : async ?[Campaign] {
        userCampaignsMap.get(user);
    };

    // Generation of unique campaign ID
    private func generateCampaignId(user : Principal) : Text {
        // Using user ID (Principal) and current timestamp to generate a unique campaign ID
        let timestamp = Time.now();
        let userId = Principal.toText(user);
        "Campaign-" # userId # "_" # Int.toText(timestamp)
    };

    // QR Set Creation
    public shared ({ caller = user }) func createQRSet(
        title : Text,
        quantity : Nat,
        campaignId : Text
    ) : async Text {

        let qrSetId = generateQRSetId(user);

        let newQRSet : QRSet = {
            id = qrSetId;
            title = title;
            quantity = quantity;
            campaignId = campaignId;
            createdAt = Time.now();
            creator = user;
        };

        qrSetMap.put(qrSetId, newQRSet);

        let userQRSets = userQRSetMap.get(user);
        switch (userQRSets) {
            case (null) {
                userQRSetMap.put(user, [newQRSet]);
            };
            case (?userQRSets) {
                userQRSetMap.put(user, Array.append(userQRSets, [newQRSet]));
            };
        };

        qrSetId
    };

    private func generateQRSetId(user : Principal) : Text {
        // Using user ID (Principal) and current timestamp to generate a unique campaign ID
        let timestamp = Time.now();
        let userId = Principal.toText(user);
        "QR-" #userId # "_" # Int.toText(timestamp)
    };

    // Get details of a specific QR set
    public shared query func getQRSetById(qrSetId : Text) : async ?QRSet {
        qrSetMap.get(qrSetId)
    };

    // Get all QR sets created by a user
    public shared query ({ caller = user }) func getUserQRSets() : async ?[QRSet] {
        userQRSetMap.get(user)
    };

    // public shared({caller = user}) func deleteQRSet(qrSetId: Text) : async Int {
    //     // Check if the QRSet exists
    //     switch (qrSetMap.get(qrSetId)) {
    //         case (?qrSet) {
    //             // QRSet exists, proceed with deletion
    //             qrSetMap.remove(qrSetId);
                
    //             // Remove QRSet from userQRSetMap
    //             let userQRSetEntries = userQRSetMap.get(user);
    //             switch (userQRSetEntries) {
    //                 case (?qrSets) {
    //                     let updatedQRSetEntries = List.filter<QRSet>(fun(qrSet) { qrSet.id != qrSetId }, List.fromArray(userQRSets));
    //                     userQRSetMap.put(user, List.toArray(updatedQRSetEntries));
    //                 };
    //                 case null {
    //                     // No QR sets found for the user
    //                 };
    //             };
                
    //             return 0; // Indicate success
    //         };
    //         case null {
    //             // QRSet does not exist
    //             return -1; // Indicate failure
    //         };
    //     }
    // };

    public shared ({ caller = user }) func createDispenser (
        _title : Text,
        _startDate : Time.Time,
        _duration : Int,
        _campaignId : Text,
        _whitelist : ?[Principal]
    ) : async Text {
        let dispenserId = generateDispenserId(user);

        let dispenser : Dispenser = {
            id = dispenserId;
            title = _title;
            startDate = _startDate;
            createdAt = Time.now();
            createdBy = user;
            duration = _duration;
            campaignId = _campaignId;
            whitelist = _whitelist;
        };

        dispensers.put(dispenserId, dispenser);

        let userDispensers = userDispensersMap.get(user);
        switch (userDispensers) {
            case null {
                userDispensersMap.put(user, [dispenser]);
            };
            case (?userDispensers) {
                userDispensersMap.put(user, Array.append(userDispensers, [dispenser]));
            };
        };

        return dispenserId;
    };

    // Get details of a specific Dispenser
    public shared query func getDispenserDetails(dispenserId : Text) : async ?Dispenser {
        dispensers.get(dispenserId);
    };

    // Get all dispensers created by a user
    public shared query ({ caller = user }) func getUserDispensers() : async ?[Dispenser] {
        userDispensersMap.get(user);
    };

    // Generation of unique dispenser ID
    private func generateDispenserId(user : Principal) : Text {
        // Using user ID (Principal) and current timestamp to generate a unique dispenser ID
        let timestamp = Time.now();
        let userId = Principal.toText(user);
        "Dispenser-" # userId # "_" # Int.toText(timestamp)
    };
}