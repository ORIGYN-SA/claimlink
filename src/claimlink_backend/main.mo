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
        pubKey : Principal;
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
        expirationDate : ?Time.Time;
        createdBy : Principal;
        createdAt : Time.Time;
        depositIndices : [Int];
    };
    type QRSet = {
        id: Text;
        title: Text;
        quantity: Nat;
        campaignId: Text;
        createdAt: Time.Time;
        creator: Principal;
    };




    // Maps user and the collection canisterIds they create
    private var usersCollectionMap = TrieMap.TrieMap<Principal, [(Time.Time,Principal)]>(Principal.equal, Principal.hash);
    //  Maps related to Campaigns
    private var campaigns = TrieMap.TrieMap<Text, Campaign>(Text.equal, Text.hash);
    private var userCampaignsMap = TrieMap.TrieMap<Principal, [Campaign]>(Principal.equal, Principal.hash);
    // Maps related to QR set
    private var qrSetMap = TrieMap.TrieMap<Text, QRSet>(Text.equal, Text.hash);
    private var userQRSetMap = TrieMap.TrieMap<Principal, [QRSet]>(Principal.equal, Principal.hash);
    // Token data Store
    func nat32Hash(value: Nat32) : Hash.Hash {
        let natValue = Nat32.toNat(value);
        return Hash.hash(natValue);
    };
    private var tokensDataToBeMinted = TrieMap.TrieMap<Nat32,Metadata>(Nat32.equal,nat32Hash);
    private var nextTokenIndex : Nat32 = 0;
    // Stores details about the tokens coming into this vault
    private stable var deposits : [Deposit] = [];

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

    public shared func storeTokendetails(
        _collectionCanisterId : Principal,
        name : Text,
        desc : Text,
        asset : Text,
        thumb : Text,
        metadata : ?MetadataContainer,
        amount : Nat

    ) : async [Int] {
        
        let metadataNonFungible : Metadata = #nonfungible{
            name = name;
            description = desc;
            asset = asset;
            thumbnail = thumb;
            metadata = metadata;
        };
        var i = 0;
        var responses : [Int] = [];
        while (i < amount) {
            tokensDataToBeMinted.put(nextTokenIndex, metadataNonFungible);
            let response = await createLinkForNonMinted(_collectionCanisterId,nextTokenIndex);
            responses := Array.append(responses,[response]);
            nextTokenIndex := nextTokenIndex + 1;
            i := i + 1;
        };
        responses
    };

    public shared ({caller = user}) func mintAtClaim(
        _collectionCanisterId : Principal,
        _depositIndex : Nat

    ) : async () {
        
        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor{
            ext_mint : (
                request : [(AccountIdentifier, Metadata)]
            ) -> async [TokenIndex]
        };
        let depositItem = deposits[_depositIndex];
        switch(tokensDataToBeMinted.get(depositItem.tokenId)){
            case(?(metadata)){
                let receiver = AID.fromPrincipal(user,null);
                let request = [(receiver, metadata)];
                let response = await collectionCanisterActor.ext_mint(request);
            };
            case null {
                
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

    // Stores the data of token now but mints it later at the time of claiming, gives you details to be added in Link

    func principalToUser(principal: Principal) : User {
        #principal(principal)
    };

    // Token will be transfered to this Vault and gives you req details to construct a link out of it, which you can share
    public shared ({caller = user}) func createLink(
        _collectionCanisterId : Principal,
        _from : Principal,
        _tokenId : TokenIndex,
        _pubKey : Principal,

    ) : async Int {
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

    public shared ({caller = user}) func createLinkForNonMinted(
        _collectionCanisterId: Principal,
        _dummyTokenId: TokenIndex,
    ) : async Int {
        
            let newDeposit: Deposit = {
                tokenId = _dummyTokenId;
                sender = user;
                collectionCanister = _collectionCanisterId;
                timestamp = Time.now();
                pubKey = user
            };
            deposits := Array.append(deposits, [newDeposit]);
            Array.size(deposits) - 1
                    

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

    // Campaign creation
    public shared ({caller = user}) func createCampaign (
        title: Text,
        tokenType: Text,
        collection : Principal,
        claimPattern: Text,
        tokenIds: [TokenIndex],
        walletOption: Text,
        displayWallets : [Text],
        expirationDate: ?Time.Time,
    ) : async (Text,[Int]) {
        let campaignId = generateCampaignId(user);
        var linkResponses: [Int] = [];

        for (tokenId in tokenIds.vals()) {
            let linkIndex = await createLink(collection, user, tokenId, user);
            if (linkIndex == -1) {
                // If createLink fails, throw an error and abort campaign creation
                throw Error.reject("Failed to create campaign: createLink failed for tokenId " # Nat32.toText(tokenId));
            };
            linkResponses := Array.append(linkResponses, [linkIndex]);
        };

        let campaign: Campaign = {
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

        return (campaignId, linkResponses);
    };

    // Get details of a specific Campaign
    public shared query func getCampaignDetails(campaignId: Text) : async ?Campaign {
        campaigns.get(campaignId);
    };

    // Get all campaigns created by a user
    public shared query ({caller = user}) func getUserCampaigns() : async ?[Campaign] {
        userCampaignsMap.get(user);
    };

    // Generation of unique campaign ID
    private func generateCampaignId(user: Principal) : Text {
        // Using user ID (Principal) and current timestamp to generate a unique campaign ID
        let timestamp = Time.now();
        let userId = Principal.toText(user);
        "Campaign" # userId # "_" # Int.toText(timestamp)
    };

    // QR Set Creation
    public shared({caller = user}) func createQRSet(
        title: Text,
        quantity: Nat,
        campaignId: Text
    ) : async Text {

        let qrSetId = generateQRSetId(user);

        let newQRSet: QRSet = {
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

    private func generateQRSetId(user: Principal) : Text {
        // Using user ID (Principal) and current timestamp to generate a unique campaign ID
        let timestamp = Time.now();
        let userId = Principal.toText(user);
        "QR-" #userId # "_" # Int.toText(timestamp)
    };

    // Get details of a specific QR set
    public shared query func getQRSetById(qrSetId: Text) : async ?QRSet {
        qrSetMap.get(qrSetId)
    };

    // Get all QR sets created by a user
    public shared query ({caller = user}) func getUserQRSets() : async ?[QRSet] {
        userQRSetMap.get(user)
    };

    // Gets all details about the tokens that were transfered into this vault 
    public shared query func getDeposits() : async [Deposit] {
        return deposits;
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


}