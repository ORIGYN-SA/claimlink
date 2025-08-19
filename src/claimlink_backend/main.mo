import OrigynNFTInterface "./OrigynNFTInterface";
import IC "mo:ic";
import ExtTokenClass "../extv2/ext_v2/v2";
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";
import Result "mo:base/Result";
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
import Float "mo:base/Float";
import Buffer "mo:base/Buffer";
import Blob "mo:base/Blob";
import Option "mo:base/Option";
import AID "../extv2/motoko/util/AccountIdentifier";
import ExtCore "../extv2/motoko/ext/Core";
import ExtCommon "../extv2/motoko/ext/Common";

actor Main {

    type AccountIdentifier = ExtCore.AccountIdentifier;
    type SubAccount = ExtCore.SubAccount;
    type TokenIndex = ExtCore.TokenIndex;
    type TokenIdentifier = ExtCore.TokenIdentifier;
    type CommonError = ExtCore.CommonError;
    type MetadataLegacy = ExtCommon.Metadata;

    type MetadataValue = (
        Text,
        {
            #text : Text;
            #blob : Blob;
            #nat : Nat;
            #nat8 : Nat8;
        },
    );
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
    type AccountBalanceArgs = { account : AccountIdentifier };
    type BinaryAccountBalanceArgs = { account : Blob };
    public type Account = { owner : Principal; subaccount : ?Blob };

    public type TimeStamp = { timestamp_nanos : Nat64 };
    public type Tokens = { e8s : Nat64 };
    // public type TransferArgs = {
    //     to : AccountIdentifier;
    //     fee : Tokens;
    //     memo : Nat64;
    //     from_subaccount : ?AccountIdentifier;
    //     created_at_time : ?TimeStamp;
    //     amount : Tokens;
    // };
    // type TransferArgs = {
    //     amount : Tokens;
    //     toPrincipal : Principal;
    //     toSubaccount : ?IcpLedger.SubAccount;
    // };
    public type TransferFromArgs = {
        to : Account;
        fee : ?Nat;
        spender_subaccount : ?Blob;
        from : Account;
        memo : ?Blob;
        created_at_time : ?Nat64;
        amount : Nat;
    };
    type ICPTs = { e8s : Nat64 };
    type SendArgs = {
        memo : Nat64;
        amount : ICPTs;
        fee : ICPTs;
        from_subaccount : ?SubAccount;
        to : AccountIdentifier;
        created_at_time : ?Time.Time;
    };
    type Deposit = {
        tokenId : TokenIndex;
        sender : Principal;
        collectionCanister : Principal;
        timestamp : Time.Time;
        claimPattern : Text;
        status : Text;
    };
    type User = ExtCore.User;
    type Status = {
        #Ongoing;
        #Completed;
        #Expired;
    };
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
        status : Status;
    };
    type QRSet = {
        id : Text;
        title : Text;
        quantity : Nat;
        campaignId : Text;
        createdAt : Time.Time;
        creator : Principal;
        status : Status;
    };
    type Dispenser = {
        id : Text;
        title : Text;
        startDate : Time.Time;
        createdAt : Time.Time;
        duration : Int;
        createdBy : Principal;
        campaignId : Text;
        whitelist : [Principal];
        status : Status;
    };
    type Link = {
        tokenId : TokenIndex;
        collection : Principal;
        linkKey : Nat32;
        claimPattern : Text;
        createdBy : AccountIdentifier;
    };
    public type TransferError_1 = {
        #TxTooOld : { allowed_window_nanos : Nat64 };
        #BadFee : { expected_fee : Tokens };
        #TxDuplicate : { duplicate_of : Nat64 };
        #TxCreatedInFuture;
        #InsufficientFunds : { balance : Tokens };
    };
    public type Result_6 = { #Ok : Nat64; #Err : TransferError_1 };
    public type Result_3 = { #Ok : Nat; #Err : TransferFromError };
    public type TransferFromError = {
        #GenericError : { message : Text; error_code : Nat };
        #TemporarilyUnavailable;
        #InsufficientAllowance : { allowance : Nat };
        #BadBurn : { min_burn_amount : Nat };
        #Duplicate : { duplicate_of : Nat };
        #BadFee : { expected_fee : Nat };
        #CreatedInFuture : { ledger_time : Nat64 };
        #TooOld;
        #InsufficientFunds : { balance : Nat };
    };
    public type DetailValue = {
        #True;
        #False;
        #U64 : Nat;
        #I64 : Int;
        #Float : Float;
        #Text : Text;
        #Principal : Principal;
        #Slice : [Nat8];
        #Vec : [DetailValue];
    };
    public type AddCanisterInput = {
        name : Text;
        description : Text;
        thumbnail : Text;
        frontend : ?Text;
        principal_id : Principal;
        details : [(Text, DetailValue)];
    };
    public type OperationError = {
        #NotAuthorized;
        #BadParameters;
        #NonExistentItem;
        #Unknown : Text;
    };
    public type CanisterMetadata = {
        name : Text;
        description : Text;
        thumbnail : Text;
        frontend : ?Text;
        principal_id : Principal;
        submitter : Principal;
        last_updated_by : Principal;
        last_updated_at : Time.Time;
        details : [(Text, DetailValue)];
    };

    // Maps user and the collection canisterIds they create
    private stable var allCollections : [Principal] = [];
    private var usersCollectionMap = TrieMap.TrieMap<Principal, [(Time.Time, Principal)]>(Principal.equal, Principal.hash);
    private stable var stableuserCollectionMap : [(Principal, [(Time.Time, Principal)])] = [];
    // Map to store created Links
    private var userLinks = TrieMap.TrieMap<Principal, [Link]>(Principal.equal, Principal.hash);
    private stable var stableUserLinks : [(Principal, [Link])] = [];
    stable var claimCount : Nat = 0;
    stable var linksCount : Nat = 0;
    stable var userClaimCount : [(Principal, Nat)] = [];
    stable var userLinksCount : [(Principal, Nat)] = [];
    // Daily Stats
    stable var dailyLinksCreatedCount : Nat = 0;
    stable var dailyLinksClaimedCount : Nat = 0;
    stable var dailyUserLinksCreatedCount : [(Principal, Nat)] = [];
    stable var dailyUserLinksClaimedCount : [(Principal, Nat)] = [];

    private var claimedTokensMap = TrieMap.TrieMap<Principal, [(Principal, Nat)]>(Principal.equal, Principal.hash);
    private stable var stableClaimedTokensMap : [(Principal, [(Principal, Nat)])] = [];

    //  Maps related to Campaigns
    private var campaigns = TrieMap.TrieMap<Text, Campaign>(Text.equal, Text.hash);
    private stable var stableCampaigns : [(Text, Campaign)] = [];
    private var campaignLinks = TrieMap.TrieMap<Text, [Nat32]>(Text.equal, Text.hash);
    private stable var stableCampaignLinks : [(Text, [Nat32])] = [];
    private var userCampaignsMap = TrieMap.TrieMap<Principal, [Campaign]>(Principal.equal, Principal.hash);
    private stable var stableUserCampaignsMap : [(Principal, [Campaign])] = [];
    // Maps related to dispensers
    private var dispensers = TrieMap.TrieMap<Text, Dispenser>(Text.equal, Text.hash);
    private stable var stableDispensers : [(Text, Dispenser)] = [];
    private var userDispensersMap = TrieMap.TrieMap<Principal, [Dispenser]>(Principal.equal, Principal.hash);
    private stable var stableUserDispensersMap : [(Principal, [Dispenser])] = [];
    private var userClaimedDispensers = TrieMap.TrieMap<Principal, [Text]>(Principal.equal, Principal.hash);
    private stable var stableuserClaimedDispensers : [(Principal, [Text])] = [];
    // Maps related to QR set
    private var qrSetMap = TrieMap.TrieMap<Text, QRSet>(Text.equal, Text.hash);
    private stable var stableQrSetMap : [(Text, QRSet)] = [];
    private var userQRSetMap = TrieMap.TrieMap<Principal, [QRSet]>(Principal.equal, Principal.hash);
    private stable var stableUserQrSetMap : [(Principal, [QRSet])] = [];
    // Map that stores QRsets and dispenser created on a Campaign
    private stable var qdcMap : [(Text, (Text, Text))] = [];
    // Token data Store
    func nat32Hash(value : Nat32) : Hash.Hash {
        let natValue = Nat32.toNat(value);
        return Hash.hash(natValue);
    };
    func natHash(value : Nat) : Hash.Hash {
        return Hash.hash(value);
    };
    private var tokensDataToBeMinted = TrieMap.TrieMap<Principal, [(Nat32, Metadata)]>(Principal.equal, Principal.hash);
    private stable var stableTokensDataToBeMinted : [(Principal, [(Nat32, Metadata)])] = [];
    private stable var nextTokenIndex : Nat32 = 0;
    // Campaign Timer
    private var campaignTimers = TrieMap.TrieMap<Text, Timer.TimerId>(Text.equal, Text.hash);
    private stable var stableCampaignTimers : [(Text, Timer.TimerId)] = [];
    // Dispenser Timer
    private var dispenserTimers = TrieMap.TrieMap<Text, Timer.TimerId>(Text.equal, Text.hash);
    private stable var stableDispenserTimers : [(Text, Timer.TimerId)] = [];

    // Stores details about the tokens coming into this vault
    private var depositItemsMap = TrieMap.TrieMap<Nat32, Deposit>(Nat32.equal, nat32Hash);
    private stable var stableDepositMap : [(Nat32, Deposit)] = [];
    // Payment recepient
    private stable var recepient : Principal = Principal.fromText("inerd-ot3e5-6uk35-zmytr-l64da-5r2jk-eqo6e-yds5d-nank5-z7vah-uqe");
    private stable var ledger_canister_id : Text = "ryjl3-tyaaa-aaaaa-aaaba-cai";
    private stable var registry_canister_id : Text = "bd3sg-teaaa-aaaaa-qaaba-cai";

    public shared ({ caller }) func getRecepient() : async Result.Result<Principal, Text> {
        if (not Principal.isController(caller)) {
            throw Error.reject("You cannot control this canister");
            return #err("You cannot control this canister");
        };
        return #ok(recepient);
    };

    public shared ({ caller }) func setRecepient(recepientPrincipal : Principal) : async Result.Result<Principal, Text> {
        if (not Principal.isController(caller)) {
            throw Error.reject("You cannot control this canister");
            return #err("You cannot control this canister");
        };
        recepient := recepientPrincipal;
        return #ok(recepient);
    };

    public shared ({ caller }) func setLedgerCanisterId(id : Text) : async () {
        if (not Principal.isController(caller)) {
            throw Error.reject("You cannot control this canister");
        };
        ledger_canister_id := id;
    };

    public shared ({ caller }) func setRegistryCanisterId(id : Text) : async () {
        if (not Principal.isController(caller)) {
            throw Error.reject("You cannot control this canister");
        };
        registry_canister_id := id;
    };

    public query func availableCycles() : async Nat {
        return Cycles.balance();
    };

    public shared ({ caller = user }) func resetStats() : async Result.Result<Text, Text> {
        if (not Principal.isController(user)) {
            throw Error.reject("You cannot control this canister");
            return #err("You cannot control this canister");
        };

        claimCount := 0;
        linksCount := 0;
        userClaimCount := [];
        userLinksCount := [];

        dailyLinksCreatedCount := 0;
        dailyLinksClaimedCount := 0;
        dailyUserLinksCreatedCount := [];
        dailyUserLinksClaimedCount := [];

        return #ok("Reset done");
    };

    public shared ({ caller }) func sendCyclesToCollection(collectionCanister : Principal, amount : Nat) : async Result.Result<Text, Text> {
        if (not Principal.isController(caller)) {
            throw Error.reject("You cannot control this canister");
            return #err("You cannot control this canister");
        };

        if (Cycles.balance() < amount) {
            return #err("Insufficient cycles balance in backend canister.");
        };

        let accepted = Cycles.add<system>(amount);

        if (accepted != amount) {
            return #err("Failed to transfer the specified amount of cycles.");
        };
        let collectionActor = actor (Principal.toText(collectionCanister)) : actor {
            acceptCycles : () -> async ();
        };
        await collectionActor.acceptCycles();
        return #ok("Cycles successfully transferred to collection canister.");
    };

    let LedgerCanister = actor (ledger_canister_id) : actor {
        account_balance : shared query BinaryAccountBalanceArgs -> async Tokens;
        // transfer : shared TransferArgs -> async Result_6;
        // send_dfx : shared SendArgs -> async Nat64;
        // account_balance_dfx : shared query AccountBalanceArgs -> async Tokens;
        icrc2_transfer_from : shared TransferFromArgs -> async Result_3;

    };

    let RegistryCanister = actor (registry_canister_id) : actor {
        add_canister : (caller : Principal, metadata : AddCanisterInput, trusted_source : ?Principal) -> async Result.Result<(), OperationError>;
    };

    func handleTransferError(error : TransferFromError) : Text {
        switch (error) {
            case (#GenericError(record)) {
                return "Generic error: " # record.message # " (code: " # Nat.toText(record.error_code) # ")";
            };
            case (#InsufficientAllowance(record)) {
                return "Insufficient allowance: " # Nat.toText(record.allowance);
            };
            case (#BadBurn(record)) {
                return "Bad burn amount, minimum required: " # Nat.toText(record.min_burn_amount);
            };
            case (#Duplicate(record)) {
                return "Duplicate transaction of: " # Nat.toText(record.duplicate_of);
            };
            case (#BadFee(record)) {
                return "Bad fee, expected fee: " # Nat.toText(record.expected_fee);
            };
            case (#CreatedInFuture(record)) {
                return "Transaction created in the future. Ledger time: " # Nat.toText(Nat64.toNat(record.ledger_time));
            };
            case (#TooOld) {
                return "Transaction is too old.";
            };
            case (#InsufficientFunds(record)) {
                return "Insufficient funds. Available balance: " # Nat.toText(record.balance);
            };
            case (#TemporarilyUnavailable) {
                return "The system is temporarily unavailable. Please try again later.";
            };
        };
    };

    public shared query func getDepositItem(key : Nat32) : async ?Deposit {
        return depositItemsMap.get(key);
    };

    // public shared query func getAlldepositItemsMap() : async [(Nat32, Deposit)] {
    //     var result : [(Nat32, Deposit)] = [];
    //     for ((key, value) in depositItemsMap.entries()) {
    //         result := Array.append([(key, value)], result);
    //     };
    //     return result;
    // };

    system func preupgrade() {
        stableuserCollectionMap := Iter.toArray(usersCollectionMap.entries());
        stableCampaigns := Iter.toArray(campaigns.entries());
        stableCampaignLinks := Iter.toArray(campaignLinks.entries());
        stableUserLinks := Iter.toArray(userLinks.entries());
        stableUserCampaignsMap := Iter.toArray(userCampaignsMap.entries());
        stableDispensers := Iter.toArray(dispensers.entries());
        stableuserClaimedDispensers := Iter.toArray(userClaimedDispensers.entries());
        stableUserDispensersMap := Iter.toArray(userDispensersMap.entries());
        stableQrSetMap := Iter.toArray(qrSetMap.entries());
        stableUserQrSetMap := Iter.toArray(userQRSetMap.entries());
        stableTokensDataToBeMinted := Iter.toArray(tokensDataToBeMinted.entries());
        stableCampaignTimers := Iter.toArray(campaignTimers.entries());
        stableDispenserTimers := Iter.toArray(dispenserTimers.entries());
        stableDepositMap := Iter.toArray(depositItemsMap.entries());
        stableClaimedTokensMap := Iter.toArray(claimedTokensMap.entries());
    };

    // Postupgrade function to restore the data from stable variables
    system func postupgrade() {
        usersCollectionMap := TrieMap.fromEntries(stableuserCollectionMap.vals(), Principal.equal, Principal.hash);
        campaigns := TrieMap.fromEntries(stableCampaigns.vals(), Text.equal, Text.hash);
        campaignLinks := TrieMap.fromEntries(stableCampaignLinks.vals(), Text.equal, Text.hash);
        userLinks := TrieMap.fromEntries(stableUserLinks.vals(), Principal.equal, Principal.hash);
        userCampaignsMap := TrieMap.fromEntries(stableUserCampaignsMap.vals(), Principal.equal, Principal.hash);
        dispensers := TrieMap.fromEntries(stableDispensers.vals(), Text.equal, Text.hash);
        userDispensersMap := TrieMap.fromEntries(stableUserDispensersMap.vals(), Principal.equal, Principal.hash);
        userClaimedDispensers := TrieMap.fromEntries(stableuserClaimedDispensers.vals(), Principal.equal, Principal.hash);
        qrSetMap := TrieMap.fromEntries(stableQrSetMap.vals(), Text.equal, Text.hash);
        userQRSetMap := TrieMap.fromEntries(stableUserQrSetMap.vals(), Principal.equal, Principal.hash);
        tokensDataToBeMinted := TrieMap.fromEntries(stableTokensDataToBeMinted.vals(), Principal.equal, Principal.hash);
        campaignTimers := TrieMap.fromEntries(stableCampaignTimers.vals(), Text.equal, Text.hash);
        dispenserTimers := TrieMap.fromEntries(stableDispenserTimers.vals(), Text.equal, Text.hash);
        depositItemsMap := TrieMap.fromEntries(stableDepositMap.vals(), Nat32.equal, nat32Hash);
        claimedTokensMap := TrieMap.fromEntries(stableClaimedTokensMap.vals(), Principal.equal, Principal.hash);
    };

    func generateKey(caller : AccountIdentifier, timestamp : Time.Time, _tokenId : TokenIndex) : Hash.Hash {
        let callerNat32 = AID.hash(caller);
        let timestampNat32 = Int.hash(timestamp);
        let tokenIdNat32 = _tokenId;
        let callerNat = Nat32.toNat(callerNat32);
        let timestampNat = Nat32.toNat(timestampNat32);
        let tokenIdNat = Nat32.toNat(tokenIdNat32);
        let largeModulus = 2 ** 128;
        let combinedNat = ((callerNat + timestampNat + tokenIdNat) % largeModulus);
        return Hash.hash(combinedNat); // Hash expects Nat32, so convert back

    };

    type DashboardStats = {
        totalLinks : Nat;
        claimedLinks : Nat;
        userLinksCount : Nat;
        userClaimCount : Nat;
        linksCoundToday : Nat;
        claimsCountToday : Nat;
        userLinksCoundToday : Nat;
        userClaimsCountToday : Nat;
        campaigns : ?[Campaign];
        qrSets : ?[QRSet];
        dispensers : ?[Dispenser];
    };

    func updateUserCountArray(countArray : [(Principal, Nat)], user : Principal) : [(Principal, Nat)] {
        var updatedArray : [(Principal, Nat)] = [];
        var userFound = false;

        for (userCount in countArray.vals()) {
            switch userCount {
                case ((p, count)) {
                    if (p == user) {
                        updatedArray := Array.append(updatedArray, [(p, count + 1)]);
                        userFound := true;
                    } else {
                        updatedArray := Array.append(updatedArray, [(p, count)]);
                    };
                };
            };
        };

        if (not userFound) {
            updatedArray := Array.append(updatedArray, [(user, 1)]);
        };

        return updatedArray;
    };

    func findUserCount(user : Principal, countArray : [(Principal, Nat)]) : Nat {
        let indexOpt = Array.find<(Principal, Nat)>(countArray, func((p : Principal, _ : Nat)) { p == user });
        switch (indexOpt) {
            case (?i) {
                let (_, count) = i;
                count;
            };
            case null {
                0;
            };
        };
    };

    // Helper function to reset the daily user stats
    func resetDailyUserCounts() {
        dailyUserLinksCreatedCount := [];
        dailyUserLinksClaimedCount := [];
    };

    // Function to reset daily stats at midnight
    func resetDailyStats() : async () {
        dailyLinksCreatedCount := 0;
        dailyLinksClaimedCount := 0;
        resetDailyUserCounts();
        // Schedule the next reset at midnight
        await setMidnightTimer();
    };

    // Function to set a timer for midnight to reset stats
    func setMidnightTimer<system>() : async () {
        let now = Time.now();
        let secondsUntilMidnight = getSecondsUntilMidnight(now);
        let nanosecondsUntilMidnight = secondsUntilMidnight * 1_000_000_000;
        // Schedule a timer to trigger resetDailyStats at the next midnight
        let id = Timer.setTimer<system>(
            #nanoseconds nanosecondsUntilMidnight,
            func() : async () {
                await resetDailyStats();
            },
        );
    };

    // Function to calculate how many seconds until midnight
    func getSecondsUntilMidnight(currentTime : Time.Time) : Nat {
        let secondsInDay : Nat = 24 * 60 * 60;
        let currentTimeOfDay = Nat64.toNat(Nat64.fromIntWrap(currentTime % secondsInDay));
        return secondsInDay - currentTimeOfDay;
    };

    public shared func initStatTimer() : async () {
        await setMidnightTimer();
    };

    public shared ({ caller = user }) func dashboardDetails() : async DashboardStats {
        if (Principal.isAnonymous(user)) {
            throw Error.reject("Anonymous principals are not allowed.");
        };

        let campaigns = userCampaignsMap.get(user);
        let qrSets = userQRSetMap.get(user);
        let dispensers = userDispensersMap.get(user);

        let userLinks = findUserCount(user, userLinksCount);
        let userClaims = findUserCount(user, userClaimCount);
        let dailyUserLinks = findUserCount(user, dailyUserLinksCreatedCount);
        let dailyUserClaims = findUserCount(user, dailyUserLinksClaimedCount);

        return {
            totalLinks = linksCount;
            claimedLinks = claimCount;
            userLinksCount = userLinks;
            userClaimCount = userClaims;
            linksCoundToday = dailyLinksCreatedCount;
            claimsCountToday = dailyLinksClaimedCount;
            userLinksCoundToday = dailyUserLinks;
            userClaimsCountToday = dailyUserClaims;
            campaigns = campaigns;
            qrSets = qrSets;
            dispensers = dispensers;
        };
    };

    // func knowAdmin(caller : Principal) : async Bool{
    //     let extToken = await ExtTokenClass.EXTNFT(caller);
    //     extToken._isAdmin(caller);
    // };

    public shared ({ caller = user }) func addCollectionToUserMap(collection_id : Principal) : async Text {
        if (Principal.isAnonymous(user)) {
            throw Error.reject("Anonymous principals are not allowed.");
        };
        let userCollections = usersCollectionMap.get(user);
        let currentTime = Time.now();
        switch (userCollections) {
            case null {
                // No collections exist, create a new list with the current collection
                let newCollections : [(Time.Time, Principal)] = [(currentTime, collection_id)];
                usersCollectionMap.put(user, newCollections);
                return "Collection added";
            };
            case (?collections) {
                // Check if the collection already exists
                let collectionExists = List.some<(Time.Time, Principal)>(
                    List.fromArray(collections),
                    func x { x.1 == collection_id },
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

    public shared ({ caller = user }) func removeCollectionFromUserMap(collection_id : Principal) : async Text {
        if (Principal.isAnonymous(user)) {
            throw Error.reject("Anonymous principals are not allowed.");
        };
        let userCollections = usersCollectionMap.get(user);
        switch (userCollections) {
            case null {
                return "There are no collections added yet!";
            };
            case (?collections) {
                // Filter out the collection to remove
                let updatedCollections = List.filter<(Time.Time, Principal)>(
                    List.fromArray(collections),
                    func x { x.1 != collection_id },
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

    // // Collection creation
    // private shared ({ caller = user }) func createExtCollection(_title : Text, _symbol : Text, _metadata : Text) : async (Principal, Principal) {
    //     // if (Principal.isAnonymous(user)) {
    //     //     throw Error.reject("Anonymous principals are not allowed.");
    //     // };
    //     Cycles.add<system>(500_000_000_000);
    //     let extToken = await ExtTokenClass.EXTNFT(Principal.fromActor(Main));
    //     let extCollectionCanisterId = await extToken.getCanisterId();
    //     let collectionCanisterActor = actor (Principal.toText(extCollectionCanisterId)) : actor {
    //         ext_setCollectionMetadata : (
    //             name : Text,
    //             symbol : Text,
    //             metadata : Text,
    //         ) -> async ();
    //         setMinter : (minter : Principal) -> async ();
    //         ext_admin : () -> async Principal;
    //     };
    //     await collectionCanisterActor.setMinter(user);
    //     await collectionCanisterActor.ext_setCollectionMetadata(_title, _symbol, _metadata);
    //     // Updating the userCollectionMap
    //     let collections = usersCollectionMap.get(user);
    //     let buffer = Buffer.fromArray<Principal>(allCollections);
    //     buffer.add(extCollectionCanisterId);
    //     allCollections := Buffer.toArray(buffer);
    //     let canisterMetadata : CanisterMetadata = {
    //         name = _title;
    //         description = _symbol; // Assuming metadata holds the description
    //         thumbnail = _metadata; // Set a thumbnail if you have one
    //         frontend = null; // Set frontend if applicable
    //         principal_id = extCollectionCanisterId;
    //         submitter = user; // The user creating the collection
    //         last_updated_by = user;
    //         last_updated_at = Time.now();
    //         details = []; // You can add more details if needed
    //     };

    //     let addResult = await RegistryCanister.add_canister(user, canisterMetadata, null);
    //     switch (addResult) {
    //         case (#ok(())) {
    //             switch (collections) {
    //                 case null {
    //                     let updatedCollections = [(Time.now(), extCollectionCanisterId)];
    //                     usersCollectionMap.put(user, updatedCollections);
    //                     return (user, extCollectionCanisterId);
    //                 };
    //                 case (?collections) {
    //                     let updatedObj = Array.append(collections, [(Time.now(), extCollectionCanisterId)]);
    //                     usersCollectionMap.put(user, updatedObj);
    //                     return (user, extCollectionCanisterId);
    //                 };
    //             };
    //         };
    //         case (#err(errType)) {
    //             // Handle different error types
    //             let errorMessage : Text = switch (errType) {
    //                 case (#BadParameters) { "Bad parameters provided." };
    //                 case (#NonExistentItem) {
    //                     "The specified item does not exist.";
    //                 };
    //                 case (#NotAuthorized) {
    //                     "Not authorized to perform this action.";
    //                 };
    //                 case (#Unknown(error)) {
    //                     "Unknown error occurred: " # error;
    //                 };
    //             };
    //             throw Error.reject("Failed to add canister to registry: " # errorMessage);
    //         };
    //     };

    // };

    // Collection creation
    public shared ({ caller = user }) func createExtCollection(_title : Text, _symbol : Text, _metadata : Text, amount : Nat) : async Result.Result<(Principal, Principal), Text> {
        if (Principal.isAnonymous(user)) {
            throw Error.reject("Anonymous principals are not allowed.");
        };
        let availablecycles : Nat = await availableCycles();
        if (availablecycles < 900_000_000_000) {
            throw Error.reject("Canister doesnt have enough cycles");
        };
        let fromAccount : Account = {
            owner = user;
            subaccount = null;
        };

        let toAccount : Account = {
            owner = recepient;
            subaccount = null;
        };
        let balanceCheck = Principal.toLedgerAccount(user, null);
        let balanceResult = await LedgerCanister.account_balance({
            account = balanceCheck;
        });
        Debug.print(
            "Transferring "
            # " balance "
            # debug_show (balanceResult)
        );
        if (Nat64.toNat(balanceResult.e8s) < amount) {
            throw Error.reject("Insufficient balance to create collection. Please ensure you have enough ICP.");
        };
        let transferArgs : TransferFromArgs = {
            to = toAccount;
            fee = null;
            spender_subaccount = null;
            from = fromAccount;
            memo = null;
            created_at_time = null;
            amount = amount;
        };
        let transferResponse = await LedgerCanister.icrc2_transfer_from(transferArgs);
        switch (transferResponse) {
            case (#Ok(nat)) {
                if (Principal.isAnonymous(user)) {
                    throw Error.reject("Anonymous principals are not allowed.");
                };
                Cycles.add<system>(900_000_000_000);
                let extToken = await ExtTokenClass.EXTNFT(Principal.fromActor(Main));
                let extCollectionCanisterId = await extToken.getCanisterId();
                let collectionCanisterActor = actor (Principal.toText(extCollectionCanisterId)) : actor {
                    ext_setCollectionMetadata : (
                        name : Text,
                        symbol : Text,
                        metadata : Text,
                    ) -> async ();
                    setMinter : (minter : Principal) -> async ();
                    ext_admin : () -> async Principal;
                };
                await collectionCanisterActor.setMinter(user);
                await collectionCanisterActor.ext_setCollectionMetadata(_title, _symbol, _metadata);
                // Updating the userCollectionMap
                let collections = usersCollectionMap.get(user);
                let buffer = Buffer.fromArray<Principal>(allCollections);
                buffer.add(extCollectionCanisterId);
                allCollections := Buffer.toArray(buffer);
                let canisterMetadata : CanisterMetadata = {
                    name = _title;
                    description = _symbol;
                    thumbnail = _metadata;
                    frontend = null;
                    principal_id = extCollectionCanisterId;
                    submitter = user;
                    last_updated_by = user;
                    last_updated_at = Time.now();
                    details = [];
                };

                let addResult = await RegistryCanister.add_canister(user, canisterMetadata, null);
                switch (addResult) {
                    case (#ok(())) {
                        switch (collections) {
                            case null {
                                let updatedCollections = [(Time.now(), extCollectionCanisterId)];
                                usersCollectionMap.put(user, updatedCollections);
                                return #ok(user, extCollectionCanisterId);
                            };
                            case (?collections) {
                                let updatedObj = Array.append(collections, [(Time.now(), extCollectionCanisterId)]);
                                usersCollectionMap.put(user, updatedObj);
                                return #ok(user, extCollectionCanisterId);
                            };
                        };
                    };
                    case (#err(errType)) {
                        // Handle different error types
                        let errorMessage : Text = switch (errType) {
                            case (#BadParameters) { "Bad parameters provided." };
                            case (#NonExistentItem) {
                                "The specified item does not exist.";
                            };
                            case (#NotAuthorized) {
                                "Not authorized to perform this action.";
                            };
                            case (#Unknown(error)) {
                                "Unknown error occurred: " # error;
                            };
                        };
                        throw Error.reject("Failed to add canister to registry: " # errorMessage);
                    };
                };
            };
            case (#Err(error)) {
                throw Error.reject(debug_show ("Transfer Error", error));
                return #err(handleTransferError(error));
            };
        };

    };

    private stable var origyn_nft_wasm : Blob = Blob.fromArray([]);
    private stable var expected_wasm_hash: Nat32 = 0;
    private stable var wasm_upload_in_progress : Bool = false;
    private stable var expected_chunks : Nat = 0;
    private stable var received_chunks : Nat = 0;

    public shared ({ caller }) func startWasmUpload(total_chunks : Nat, expected_hash : Nat32) : async () {
        if (not Principal.isController(caller)) {
            throw Error.reject("You cannot control this canister");
        };
        wasm_upload_in_progress := true;
        expected_chunks := total_chunks;
        received_chunks := 0;
        expected_wasm_hash := expected_hash;
        origyn_nft_wasm := Blob.fromArray([]);
    };

    public shared ({ caller }) func uploadWasmChunk(chunk_index : Nat, chunk : Blob) : async () {
        if (not Principal.isController(caller)) {
            throw Error.reject("You cannot control this canister");
        };
        if (not wasm_upload_in_progress) {
            throw Error.reject("No WASM upload in progress");
        };
        if (chunk_index >= expected_chunks) {
            throw Error.reject("Chunk index out of bounds");
        };
                
        origyn_nft_wasm := Blob.fromArray(Array.append(Blob.toArray(origyn_nft_wasm), Blob.toArray(chunk)));

        received_chunks := received_chunks + 1;
    };

    public shared ({ caller }) func completeWasmUpload() : async Result.Result<(), Text> {
        if (not Principal.isController(caller)) {
            return #err("You cannot control this canister");
        };
        if (not wasm_upload_in_progress) {
            return #err("No WASM upload in progress");
        };
        if (received_chunks != expected_chunks) {
            return #err("Not all chunks received");
        };
        
        let actual_hash = Blob.hash(origyn_nft_wasm);
        
        Debug.print("WASM hash verification - Expected: " # Nat32.toText(expected_wasm_hash) # ", Actual: " # Nat32.toText(actual_hash));
        
        if (actual_hash != expected_wasm_hash) {
            return #err("WASM hash verification failed. Expected: " # Nat32.toText(expected_wasm_hash) # ", Got: " # Nat32.toText(actual_hash));
        };
        
        wasm_upload_in_progress := false;
        expected_chunks := 0;
        received_chunks := 0;
        expected_wasm_hash := 0;
        
        #ok(());
    };

    public query func getWasmUploadProgress() : async { in_progress : Bool; received : Nat; expected : Nat } {
        { in_progress = wasm_upload_in_progress; received = received_chunks; expected = expected_chunks };
    };
    
    public shared ({ caller }) func setOrigynNFTWasm(wasm : Blob) : async () {
        if (not Principal.isController(caller)) {
            throw Error.reject("You cannot control this canister");
        };
        origyn_nft_wasm := wasm;
    };

    public query func isOrigynNFTWasmSet() : async Bool {
        origyn_nft_wasm.size() > 0;
    };

    public shared ({ caller = user }) func createOrigynCollection(
        _title : Text,
        _symbol : Text,
        _metadata : Text
    ) : async Result.Result<(Principal, Principal), Text> {
        if (Principal.isAnonymous(user)) {
            throw Error.reject("Anonymous principals are not allowed.");
        };
        
        let availablecycles : Nat = await availableCycles();
        if (availablecycles < 900_000_000_000) {
            throw Error.reject("Canister doesnt have enough cycles");
        };
        
        Cycles.add<system>(900_000_000_000);
        
        // Helpful: https://github.com/dfinity/portal/blob/master/docs/references/_attachments/ic.did
        let ic = actor("aaaaa-aa") : IC.Service;
        
        let canister_result = await ic.create_canister({ settings = null; sender_canister_version = null });
        let origynCollectionCanisterId = canister_result.canister_id;
        
        Debug.print("Created ORIGYN collection canister with ID: " # Principal.toText(origynCollectionCanisterId));
        
        
        if (origyn_nft_wasm.size() == 0) {
            throw Error.reject("ORIGYN NFT WASM not set. Please contact administrator.");
        };

        let initArgs : OrigynNFTInterface.InitArgs = {
            permissions = {
                user_permissions = [(user, [
                    #UpdateMetadata,
                    #Minting,
                    #UpdateCollectionMetadata,
                    #UpdateUploads,
                    #ManageAuthorities,
                    #ReadUploads
                ])];
            };
            supply_cap = null;
            tx_window = null;
            test_mode = false;
            default_take_value = null;
            max_canister_storage_threshold = null;
            logo = null;
            permitted_drift = null;
            name = _title;
            description = null;
            version = { major = 1; minor = 0; patch = 0 };
            max_take_value = null;
            max_update_batch_size = null;
            max_query_batch_size = null;
            commit_hash = "initial";
            max_memo_size = null;
            atomic_batch_transfers = null;
            collection_metadata = [];
            symbol = _symbol;
            approval_init = {
                max_approvals_per_token_or_collection = null;
                max_revoke_approvals = null;
            };
        };

        await ic.install_code({
            arg = Blob.fromArray([]);
            wasm_module = origyn_nft_wasm;
            mode = #install;
            canister_id = origynCollectionCanisterId;
            sender_canister_version = null;
        });
        
        // TODO: Remove this, just a placeholder for now
        let collectionCanisterActor : OrigynNFTInterface.OrigynNFTCanister = actor (Principal.toText(origynCollectionCanisterId));
        
        let updateResult = await collectionCanisterActor.update_collection_metadata({
            name = ?_title;
            symbol = ?_symbol;
            description = ?_metadata;
            supply_cap = null;
            tx_window = null;
            default_take_value = null;
            max_canister_storage_threshold = null;
            logo = null;
            permitted_drift = null;
            max_take_value = null;
            max_update_batch_size = null;
            max_query_batch_size = null;
            max_memo_size = null;
            atomic_batch_transfers = null;
            collection_metadata = null;
        });
        
        switch (updateResult) {
            case (#ok(())) {
                Debug.print("Collection metadata updated successfully");
            };
            case (#err(#StorageCanisterError(message))) {
                Debug.print("Storage error updating metadata: " # message);
            };
            case (#err(#ConcurrentManagementCall)) {
                Debug.print("Concurrent management call error");
            };
        };
        
        let collections = usersCollectionMap.get(user);
        let buffer = Buffer.fromArray<Principal>(allCollections);
        buffer.add(origynCollectionCanisterId);
        allCollections := Buffer.toArray(buffer);
        
        let canisterMetadata : CanisterMetadata = {
            name = _title;
            description = _symbol;
            thumbnail = _metadata;
            frontend = null;
            principal_id = origynCollectionCanisterId;
            submitter = user;
            last_updated_by = user;
            last_updated_at = Time.now();
            details = [];
        };

        let addResult = await RegistryCanister.add_canister(user, canisterMetadata, null);
        switch (addResult) {
            case (#ok(())) {
                switch (collections) {
                    case null {
                        let updatedCollections = [(Time.now(), origynCollectionCanisterId)];
                        usersCollectionMap.put(user, updatedCollections);
                        return #ok(user, origynCollectionCanisterId);
                    };
                    case (?collections) {
                        let updatedObj = Array.append(collections, [(Time.now(), origynCollectionCanisterId)]);
                        usersCollectionMap.put(user, updatedObj);
                        return #ok(user, origynCollectionCanisterId);
                    };
                };
            };
            case (#err(errType)) {
                let errorMessage : Text = switch (errType) {
                    case (#BadParameters) { "Bad parameters provided." };
                    case (#NonExistentItem) {
                        "The specified item does not exist.";
                    };
                    case (#NotAuthorized) {
                        "Not authorized to perform this action.";
                    };
                    case (#Unknown(error)) {
                        "Unknown error occurred: " # error;
                    };
                };
                throw Error.reject("Failed to add canister to registry: " # errorMessage);
            };
        };
    };

    // Getting Collection Metadata
    public shared ({ caller = user }) func getUserCollectionDetails() : async ?[(Time.Time, Principal, Text, Text, Text)] {
        let collections = usersCollectionMap.get(user);

        switch (collections) {
            case (null) {
                return null;
            };
            case (?collections) {
                var result : List.List<(Time.Time, Principal, Text, Text, Text)> = List.nil();

                for ((timestamp, collectionCanisterId) in collections.vals()) {
                    let collectionCanister = actor (Principal.toText(collectionCanisterId)) : actor {
                        getCollectionDetails : () -> async (Text, Text, Text);
                    };

                    let details = await collectionCanister.getCollectionDetails();
                    result := List.push((timestamp, collectionCanisterId, details.0, details.1, details.2), result);
                };

                let finalResult = List.toArray(List.reverse(result));
                return ?finalResult;
            };
        };
    };

    public shared ({ caller = user }) func getUserCollectionNames() : async ?[(Principal, Text)] {
        let collections = usersCollectionMap.get(user);

        switch (collections) {
            case (null) {
                return null;
            };
            case (?collections) {
                var result : List.List<(Principal, Text)> = List.nil();
                let newestFirst = Array.reverse(collections);
                for ((timestamp, collectionCanisterId) in newestFirst.vals()) {
                    let collectionCanister = actor (Principal.toText(collectionCanisterId)) : actor {
                        getCollectionDetails : () -> async (Text, Text, Text);
                    };

                    let details = await collectionCanister.getCollectionDetails();
                    result := List.push((collectionCanisterId, details.0), result);
                };

                let finalResult = List.toArray(List.reverse(result));
                return ?finalResult;
            };
        };
    };

    public shared ({ caller = user }) func getUserCollectionDetailsPaginate(
        page : Nat,
        pageSize : Nat,
    ) : async {
        data : [(Time.Time, Principal, Text, Text, Text)];
        current_page : Nat;
        total_pages : Nat;
    } {
        let collections = usersCollectionMap.get(user);

        switch (collections) {
            case (null) {
                return {
                    data = [];
                    current_page = 0;
                    total_pages = 0;
                };
            };
            case (?collections) {
                let newestFirst = Array.reverse(collections);
                let totalCollections = collections.size();
                let totalPages = if (totalCollections % pageSize == 0) {
                    totalCollections / pageSize;
                } else {
                    (totalCollections / pageSize) + 1;
                };

                let startIndex = page * pageSize;
                if (startIndex >= totalCollections) {
                    return {
                        data = [];
                        current_page = page + 1;
                        total_pages = totalPages;
                    };
                };
                let endIndex = Nat.min(totalCollections, startIndex + pageSize);

                var resultList : List.List<(Time.Time, Principal, Text, Text, Text)> = List.nil();
                var currentIndex : Nat = 0;
                for ((timestamp, collectionCanisterId) in newestFirst.vals()) {
                    if (currentIndex >= startIndex and currentIndex < endIndex) {
                        let collectionCanister = actor (Principal.toText(collectionCanisterId)) : actor {
                            getCollectionDetails : () -> async (Text, Text, Text);
                        };
                        let details = await collectionCanister.getCollectionDetails();
                        resultList := List.push((timestamp, collectionCanisterId, details.0, details.1, details.2), resultList);
                    };
                    currentIndex += 1;
                };

                let res = List.toArray(List.reverse(resultList));

                return {
                    data = res;
                    current_page = page + 1;
                    total_pages = totalPages;
                };
            };
        };
    };

    // Getting Collections that user own(only gets canisterIds of respective collections)
    public shared query ({ caller = user }) func getUserCollections() : async ?[(Time.Time, Principal)] {
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
    public shared ({ caller = user }) func mintExtNonFungible(
        _collectionCanisterId : Principal,
        name : Text,
        desc : Text,
        asset : Text,
        thumb : Text,
        metadata : ?MetadataContainer,
        amount : Nat

    ) : async [TokenIndex] {

        if (Principal.isAnonymous(user)) {
            throw Error.reject("Anonymous principals are not allowed.");
        };

        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
            ext_mint : (
                request : [(AccountIdentifier, Metadata)]
            ) -> async [TokenIndex];
        };
        let metadataNonFungible : Metadata = #nonfungible {
            name = name;
            description = desc;
            asset = asset;
            thumbnail = thumb;
            metadata = metadata;
        };

        let receiver = AID.fromPrincipal(user, null);
        var request : [(AccountIdentifier, Metadata)] = [];
        var i : Nat = 0;
        while (i < amount) {
            request := Array.append(request, [(receiver, metadataNonFungible)]);
            i := i + 1;
        };
        let extMint = await collectionCanisterActor.ext_mint(request);
        extMint;
    };

    // Minting  a Fungible token pass the collection canisterId in which you want to mint and the required details to add, this enables minting multiple tokens
    public shared ({ caller = user }) func mintExtFungible(
        _collectionCanisterId : Principal,
        name : Text,
        symbol : Text,
        decimals : Nat8,
        metadata : ?MetadataContainer,
        amount : Nat

    ) : async [TokenIndex] {

        if (Principal.isAnonymous(user)) {
            throw Error.reject("Anonymous principals are not allowed.");
        };

        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
            ext_mint : (
                request : [(AccountIdentifier, Metadata)]
            ) -> async [TokenIndex];
        };
        let metadataFungible : Metadata = #fungible {
            name = name;
            symbol = symbol;
            decimals = decimals;
            metadata = metadata;
        };

        let receiver = AID.fromPrincipal(user, null);
        var request : [(AccountIdentifier, Metadata)] = [];
        var i : Nat = 0;
        while (i < amount) {
            request := Array.append(request, [(receiver, metadataFungible)]);
            i := i + 1;
        };
        let extMint = await collectionCanisterActor.ext_mint(request);
        extMint;
    };

    // Stores the data of token now but mints it later at the time of claiming, gives you details to be added in Link
    public shared ({ caller = user }) func storeTokendetails(
        _collectionCanisterId : Principal,
        name : Text,
        desc : Text,
        asset : Text,
        thumb : Text,
        metadata : ?MetadataContainer,
        amount : Nat,
    ) : async [Nat32] {
        if (Principal.isAnonymous(user)) {
            throw Error.reject("Anonymous principals are not allowed.");
        };
        let metadataNonFungible : Metadata = #nonfungible {
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
                let currentTokens = switch (tokensDataToBeMinted.get(_collectionCanisterId)) {
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
            };
        };

        return nextTokenIds;
    };

    public shared func getStoredTokens(
        _collectionCanisterId : Principal
    ) : async ?[(Nat32, Metadata)] {
        tokensDataToBeMinted.get(_collectionCanisterId);
    };

    public shared func getStoredTokenByTokenIndex(
        _collectionCanisterId : Principal,
        tokenIndex : Nat32,
    ) : async ?Metadata {
        let storedTokens = tokensDataToBeMinted.get(_collectionCanisterId);
        switch (storedTokens) {
            case (?tokens) {
                switch (
                    Array.find(
                        tokens,
                        func(token : (Nat32, Metadata)) : Bool {
                            token.0 == tokenIndex;
                        },
                    )
                ) {
                    case (?(_, metadata)) ?metadata;
                    case null null;
                };
            };
            case null null;
        };
    };

    public shared func getStoredTokensPaginate(
        _collectionCanisterId : Principal,
        page : Nat,
        pageSize : Nat,
    ) : async {
        data : [(Nat32, Metadata)];
        current_page : Nat;
        total_pages : Nat;
    } {

        switch (tokensDataToBeMinted.get(_collectionCanisterId)) {
            case (?tokensArray) {
                let totalItems = tokensArray.size();
                let totalPages = if (totalItems % pageSize == 0) {
                    totalItems / pageSize;
                } else {
                    (totalItems / pageSize) + 1;
                };

                let startIndex = page * pageSize;
                if (startIndex >= totalItems) {
                    return {
                        data = [];
                        current_page = page + 1;
                        total_pages = totalPages;
                    };
                };
                let endIndex = Nat.min(totalItems, startIndex + pageSize);
                var resultTokens : List.List<(Nat32, Metadata)> = List.nil();
                var currentIndex : Nat = 0;
                for (token in tokensArray.vals()) {
                    if (currentIndex >= startIndex and currentIndex < endIndex) {
                        resultTokens := List.push(token, resultTokens);
                    };
                    currentIndex += 1;
                };

                let resultArray = List.toArray(List.reverse(resultTokens));

                return {
                    data = resultArray;
                    current_page = page + 1;
                    total_pages = totalPages;
                };
            };
            case null {
                return { data = []; current_page = 0; total_pages = 0 };
            };
        };
    };

    // Get Fungible token details for specific collection
    public shared ({ caller = user }) func getFungibleTokens(
        _collectionCanisterId : Principal
    ) : async [(TokenIndex, AccountIdentifier, Metadata)] {
        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
            getAllFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Metadata)];
        };
        let userAID = AID.fromPrincipal(user, null);
        let allTokens = await collectionCanisterActor.getAllFungibleTokenData();
        let userTokens : [(TokenIndex, AccountIdentifier, Metadata)] = Array.filter(
            allTokens,
            func(tokenData : (TokenIndex, AccountIdentifier, Metadata)) : Bool {
                let (tokenIndex, owner, metadata) = tokenData;
                owner == userAID;
            },
        );
        return userTokens;
    };

    // Get NFT details for specific collection
    public shared ({ caller = user }) func getNonFungibleTokens(
        _collectionCanisterId : Principal
    ) : async {
        data : [(TokenIndex, AccountIdentifier, Metadata)];
    } {
        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
            tokens : (AccountIdentifier) -> async Result.Result<[TokenIndex], CommonError>;
            tokenMetadata : (TokenIdentifier) -> async Result.Result<Metadata, CommonError>;
        };

        let userAID = AID.fromPrincipal(user, null);

        let tokenIndicesResult = await collectionCanisterActor.tokens(userAID);

        let tokenIndices = switch tokenIndicesResult {
            case (#ok(indices)) indices;
            case (#err(_)) return {
                data = [];
            };
        };

        var nonFungibleTokens : [(TokenIndex, AccountIdentifier, Metadata)] = [];

        for (tokenIndex in tokenIndices.vals()) {
            let tokenId = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, tokenIndex);
            let metadataResult = await collectionCanisterActor.tokenMetadata(tokenId);
            switch metadataResult {
                case (#ok(metadata)) {
                    // Only include non-fungible tokens
                    switch (metadata) {
                        case (#nonfungible(_)) {
                            nonFungibleTokens := Array.append(nonFungibleTokens, [(tokenIndex, userAID, metadata)]);
                        };
                        case (#fungible(_)) {
                            // Skip fungible tokens
                        };
                    };
                };
                case (#err(_)) {
                    // Optionally handle metadata fetch errors for specific tokens
                };
            };
        };

        return {
            data = nonFungibleTokens;
        };
    };

    // Get NFT details for specific collection
    public shared func getNonFungibleTokensByUserPrincipal(
        user : Principal,
        _collectionCanisterId : Principal,
    ) : async {
        data : [(TokenIndex, AccountIdentifier, Metadata)];
    } {
        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
            tokens : (AccountIdentifier) -> async Result.Result<[TokenIndex], CommonError>;
            tokenMetadata : (TokenIdentifier) -> async Result.Result<Metadata, CommonError>;
        };

        let userAID = AID.fromPrincipal(user, null);

        let tokenIndicesResult = await collectionCanisterActor.tokens(userAID);

        let tokenIndices = switch tokenIndicesResult {
            case (#ok(indices)) indices;
            case (#err(_)) return {
                data = [];
            };
        };

        var nonFungibleTokens : [(TokenIndex, AccountIdentifier, Metadata)] = [];

        for (tokenIndex in tokenIndices.vals()) {
            let tokenId = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, tokenIndex);
            let metadataResult = await collectionCanisterActor.tokenMetadata(tokenId);
            switch metadataResult {
                case (#ok(metadata)) {
                    // Only include non-fungible tokens
                    switch (metadata) {
                        case (#nonfungible(_)) {
                            nonFungibleTokens := Array.append(nonFungibleTokens, [(tokenIndex, userAID, metadata)]);
                        };
                        case (#fungible(_)) {
                            // Skip fungible tokens
                        };
                    };
                };
                case (#err(_)) {
                    // Optionally handle metadata fetch errors for specific tokens
                };
            };
        };

        return {
            data = nonFungibleTokens;
        };
    };

    // Get NFT details for specific collection
    // public shared ({ caller = user }) func getNonFungibleTokensPaginate(
    //     _collectionCanisterId : Principal,
    //     page : Nat,
    //     pageSize : Nat,
    // ) : async {
    //     data : [(TokenIndex, AccountIdentifier, Metadata)];
    //     current_page : Nat;
    //     total_pages : Nat;
    // } {
    //     let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
    //         getAllNonFungibleTokenData : () -> async [(TokenIndex, AccountIdentifier, Metadata)];
    //     };

    //     let allTokens = await collectionCanisterActor.getAllNonFungibleTokenData();
    //     let userAID = AID.fromPrincipal(user, null);
    //     // Filter tokens by owner
    //     let userTokens : [(TokenIndex, AccountIdentifier, Metadata)] = Array.filter(
    //         allTokens,
    //         func(tokenData : (TokenIndex, AccountIdentifier, Metadata)) : Bool {
    //             let (tokenIndex, owner, metadata) = tokenData;
    //             owner == userAID;
    //         },
    //     );
    //     let totalItems = userTokens.size();
    //     let totalPages = if (totalItems % pageSize == 0) {
    //         totalItems / pageSize;
    //     } else {
    //         (totalItems / pageSize) + 1;
    //     };

    //     let startIndex = page * pageSize;
    //     if (startIndex >= totalItems) {
    //         return {
    //             data = [];
    //             current_page = page + 1;
    //             total_pages = totalPages;
    //         };
    //     };
    //     let endIndex = Nat.min(totalItems, startIndex + pageSize);

    //     var paginatedTokens : List.List<(TokenIndex, AccountIdentifier, Metadata)> = List.nil();
    //     var currentIndex : Nat = 0;
    //     for (token in userTokens.vals()) {
    //         if (currentIndex >= startIndex and currentIndex < endIndex) {
    //             paginatedTokens := List.push(token, paginatedTokens);
    //         };
    //         currentIndex += 1;
    //     };

    //     let paginatedTokensArray = List.toArray(List.reverse(paginatedTokens));

    //     return {
    //         data = paginatedTokensArray;
    //         current_page = page + 1;
    //         total_pages = totalPages;
    //     };
    // };

    public shared ({ caller = user }) func getNonFungibleTokensPaginate(
        _collectionCanisterId : Principal,
        page : Nat,
        pageSize : Nat,
    ) : async {
        data : [(TokenIndex, AccountIdentifier, Metadata)];
        current_page : Nat;
        total_pages : Nat;
    } {
        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
            tokens : (AccountIdentifier) -> async Result.Result<[TokenIndex], CommonError>;
            tokenMetadata : (TokenIdentifier) -> async Result.Result<Metadata, CommonError>;
        };

        let userAID = AID.fromPrincipal(user, null);

        // Get the list of token indices for the user
        let tokenIndicesResult = await collectionCanisterActor.tokens(userAID);

        let tokenIndices = switch tokenIndicesResult {
            case (#ok(indices)) indices;
            case (#err(_)) return {
                data = [];
                current_page = page + 1;
                total_pages = 0;
            };
        };

        let totalItems = tokenIndices.size();
        let totalPages = if (totalItems % pageSize == 0) {
            totalItems / pageSize;
        } else {
            (totalItems / pageSize) + 1;
        };

        let startIndex = page * pageSize;
        if (startIndex >= totalItems) {
            return {
                data = [];
                current_page = page + 1;
                total_pages = totalPages;
            };
        };

        let endIndex = Nat.min(totalItems, startIndex + pageSize);

        var paginatedTokens : [(TokenIndex, AccountIdentifier, Metadata)] = [];
        var currentIndex : Nat = 0;

        // Iterate over token indices and fetch metadata for the paginated range
        for (tokenIndex in tokenIndices.vals()) {
            if (currentIndex >= startIndex and currentIndex < endIndex) {
                let tokenId = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, tokenIndex);
                let metadataResult = await collectionCanisterActor.tokenMetadata(tokenId);
                switch metadataResult {
                    case (#ok(metadata)) {
                        // Only include non-fungible tokens
                        switch (metadata) {
                            case (#nonfungible(_)) {
                                paginatedTokens := Array.append(paginatedTokens, [(tokenIndex, userAID, metadata)]);
                            };
                            case (#fungible(_)) {
                                // Skip fungible tokens
                            };
                        };
                    };
                    case (#err(_)) {
                        // Optionally handle metadata fetch errors for specific tokens
                    };
                };
            };
            currentIndex += 1;
        };

        return {
            data = paginatedTokens;
            current_page = page + 1;
            total_pages = totalPages;
        };
    };

    public shared ({ caller = user }) func getUserTokensFromAllCollections() : async [(Principal, Text, Nat)] {
        var resultArray = Buffer.Buffer<(Principal, Text, Nat)>(0);

        let userClaims : ?[(Principal, Nat)] = claimedTokensMap.get(user);

        switch (userClaims) {
            case null {
                return [];
            };
            case (?claimedCollectionData) {
                for ((collectionCanisterId, tokenCount) in claimedCollectionData.vals()) {
                    let collectionCanisterActor = actor (Principal.toText(collectionCanisterId)) : actor {
                        getCollectionDetails : () -> async (Text, Text, Text);
                    };
                    let collectionDetailsResult = await collectionCanisterActor.getCollectionDetails();
                    let collectionTitle = collectionDetailsResult.0;
                    resultArray.add((collectionCanisterId, collectionTitle, tokenCount));
                };
            };
        };

        return Buffer.toArray(resultArray);
    };

    public shared ({ caller = user }) func getUserTokensFromAllCollectionsPaginate(
        page : Nat,
        pageSize : Nat,
    ) : async {
        data : [(Principal, Text, Nat)];
        current_page : Nat;
        total_pages : Nat;
    } {
        var resultArray = Buffer.Buffer<(Principal, Text, Nat)>(0);
        let userClaims : ?[(Principal, Nat)] = claimedTokensMap.get(user);

        switch (userClaims) {
            case null {
                return { data = []; current_page = 0; total_pages = 0 };
            };
            case (?claimedCollectionData) {
                let totalItems = claimedCollectionData.size();

                // Calculate total pages
                let totalPages = if (totalItems % pageSize == 0) {
                    totalItems / pageSize;
                } else {
                    (totalItems / pageSize) + 1;
                };

                // Calculate start and end index for pagination
                let startIndex = page * pageSize;
                if (startIndex >= totalItems) {
                    // If the start index exceeds total items, return empty data
                    return {
                        data = [];
                        current_page = page + 1;
                        total_pages = totalPages;
                    };
                };

                let endIndex = Nat.min(totalItems, startIndex + pageSize);

                // Collect the paginated tokens
                var resultTokens : List.List<(Principal, Text, Nat)> = List.nil();
                var currentIndex : Nat = 0;
                for ((collectionCanisterId, tokenCount) in claimedCollectionData.vals()) {
                    if (currentIndex >= startIndex and currentIndex < endIndex) {
                        let collectionCanisterActor = actor (Principal.toText(collectionCanisterId)) : actor {
                            getCollectionDetails : () -> async (Text, Text, Text);
                        };
                        let collectionDetailsResult = await collectionCanisterActor.getCollectionDetails();
                        let collectionTitle = collectionDetailsResult.0;
                        resultTokens := List.push((collectionCanisterId, collectionTitle, tokenCount), resultTokens);
                    };
                    currentIndex += 1;
                };

                let resultArray = List.toArray(List.reverse(resultTokens));

                return {
                    data = resultArray;
                    current_page = page + 1;
                    total_pages = totalPages;
                };
            };
        };
    };

    // public shared ({ caller = user }) func getUserTokensFromAllCollections() : async [(Principal, Text, Nat)] {
    //     var resultArray = Buffer.Buffer<(Principal, Text, Nat)>(0);

    //     let userAID = AID.fromPrincipal(user, null);
    //     let userCollections = usersCollectionMap.get(user);

    //     for (collectionCanisterId in allCollections.vals()) {
    //         var presentInUserCollections = false;

    //         switch (userCollections) {
    //             case (?collections) {
    //                 // Use Array.find to check if collectionCanisterId exists in collections
    //                 presentInUserCollections := Option.isSome(Array.find(collections, func((_ : Time.Time, principal : Principal)) : Bool {
    //                     principal == collectionCanisterId
    //                 }));
    //             };
    //             case null {
    //                 presentInUserCollections := false;
    //             };
    //         };

    //         // Skip processing if the collection is already in userCollections
    //         if (not presentInUserCollections) {
    //             let collectionCanisterActor = actor (Principal.toText(collectionCanisterId)) : actor {
    //                 tokens : (aid : AccountIdentifier) -> async Result.Result<[TokenIndex], CommonError>;
    //                 getCollectionDetails : () -> async (Text, Text, Text);
    //             };

    //             // Retrieve collection details
    //             let collectionDetails = await collectionCanisterActor.getCollectionDetails();
    //             let collectionTitle = collectionDetails.0;

    //             // Get tokens of the user in the collection
    //             let tokensResult = await collectionCanisterActor.tokens(userAID);

    //             // Process the token result
    //             switch (tokensResult) {
    //                 case (#ok(tokenIds)) {
    //                     let tokenCount = tokenIds.size();
    //                     if (tokenCount > 0) {
    //                         resultArray.add((collectionCanisterId, collectionTitle, tokenCount));
    //                     };
    //                 };
    //                 case (#err(_)) {
    //                     // Ignore errors for collections where token retrieval fails
    //                 };
    //             };
    //         };
    //     };

    //     return Buffer.toArray(resultArray);
    // };

    func principalToUser(principal : Principal) : User {
        #principal(principal);
    };

    // Token will be transfered to this Vault and gives you req details to construct a link out of it, which you can share
    public shared func createLink(
        user : Principal,
        _collectionCanisterId : Principal,
        _from : Principal,
        _tokenId : TokenIndex,
    ) : async Nat32 {

        if (Principal.isAnonymous(user)) {
            throw Error.reject("Anonymous principals are not allowed.");
        };
        // Check if the link (tokenId) already exists in userLinks for this user
        let existingLinks = userLinks.get(_from);

        switch (existingLinks) {
            case null {
                // No links exist, continue to the next step
            };
            case (?links) {
                // Convert the existing array to a List
                let linksList = List.fromArray(links);

                // Check if the tokenId already exists
                let tokenExists = List.some<Link>(
                    linksList,
                    func(link) {
                        link.tokenId == _tokenId and link.claimPattern == "transfer" and link.collection == _collectionCanisterId
                    },
                );

                if (tokenExists) {
                    throw Error.reject("Error: Token ID already exists in user links.");
                };
            };
        };

        // Prepare the new deposit and link objects
        let userAID = AID.fromPrincipal(_from, null);
        let key = generateKey(userAID, Time.now(), _tokenId);
        let newDeposit : Deposit = {
            tokenId = _tokenId;
            sender = _from;
            collectionCanister = _collectionCanisterId;
            timestamp = Time.now();
            claimPattern = "transfer";
            status = "created";
        };
        let newLink : Link = {
            tokenId = _tokenId;
            collection = _collectionCanisterId;
            claimPattern = "transfer";
            createdBy = userAID;
            linkKey = key;
        };

        // Update the userLinks TrieMap with the new link
        switch (existingLinks) {
            case null {
                // No links exist
                userLinks.put(_from, [newLink]);
            };
            case (?links) {
                // Convert the existing array to a List
                let linksList = List.fromArray(links);

                // Add the new link to the list
                let updatedLinksList = List.push(newLink, linksList);

                // Update the user's links in the TrieMap
                userLinks.put(_from, List.toArray(updatedLinksList));
            };
        };

        // Store the new deposit in the depositItemsMap
        depositItemsMap.put(key, newDeposit);
        linksCount := linksCount + 1;
        dailyLinksCreatedCount := dailyLinksCreatedCount + 1;
        userLinksCount := updateUserCountArray(userLinksCount, user);
        dailyUserLinksCreatedCount := updateUserCountArray(dailyUserLinksCreatedCount, user);

        // Return the key for tracking purposes (no token transfer here)
        return key;
    };

    public shared func createLinkForNonMinted(
        user : Principal,
        _collectionCanisterId : Principal,
        _from : Principal,
        _tokenId : Nat32,
    ) : async Nat32 {

        if (Principal.isAnonymous(user)) {
            throw Error.reject("Anonymous principals are not allowed.");
        };

        let existingLinks = userLinks.get(_from);

        switch (existingLinks) {
            case null {
                // No links exist, continue to the next step
            };
            case (?links) {
                // Convert the existing array to a List
                let linksList = List.fromArray(links);

                // Check if the tokenId already exists
                let tokenExists = List.some<Link>(
                    linksList,
                    func(link) {
                        link.tokenId == _tokenId and link.claimPattern == "mint" and link.collection == _collectionCanisterId
                    },
                );

                if (tokenExists) {
                    throw Error.reject("Error: Token ID already exists in user links.");
                };
            };
        };
        // Check if the tokenId exists in the tokensDataToBeMinted for the given collection
        switch (tokensDataToBeMinted.get(_collectionCanisterId)) {
            case (?tokensList) {
                var matchingToken : ?(Nat32, Metadata) = null;

                for (token in tokensList.vals()) {
                    if (token.0 == _tokenId) {
                        matchingToken := ?token;
                    };
                };
                let userAID = AID.fromPrincipal(_from, null);

                switch (matchingToken) {
                    case (?(_, metadata)) {
                        // Create a deposit entry for the non-minted token
                        let key = generateKey(userAID, Time.now(), _tokenId);
                        let newDeposit : Deposit = {
                            tokenId = _tokenId;
                            sender = _from;
                            collectionCanister = _collectionCanisterId;
                            timestamp = Time.now();
                            claimPattern = "mint";
                            status = "created";
                        };
                        let newLink : Link = {
                            tokenId = _tokenId;
                            collection = _collectionCanisterId;
                            claimPattern = "mint";
                            createdBy = userAID;
                            linkKey = key;
                        };

                        // Update the userLinks TrieMap with the new link
                        switch (existingLinks) {
                            case null {
                                // No links exist
                                userLinks.put(_from, [newLink]);
                            };
                            case (?links) {
                                // Convert the existing array to a List
                                let linksList = List.fromArray(links);

                                // Add the new link to the list
                                let updatedLinksList = List.push(newLink, linksList);

                                // Update the user's links in the TrieMap
                                userLinks.put(_from, List.toArray(updatedLinksList));
                            };
                        };
                        depositItemsMap.put(key, newDeposit);
                        linksCount := linksCount + 1;
                        dailyLinksCreatedCount := dailyLinksCreatedCount + 1;
                        userLinksCount := updateUserCountArray(userLinksCount, user);
                        dailyUserLinksCreatedCount := updateUserCountArray(dailyUserLinksCreatedCount, user);
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

    public shared ({ caller = user }) func claim(
        _collectionCanisterId : Principal,
        _depositKey : Nat32,
    ) : async Result.Result<Int, Text> {
        if (Principal.isAnonymous(user)) {
            throw Error.reject("Anonymous principals are not allowed.");
        };
        await claimToken(user, _collectionCanisterId, _depositKey);
    };

    func claimToken(
        user : Principal,
        _collectionCanisterId : Principal,
        _depositKey : Nat32,
    ) : async Result.Result<Int, Text> {

        let depositItemOpt = depositItemsMap.get(_depositKey);

        switch (depositItemOpt) {
            case null {
                throw Error.reject("Deposit Key not found, might be claimed already..!");
                return #err("Deposit Key not found, might be claimed already..!");
            };
            case (?depositItem) {
                if (depositItem.sender == user) {
                    throw Error.reject("Sender cannot claim Link");
                    return #err("Sender cannot claim Link");
                };
                let claimResult = switch (depositItem.claimPattern) {
                    case ("transfer") {
                        await claimLink(user, _collectionCanisterId, depositItem, _depositKey);
                    };
                    case ("mint") {
                        await mintAtClaim(user, _collectionCanisterId, depositItem, _depositKey);
                    };
                    case _ {
                        throw Error.reject("Invalid claim pattern: " # depositItem.claimPattern);
                        return #err("Invalid claim pattern");
                    };
                };

                switch (claimResult) {
                    case (#ok(claimRes)) {
                        // Retrieve existing claims for the user
                        let userClaims : ?[(Principal, Nat)] = claimedTokensMap.get(user);

                        let updatedClaims : [(Principal, Nat)] = switch (userClaims) {
                            case null {
                                // No existing claims, initialize with a new entry
                                [(_collectionCanisterId, 1)];
                            };
                            case (?(existingClaims)) {
                                // Convert to List for easier manipulation
                                let claimsList = List.fromArray(existingClaims);

                                // Check if the collection canister ID is already in the list
                                var found = false;
                                var updatedList = List.map<(Principal, Nat), (Principal, Nat)>(
                                    claimsList,
                                    func(claim : (Principal, Nat)) : (Principal, Nat) {
                                        if (claim.0 == _collectionCanisterId) {
                                            found := true;
                                            // Increment the token count for this collection
                                            (claim.0, claim.1 + 1);
                                        } else {
                                            claim;
                                        };
                                    },
                                );

                                // If not found, add a new entry for this collection
                                if (not found) {
                                    updatedList := List.push<(Principal, Nat)>((_collectionCanisterId, 1), updatedList);
                                };

                                // Convert back to array for storing in the TrieMap
                                List.toArray(updatedList);
                            };
                        };

                        // Update the claimed tokens map with the new or updated list
                        claimedTokensMap.put(user, updatedClaims);
                        return #ok(claimRes);
                    };
                    case (#err e) {
                        return #err(e);
                    };
                };
            };
        };
    };

    // Function to update user campaigns map based on changes in campaigns
    func updateUserCampaignsMap(campaignId : Text, user : Principal, updatedDepositIndices : [Nat32]) : async () {
        let existingUserCampaignsOpt = userCampaignsMap.get(user);

        switch (existingUserCampaignsOpt) {
            case (?existingUserCampaigns) {
                var updatedCampaigns : [Campaign] = [];
                var campaignUpdated = false;

                // Iterate through existing campaigns
                for (existingCampaign in existingUserCampaigns.vals()) {
                    if (existingCampaign.id == campaignId) {
                        let updatedCampaign : Campaign = {
                            existingCampaign with depositIndices = updatedDepositIndices
                        };
                        updatedCampaigns := Array.append(updatedCampaigns, [updatedCampaign]);
                        campaignUpdated := true;
                    } else {
                        updatedCampaigns := Array.append(updatedCampaigns, [existingCampaign]);
                    };
                };

                if (campaignUpdated) {
                    userCampaignsMap.put(user, updatedCampaigns);
                } else {

                };
            };
            case null {};
        };
    };

    // Token will be transfered to user who claims through the shared link
    func claimLink(
        user : Principal,
        _collectionCanisterId : Principal,
        _depositItem : Deposit,
        _depositKey : Nat32,
    ) : async Result.Result<Int, Text> {

        // if (Principal.isAnonymous(user)) {
        //     throw Error.reject("Anonymous principals are not allowed.");
        // };

        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
            ext_transfer : (
                request : TransferRequest
            ) -> async TransferResponse;
        };

        let depositObj : Deposit = _depositItem;

        if (_collectionCanisterId != depositObj.collectionCanister) {
            return #err("Collection canister ID mismatch");
        };

        let userFrom : User = principalToUser(depositObj.sender); // Sender is the original owner
        let userTo : User = principalToUser(user); // Claimer is the caller

        let tokenIdentifier = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, depositObj.tokenId);

        let transferRequest : TransferRequest = {
            from = userFrom;
            to = userTo;
            token = tokenIdentifier;
            amount = 1;
            memo = "";
            notify = false;
            subaccount = null;
        };

        let response = await collectionCanisterActor.ext_transfer(transferRequest);

        switch (response) {
            case (#ok(balance)) {
                depositItemsMap.delete(_depositKey);

                let existingLinksOpt = userLinks.get(depositObj.sender);
                switch (existingLinksOpt) {
                    case (?links) {
                        let updatedLinks = Array.filter(
                            links,
                            func(link : Link) : Bool {
                                link.tokenId != depositObj.tokenId or link.claimPattern != depositObj.claimPattern;
                            },
                        );
                        userLinks.put(depositObj.sender, updatedLinks);
                    };
                    case null {
                        return #err("No links found for user");
                    };
                };

                for (campaignId in campaignLinks.keys()) {
                    let linkIndicesOpt = campaignLinks.get(campaignId);
                    switch (linkIndicesOpt) {
                        case (?linkIndices) {
                            let newLinks = Array.filter<Nat32>(
                                linkIndices,
                                func(key : Nat32) : Bool {
                                    return key != _depositKey;
                                },
                            );
                            campaignLinks.put(campaignId, newLinks);
                            let campaignOpt = campaigns.get(campaignId);
                            switch (campaignOpt) {
                                case (?campaign) {
                                    // Update depositIndices in the campaign object
                                    let updatedDepositIndices = Array.filter<Nat32>(
                                        campaign.depositIndices,
                                        func(index : Nat32) : Bool {
                                            return index != _depositKey;
                                        },
                                    );
                                    let updatedCampaign : Campaign = {
                                        id = campaign.id;
                                        title = campaign.title;
                                        tokenType = campaign.tokenType;
                                        collection = campaign.collection;
                                        claimPattern = campaign.claimPattern;
                                        tokenIds = campaign.tokenIds;
                                        walletOption = campaign.walletOption;
                                        displayWallets = campaign.displayWallets;
                                        expirationDate = campaign.expirationDate;
                                        createdBy = campaign.createdBy;
                                        createdAt = campaign.createdAt;
                                        depositIndices = updatedDepositIndices;
                                        status = #Ongoing;
                                    };

                                    campaigns.put(campaignId, updatedCampaign);

                                    await updateUserCampaignsMap(campaignId, depositObj.sender, updatedDepositIndices);

                                    // If no remaining links, delete the campaign
                                    if (newLinks.size() == 0) {
                                        await completeCampaign(campaignId);
                                    };
                                };
                                case null { /* Handle if campaign not found */ };
                            };
                        };
                        case null {
                            return #err("No link created during campaign creation");
                        };
                    };
                };

                claimCount := claimCount + 1;
                dailyLinksClaimedCount := dailyLinksClaimedCount + 1;
                userClaimCount := updateUserCountArray(userClaimCount, user);
                dailyUserLinksClaimedCount := updateUserCountArray(dailyUserLinksClaimedCount, user);
                return #ok(0); // Successful claim
            };

            case (#err(err)) {
                switch (err) {
                    case (#CannotNotify(accountId)) {
                        return #err("Cannot notify account " # accountId);
                    };
                    case (#InsufficientBalance) {
                        return #err("Insufficient balance");
                    };
                    case (#InvalidToken(tokenId)) {
                        return #err("Invalid token " # tokenId);
                    };
                    case (#Other(text)) {
                        return #err("Error: " # text);
                    };
                    case (#Rejected) {
                        return #err("Transfer rejected");
                    };
                    case (#Unauthorized(accountId)) {
                        return #err("Unauthorized account " # accountId);
                    };
                };
            };
        };
    };

    func mintAtClaim(
        user : Principal,
        _collectionCanisterId : Principal,
        _depositItem : Deposit,
        _depositKey : Nat32,
    ) : async Result.Result<Int, Text> {

        // if (Principal.isAnonymous(user)) {
        //     throw Error.reject("Anonymous principals are not allowed.");
        // };
        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
            ext_mint : (
                request : [(AccountIdentifier, Metadata)]
            ) -> async [TokenIndex];
        };

        if (_collectionCanisterId != _depositItem.collectionCanister) {
            throw Error.reject("Collection canister ID mismatch");
            return #err("Collection canister ID mismatch");
        };

        let tokensListOpt = tokensDataToBeMinted.get(_collectionCanisterId);
        switch (tokensListOpt) {
            case (?tokensList) {
                var foundToken : ?(Nat32, Metadata) = null;
                var remainingTokens : [(Nat32, Metadata)] = [];

                for (token in tokensList.vals()) {
                    if (token.0 == _depositItem.tokenId) {
                        foundToken := ?token;
                    } else {
                        remainingTokens := Array.append(remainingTokens, [token]);
                    };
                };

                switch (foundToken) {
                    case (?(_, metadata)) {
                        let receiver = AID.fromPrincipal(user, null);
                        let request : [(AccountIdentifier, Metadata)] = [(receiver, metadata)];

                        let response = await collectionCanisterActor.ext_mint(request);

                        depositItemsMap.delete(_depositKey);
                        if (Array.size(remainingTokens) > 0) {
                            tokensDataToBeMinted.put(_collectionCanisterId, remainingTokens);
                        } else {
                            tokensDataToBeMinted.delete(_collectionCanisterId);
                        };

                        let existingLinksOpt = userLinks.get(_depositItem.sender);
                        switch (existingLinksOpt) {
                            case (?links) {
                                let updatedLinks = Array.filter(
                                    links,
                                    func(link : Link) : Bool {
                                        link.tokenId != _depositItem.tokenId or link.claimPattern != _depositItem.claimPattern;
                                    },
                                );
                                userLinks.put(_depositItem.sender, updatedLinks);
                            };
                            case null {
                                throw Error.reject("No links found for user");
                                return #err("No links found for user");
                            };
                        };

                        for (campaignId in campaignLinks.keys()) {
                            let linkIndicesOpt = campaignLinks.get(campaignId);
                            switch (linkIndicesOpt) {
                                case (?linkIndices) {
                                    let newLinks = Array.filter<Nat32>(
                                        linkIndices,
                                        func(key : Nat32) : Bool {
                                            return key != _depositKey;
                                        },
                                    );
                                    campaignLinks.put(campaignId, newLinks);
                                    let campaignOpt = campaigns.get(campaignId);
                                    switch (campaignOpt) {
                                        case (?campaign) {
                                            // Update depositIndices in the campaign object
                                            let updatedDepositIndices = Array.filter<Nat32>(
                                                campaign.depositIndices,
                                                func(index : Nat32) : Bool {
                                                    return index != _depositKey;
                                                },
                                            );
                                            let updatedCampaign : Campaign = {
                                                id = campaign.id;
                                                title = campaign.title;
                                                tokenType = campaign.tokenType;
                                                collection = campaign.collection;
                                                claimPattern = campaign.claimPattern;
                                                tokenIds = campaign.tokenIds;
                                                walletOption = campaign.walletOption;
                                                displayWallets = campaign.displayWallets;
                                                expirationDate = campaign.expirationDate;
                                                createdBy = campaign.createdBy;
                                                createdAt = campaign.createdAt;
                                                depositIndices = updatedDepositIndices;
                                                status = #Ongoing;
                                            };

                                            campaigns.put(campaignId, updatedCampaign);

                                            await updateUserCampaignsMap(campaignId, _depositItem.sender, updatedDepositIndices);

                                            // If no remaining links, delete the campaign
                                            if (newLinks.size() == 0) {
                                                await completeCampaign(campaignId);
                                            };
                                        };
                                        case null {
                                            /* Handle if campaign not found */
                                        };
                                    };
                                    if (newLinks.size() == 0) {
                                        await markCampaignStatus(campaignId, #Completed);
                                    };
                                };
                                case null {
                                    return #err("No link created during campaign creation");
                                };
                            };
                        };

                        claimCount := claimCount + 1;
                        dailyLinksClaimedCount := dailyLinksClaimedCount + 1;
                        userClaimCount := updateUserCountArray(userClaimCount, user);
                        dailyUserLinksClaimedCount := updateUserCountArray(dailyUserLinksClaimedCount, user);
                        return #ok(0); // Successful mint
                    };
                    case null {
                        throw Error.reject("Token ID does not match any in the deposit object");
                        return #err("Token ID does not match any in the deposit object");
                    };
                };
            };
            case null {
                throw Error.reject("No metadata found for the given token");
                return #err("No metadata found for the given token");
            };
        };
    };

    // Campaign creation
    public shared ({ caller = user }) func createCampaign(
        title : Text,
        tokenType : Text,
        collection : Principal,
        claimPattern : Text,
        tokenIds : [TokenIndex],
        walletOption : Text,
        displayWallets : [Text],
        expirationDate : Time.Time,
    ) : async (Text, [Nat32]) {

        if (Principal.isAnonymous(user)) {
            throw Error.reject("Anonymous principals are not allowed.");
        };
        let campaignId = generateCampaignId(user);
        var linkResponses : [Nat32] = [];

        switch (?expirationDate) {
            case (?exp) await scheduleCampaignDeletion(campaignId, exp);
            case null throw Error.reject("Invalid expiration date format");
        };

        for (tokenId in tokenIds.vals()) {
            var linkKeys : Nat32 = 0;
            if (claimPattern == "transfer") {
                linkKeys := await createLink(user, collection, user, tokenId);
            } else if (claimPattern == "mint") {
                linkKeys := await createLinkForNonMinted(user, collection, user, tokenId);
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
            status = #Ongoing;
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

    func scheduleCampaignDeletion(campaignId : Text, expiration : Time.Time) : async () {
        let now = Time.now();
        let duration = if (expiration > now) expiration - now else now - expiration;
        let natDuration = Nat64.toNat(Nat64.fromIntWrap(duration));
        if (duration > 0) {
            let id = Timer.setTimer<system>(
                #nanoseconds natDuration,
                func() : async () {
                    await completeCampaign(campaignId);
                },
            );
            campaignTimers.put(campaignId, id);
        };
    };

    // internal function to take care of link expiration
    func completeCampaign(campaignId : Text) : async () {
        // Retrieve QRSetId and DispenserId from qdcMap
        var qrSetId : Text = "";
        var dispenserId : Text = "";

        var qdcList = List.fromArray(qdcMap);
        var updatedQdcList = List.filter<(Text, (Text, Text))>(
            qdcList,
            func(entry) : Bool {
                if (entry.0 == campaignId) {
                    qrSetId := entry.1.0;
                    dispenserId := entry.1.1;
                    false;
                } else {
                    true;
                };
            },
        );
        qdcMap := List.toArray(updatedQdcList);

        // Remove links related to the campaign in `campaignLinks` and `userLinks`
        for ((user, links) in userLinks.entries()) {
            let linksToKeep = Array.filter<Link>(
                links,
                func(link) {
                    let campaignOpt = campaignLinks.get(campaignId);
                    switch (campaignOpt) {
                        case (?campaignLinkList) {
                            Array.find<Nat32>(
                                campaignLinkList,
                                func(depositKey) {
                                    depositKey == link.linkKey;
                                },
                            ) == null;
                        };
                        case null { true };
                    };
                },
            );

            if (Array.size(linksToKeep) > 0) {
                userLinks.put(user, linksToKeep);
            } else {
                userLinks.delete(user);
            };
        };

        let linksSize = switch (campaignLinks.get(campaignId)) {
            case (?links) {
                Array.size(links);
            };
            case null {
                0;
            };
        };

        if (linksSize == 0) {
            if (qrSetId != "") {
                await markQRSetStatus(qrSetId, #Completed);
            };
            if (dispenserId != "") {
                await markDispenserStatus(dispenserId, #Completed);
            };
            await markCampaignStatus(campaignId, #Completed);
        } else {

            let depositIndicesOpt = campaignLinks.get(campaignId);
            switch (depositIndicesOpt) {
                case (?depositIndices) {
                    for (depositIndex in depositIndices.vals()) {
                        depositItemsMap.delete(depositIndex);
                    };
                };
                case null {};
            };

            await markCampaignStatus(campaignId, #Expired);
            await markDispenserStatus(dispenserId, #Expired);
            await markQRSetStatus(qrSetId, #Expired);
        };

        // Remove the campaign itself from `campaignLinks`
        campaignLinks.delete(campaignId);

        // Delete the campaign itself
        // campaigns.delete(campaignId);

        // Cancel the scheduled timer if it exists
        switch (campaignTimers.get(campaignId)) {
            case (?timerId) {
                Timer.cancelTimer(timerId);
                campaignTimers.delete(campaignId);
            };
            case null {};
        };

        // Remove the campaign from the user's campaign map
        // for ((user, userCampaigns) in userCampaignsMap.entries()) {
        //     let updatedCampaigns = Array.filter<Campaign>(userCampaigns ,func (campaign) : Bool {
        //         campaign.id != campaignId
        //     });
        //     if (updatedCampaigns.size() == 0) {
        //         userCampaignsMap.delete(user);
        //     } else {
        //         userCampaignsMap.put(user, updatedCampaigns);
        //     };
        // };

        // Remove related QR sets from user's QR set map
        // for ((user, userQRSets) in userQRSetMap.entries()) {
        //     let updatedQRSets = Array.filter<QRSet>(userQRSets ,func (qrSet) : Bool {
        //         qrSet.campaignId != campaignId
        //     });
        //     if (updatedQRSets.size() == 0) {
        //         userQRSetMap.delete(user);
        //     } else {
        //         userQRSetMap.put(user, updatedQRSets);
        //     };
        // };

        // Remove related dispensers from user's dispenser map
        // for ((user, userDispensers) in userDispensersMap.entries()) {
        //     let updatedDispensers = Array.filter<Dispenser>(
        //         userDispensers,
        //         func(dispenser) : Bool {
        //             dispenser.campaignId != campaignId;
        //         },
        //     );
        //     if (updatedDispensers.size() == 0) {
        //         userDispensersMap.delete(user);
        //     } else {
        //         userDispensersMap.put(user, updatedDispensers);
        //     };
        // };
    };

    public func markCampaignStatus(campaignId : Text, newStatus : Status) : async () {
        let campaignOpt = campaigns.get(campaignId);
        switch (campaignOpt) {
            case null {};
            case (?campaign) {
                let updatedCampaign = { campaign with status = newStatus };
                campaigns.put(campaignId, updatedCampaign);
            };
        };

        // Update the userCampaignsMap
        for ((user, campaigns) in userCampaignsMap.entries()) {
            let updatedCampaigns = Array.map<Campaign, Campaign>(
                campaigns,
                func(campaign) : Campaign {
                    if (campaign.id == campaignId) {
                        return { campaign with status = newStatus };
                    } else {
                        return campaign;
                    };
                },
            );
            userCampaignsMap.put(user, updatedCampaigns);
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

    func getUsedTokenIds(_collectionCanisterId : Principal, stored : Bool) : async [TokenIndex] {
        var usedTokenIds : [TokenIndex] = [];

        // for ((_, campaign) in campaigns.entries()) {
        //     if (campaign.collection == _collectionCanisterId) {
        //         for (depositIndex in campaign.depositIndices.vals()) {
        //             let depositItem = depositItemsMap
        //                 case (?item) {.get(depositIndex);
        //             switch (depositItem) {
        //                     if (item.claimPattern == "transfer" and not stored) {
        //                         usedTokenIds := Array.append(usedTokenIds, [item.tokenId]);
        //                     } else if (item.claimPattern == "mint" and stored) {
        //                         usedTokenIds := Array.append(usedTokenIds, [item.tokenId]);
        //                     };
        //                 };
        //                 case null {
        //                     // Handle the case where the deposit index does not exist in depositItems
        //                 };
        //             };
        //         };
        //     };
        // };

        let new_map = TrieMap.mapFilter<Text, Campaign,Campaign>(
            campaigns,
            Text.equal,
            Text.hash,
            func (_, val) = if (val.collection == _collectionCanisterId) {?val} else {null}
        );
        for ((_, value) in new_map.entries()){
            for (depositIndex in value.depositIndices.vals()) {
                    let depositItem = depositItemsMap.get(depositIndex);
                    switch (depositItem) {
                        case (?item) {
                            if (item.claimPattern == "transfer" and not stored) {
                                usedTokenIds := Array.append(usedTokenIds, [item.tokenId]);
                            } else if (item.claimPattern == "mint" and stored) {
                                usedTokenIds := Array.append(usedTokenIds, [item.tokenId]);
                            };
                        };
                        case null {
                            // Handle the case where the deposit index does not exist in depositItems
                        };
                    };
                };
        };
        return usedTokenIds;
    };

    public shared ({caller = user}) func getTokens(_collectionCanisterId : Principal) : async [TokenIndex] {
        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
            tokens : (AccountIdentifier) -> async Result.Result<[TokenIndex], CommonError>;
            tokenMetadata : (TokenIdentifier) -> async Result.Result<Metadata, CommonError>;
        };
        let userAID = AID.fromPrincipal(user, null);
        let tokenIndicesResult = await collectionCanisterActor.tokens(userAID);

        let tokenIndices = switch tokenIndicesResult {
            case (#ok(indices)) indices;
            case (#err(_)) return [];
        };
        return tokenIndices;
    };


    public shared ({caller = user}) func getAllTokens(_collectionCanisterId : Principal) : async [TokenIndex] {
        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
            tokens : (AccountIdentifier) -> async Result.Result<[TokenIndex], CommonError>;
        };
        let userAID = AID.fromPrincipal(user, null);
        let tokenIndicesResult = await collectionCanisterActor.tokens(userAID);

        let tokenIndices = switch tokenIndicesResult {
            case (#ok(indices)) indices;
            case (#err(_)) return [];
        };

        var availableTokenNames : [TokenIndex] = [];
        let usedTokenIds = await getUsedTokenIds(_collectionCanisterId, false);

        for (tokenIndex in tokenIndices.vals()) {
            if (Array.find<TokenIndex>(usedTokenIds, func(id) { id == tokenIndex }) == null) {
                    availableTokenNames := Array.append(availableTokenNames, [tokenIndex]);
                };
        };
        return availableTokenNames;
    };


    public shared ({ caller = user }) func getAvailableTokensForCampaign(
        _collectionCanisterId : Principal
    ) : async [(TokenIndex, AccountIdentifier, Text)] {
        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
            tokens : (AccountIdentifier) -> async Result.Result<[TokenIndex], CommonError>;
            tokenMetadata : (TokenIdentifier) -> async Result.Result<Metadata, CommonError>;
        };

        let userAID = AID.fromPrincipal(user, null);
        let tokenIndicesResult = await collectionCanisterActor.tokens(userAID);

        let tokenIndices = switch tokenIndicesResult {
            case (#ok(indices)) indices;
            case (#err(_)) return [];
        };

        var availableTokenNames : [(TokenIndex, AccountIdentifier, Text)] = [];
        let usedTokenIds = await getUsedTokenIds(_collectionCanisterId, false);

        for (tokenIndex in tokenIndices.vals()) {
            if (Array.find<TokenIndex>(usedTokenIds, func(id) { id == tokenIndex }) == null) {
                let tokenId = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, tokenIndex);
                let metadataResult = await collectionCanisterActor.tokenMetadata(tokenId);
                switch metadataResult {
                    case (#ok(metadata)) {
                        switch (metadata) {
                            case (#nonfungible(data)) {
                                // Only store and return the name field from Metadata
                                let name = data.name;
                                availableTokenNames := Array.append(availableTokenNames, [(tokenIndex, userAID, name)]);
                            };
                            case (#fungible(_)) {
                                // Skip fungible tokens
                            };
                        };
                    };
                    case (#err(_)) {
                        // Optionally handle metadata fetch errors for specific tokens
                    };
                };
            };
        };

        return availableTokenNames;
    };

    public shared ({ caller = user }) func getAvailableTokensForCampaignPaginate(
        _collectionCanisterId : Principal,
        page : Nat,
        pageSize : Nat
    ) : async {
        data : [(TokenIndex, AccountIdentifier, Text)];
        current_page : Nat;
        total_pages : Nat;
    } {
        let collectionCanisterActor = actor (Principal.toText(_collectionCanisterId)) : actor {
            tokens : (AccountIdentifier) -> async Result.Result<[TokenIndex], CommonError>;
            tokenMetadata : (TokenIdentifier) -> async Result.Result<Metadata, CommonError>;
        };

        let userAID = AID.fromPrincipal(user, null);
        let tokenIndicesResult = await collectionCanisterActor.tokens(userAID);

        let tokenIndices = switch tokenIndicesResult {
            case (#ok(indices)) indices;
            case (#err(_)) return { data = []; current_page = 0; total_pages = 0 };
        };

        var availableTokenNames : [(TokenIndex, AccountIdentifier, Text)] = [];
        let usedTokenIds = await getUsedTokenIds(_collectionCanisterId, false);

        // Filter out tokens already used
        for (tokenIndex in tokenIndices.vals()) {
            if (Array.find<TokenIndex>(usedTokenIds, func(id) { id == tokenIndex }) == null) {
                let tokenId = ExtCore.TokenIdentifier.fromPrincipal(_collectionCanisterId, tokenIndex);
                let metadataResult = await collectionCanisterActor.tokenMetadata(tokenId);
                switch metadataResult {
                    case (#ok(metadata)) {
                        switch (metadata) {
                            case (#nonfungible(data)) {
                                // Only store and return the name field from Metadata
                                let name = data.name;
                                availableTokenNames := Array.append(availableTokenNames, [(tokenIndex, userAID, name)]);
                            };
                            case (#fungible(_)) {
                                // Skip fungible tokens
                            };
                        };
                    };
                    case (#err(_)) {
                        // Optionally handle metadata fetch errors for specific tokens
                    };
                };
            };
        };

        let totalItems = availableTokenNames.size();
        let totalPages = if (totalItems % pageSize == 0) {
            totalItems / pageSize;
        } else {
            (totalItems / pageSize) + 1;
        };

        let startIndex = page * pageSize;
        if (startIndex >= totalItems) {
            return { data = []; current_page = page + 1; total_pages = totalPages };
        };

        let endIndex = Nat.min(totalItems, startIndex + pageSize);

        // Collect the paginated tokens
        var resultTokens : [(TokenIndex, AccountIdentifier, Text)] = [];
        var currentIndex : Nat = 0;
        for (token in availableTokenNames.vals()) {
            if (currentIndex >= startIndex and currentIndex < endIndex) {
                resultTokens := Array.append(resultTokens, [token]);
            };
            currentIndex += 1;
        };

        return {
            data = resultTokens;
            current_page = page + 1;
            total_pages = totalPages;
        };
    };

    public shared ({ caller = user }) func getAvailableStoredTokensForCampaign(
        _collectionCanisterId : Principal
    ) : async [(Nat32, Text)] {
        // Retrieve all tokens data for the collection canister
        let allTokens = tokensDataToBeMinted.get(_collectionCanisterId);
        let usedTokenIds = await getUsedTokenIds(_collectionCanisterId, true);

        let tokens : [(Nat32, Text)] = switch (allTokens) {
            case (?t) {
                Array.map<(Nat32, Metadata), (Nat32, Text)>(
                    t,
                    func(tokenData : (Nat32, Metadata)) : (Nat32, Text) {
                        let (tokenIndex, metadata) = tokenData;
                        let name = switch (metadata) {
                            case (#nonfungible(details)) details.name;
                            case (#fungible(details)) details.name;
                        };
                        (tokenIndex, name);
                    },
                );
            };
            case null { [] };
        };

        // Filter out used tokens
        let availableTokens : [(Nat32, Text)] = Array.filter(
            tokens,
            func(tokenData : (Nat32, Text)) : Bool {
                let (tokenIndex, _) = tokenData;
                return Array.find<Nat32>(
                    usedTokenIds,
                    func(usedTokenId : Nat32) : Bool {
                        return usedTokenId == tokenIndex;
                    },
                ) == null;
            },
        );

        return availableTokens;
    };

    public shared ({ caller = user }) func getAvailableStoredTokensForCampaignPaginate(
        _collectionCanisterId : Principal,
        page : Nat,
        pageSize : Nat
    ) : async {
        data : [(Nat32, Text)];
        current_page : Nat;
        total_pages : Nat;
    } {
        // Retrieve all tokens data for the collection canister
        let allTokens = tokensDataToBeMinted.get(_collectionCanisterId);
        let usedTokenIds = await getUsedTokenIds(_collectionCanisterId, true);

        let tokens : [(Nat32, Text)] = switch (allTokens) {
            case (?t) {
                Array.map<(Nat32, Metadata), (Nat32, Text)>(t, func(tokenData : (Nat32, Metadata)) : (Nat32, Text) {
                    let (tokenIndex, metadata) = tokenData;
                    let name = switch (metadata) {
                        case (#nonfungible(details)) details.name;
                        case (#fungible(details)) details.name;
                    };
                    (tokenIndex, name);
                });
            };
            case null { [] };
        };

        // Filter out used tokens
        let availableTokens : [(Nat32, Text)] = Array.filter(tokens, func(tokenData : (Nat32, Text)) : Bool {
            let (tokenIndex, _) = tokenData;
            return Array.find<Nat32>(usedTokenIds, func(usedTokenId : Nat32) : Bool {
                return usedTokenId == tokenIndex;
            }) == null;
        });

        // Pagination logic
        let totalItems = availableTokens.size();
        let totalPages = if (totalItems % pageSize == 0) {
            totalItems / pageSize;
        } else {
            (totalItems / pageSize) + 1;
        };

        let startIndex = page * pageSize;
        if (startIndex >= totalItems) {
            return { data = []; current_page = page + 1; total_pages = totalPages };
        };

        let endIndex = Nat.min(totalItems, startIndex + pageSize);

        // Collect the paginated tokens
        var resultTokens : [(Nat32, Text)] = [];
        var currentIndex : Nat = 0;
        for (token in availableTokens.vals()) {
            if (currentIndex >= startIndex and currentIndex < endIndex) {
                resultTokens := Array.append(resultTokens, [token]);
            };
            currentIndex += 1;
        };

        return {
            data = resultTokens;
            current_page = page + 1;
            total_pages = totalPages;
        };
    };


    public shared query ({ caller = user }) func getUserCampaignsPaginate(
        page : Nat,
        pageSize : Nat,
    ) : async {
        data : [Campaign];
        current_page : Nat;
        total_pages : Nat;
    } {
        // Retrieve the campaigns for the current user
        switch (userCampaignsMap.get(user)) {
            case (?campaignArray) {
                let totalItems = campaignArray.size();
                let newestFirst = Array.reverse(campaignArray);
                // Calculate total pages
                let totalPages = if (totalItems % pageSize == 0) {
                    totalItems / pageSize;
                } else {
                    (totalItems / pageSize) + 1;
                };

                // Calculate start and end index for pagination
                let startIndex = page * pageSize;
                if (startIndex >= totalItems) {
                    // If the start index exceeds total items, return empty data
                    return {
                        data = [];
                        current_page = page + 1;
                        total_pages = totalPages;
                    };
                };

                let endIndex = Nat.min(totalItems, startIndex + pageSize);

                // Collect the paginated campaigns
                var resultCampaigns : List.List<Campaign> = List.nil();
                var currentIndex : Nat = 0;
                for (campaign in newestFirst.vals()) {
                    if (currentIndex >= startIndex and currentIndex < endIndex) {
                        resultCampaigns := List.push(campaign, resultCampaigns);
                    };
                    currentIndex += 1;
                };

                let resultArray = List.toArray(List.reverse(resultCampaigns));

                return {
                    data = resultArray;
                    current_page = page + 1;
                    total_pages = totalPages;
                };
            };

            case null {
                return { data = []; current_page = 0; total_pages = 0 };
            };
        };
    };

    // Generation of unique campaign ID
    private func generateCampaignId(user : Principal) : Text {
        // Using user ID (Principal) and current timestamp to generate a unique campaign ID
        let timestamp = Time.now();
        let userId = Principal.toText(user);
        "Campaign-" # userId # "_" # Int.toText(timestamp);
    };

    // QR Set Creation
    public shared ({ caller = user }) func createQRSet(
        title : Text,
        quantity : Nat,
        campaignId : Text,
    ) : async Text {

        if (Principal.isAnonymous(user)) {
            throw Error.reject("Anonymous principals are not allowed.");
        };

        let qrSetId = generateQRSetId(user);

        let newQRSet : QRSet = {
            id = qrSetId;
            title = title;
            quantity = quantity;
            campaignId = campaignId;
            createdAt = Time.now();
            creator = user;
            status = #Ongoing;
        };

        // Update qdcMap with the QRSet and DispenserId
        var qdcList = List.fromArray(qdcMap);

        // Find the entry for the given campaignId
        var qdcEntry = List.find(
            qdcList,
            func(entry : (Text, (Text, Text))) : Bool {
                return entry.0 == campaignId;
            },
        );

        switch (qdcEntry) {
            case null {
                // If no entry exists for the campaignId, create a new entry with QRSetId
                qdcList := List.push((campaignId, (qrSetId, "")), qdcList);
            };
            case (?existingEntry) {
                // If a QRSetId already exists for the campaign, throw an error
                if (existingEntry.1.0 != "") {
                    // Throw an error or handle it appropriately
                    throw Error.reject("QRSet already exists for this campaignId.");
                } else {
                    // Otherwise, update the existing entry by adding the new QRSetId
                    qdcList := List.filter(
                        qdcList,
                        func(entry : (Text, (Text, Text))) : Bool {
                            return entry.0 != campaignId;
                        },
                    );
                    qdcList := List.push((campaignId, (qrSetId, existingEntry.1.1)), qdcList);
                };
            };
        };

        // Convert the list back to an array
        qdcMap := List.toArray(qdcList);

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

        qrSetId;
    };

    public func markQRSetStatus(qrSetId : Text, newStatus : Status) : async () {
        // Update the main qrSetMap
        let qrSetOpt = qrSetMap.get(qrSetId);
        switch (qrSetOpt) {
            case null {};
            case (?qrSet) {
                if (qrSet.status != #Completed) {
                    let updatedQRSet = { qrSet with status = newStatus };
                    qrSetMap.put(qrSetId, updatedQRSet);
                };
            };
        };

        // Update the user-specific qrSet maps
        for ((user, qrSets) in userQRSetMap.entries()) {
            let updatedQRSets = Array.map<QRSet, QRSet>(
                qrSets,
                func(qrSet) : QRSet {
                    if (qrSet.id == qrSetId) {
                        return { qrSet with status = newStatus };
                    } else {
                        return qrSet;
                    };
                },
            );
            userQRSetMap.put(user, updatedQRSets);
        };

        var qdcList = List.fromArray(qdcMap);
        var updatedQdcList = List.filter<(Text, (Text, Text))>(
            qdcList,
            func(entry) : Bool {
                let campaignId = entry.0;
                let (currentQRSetId, dispenserId) = entry.1;
                let updatedEntry = if (currentQRSetId == qrSetId) {
                    (campaignId, ("", dispenserId));
                } else {
                    entry;
                };
                if (updatedEntry.1.0 == "" and updatedEntry.1.1 == "") {
                    false;
                } else {
                    true;
                };
            },
        );
        qdcMap := List.toArray(updatedQdcList);
    };

    private func generateQRSetId(user : Principal) : Text {
        // Using user ID (Principal) and current timestamp to generate a unique campaign ID
        let timestamp = Time.now();
        let userId = Principal.toText(user);
        "QR-" #userId # "_" # Int.toText(timestamp);
    };

    // Get details of a specific QR set
    public shared query func getQRSetById(qrSetId : Text) : async ?QRSet {
        qrSetMap.get(qrSetId);
    };

    // Get all QR sets created by a user
    public shared query ({ caller = user }) func getUserQRSets() : async ?[QRSet] {
        userQRSetMap.get(user);
    };

    public shared query ({ caller = user }) func getUserQRSetsPaginate(
        page : Nat,
        pageSize : Nat,
    ) : async {
        data : [QRSet];
        current_page : Nat;
        total_pages : Nat;
    } {
        // Retrieve the QR sets for the current user
        switch (userQRSetMap.get(user)) {
            case (?qrSetArray) {
                let totalItems = qrSetArray.size();
                let newestFirst = Array.reverse(qrSetArray);
                // Calculate total pages
                let totalPages = if (totalItems % pageSize == 0) {
                    totalItems / pageSize;
                } else {
                    (totalItems / pageSize) + 1;
                };

                // Calculate start and end index for pagination
                let startIndex = page * pageSize;
                if (startIndex >= totalItems) {
                    // If the start index exceeds total items, return empty data
                    return {
                        data = [];
                        current_page = page + 1;
                        total_pages = totalPages;
                    };
                };

                let endIndex = Nat.min(totalItems, startIndex + pageSize);

                // Collect the paginated QR sets
                var resultQRSets : List.List<QRSet> = List.nil();
                var currentIndex : Nat = 0;
                for (qrSet in newestFirst.vals()) {
                    if (currentIndex >= startIndex and currentIndex < endIndex) {
                        resultQRSets := List.push(qrSet, resultQRSets);
                    };
                    currentIndex += 1;
                };

                let resultArray = List.toArray(List.reverse(resultQRSets));

                return {
                    data = resultArray;
                    current_page = page + 1;
                    total_pages = totalPages;
                };
            };

            case null {
                // Return empty data if no QR sets are found for the user
                return { data = []; current_page = 0; total_pages = 0 };
            };
        };
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

    public shared ({ caller = user }) func createDispenser(
        _title : Text,
        _startDate : Time.Time,
        _duration : Int,
        _campaignId : Text,
        _whitelist : [Principal],
    ) : async Text {

        if (Principal.isAnonymous(user)) {
            throw Error.reject("Anonymous principals are not allowed.");
        };
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
            status = #Ongoing;
        };

        // Update qdcMap with the QRSet and DispenserId
        var qdcList = List.fromArray(qdcMap);

        // Find the entry for the given campaignId
        var qdcEntry = List.find(
            qdcList,
            func(entry : (Text, (Text, Text))) : Bool {
                return entry.0 == _campaignId;
            },
        );

        switch (qdcEntry) {
            case null {
                // If no entry exists for the campaignId, create a new entry with DispenserId
                qdcList := List.push((_campaignId, ("", dispenserId)), qdcList);
            };
            case (?existingEntry) {
                // If a DispenserId already exists for the campaign, throw an error
                if (existingEntry.1.1 != "") {
                    // Throw an error or handle it appropriately
                    throw Error.reject("Dispenser already exists for this campaignId.");
                } else {
                    // Otherwise, update the existing entry by adding the new DispenserId
                    qdcList := List.filter(
                        qdcList,
                        func(entry : (Text, (Text, Text))) : Bool {
                            return entry.0 != _campaignId;
                        },
                    );
                    qdcList := List.push((_campaignId, (existingEntry.1.0, dispenserId)), qdcList);
                };
            };
        };

        // Convert the list back to an array
        qdcMap := List.toArray(qdcList);

        dispensers.put(dispenserId, dispenser);

        await scheduleDispenserDeletion(dispenserId, _startDate, _duration);

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

    public func markDispenserStatus(dispenserId : Text, newStatus : Status) : async () {
        // Update the main dispensers map
        let dispenserOpt = dispensers.get(dispenserId);
        switch (dispenserOpt) {
            case null {};
            case (?dispenser) {
                if (dispenser.status != #Completed) {
                    let updatedDispenser = { dispenser with status = newStatus };
                    dispensers.put(dispenserId, updatedDispenser);
                };
            };
        };

        // Update the user-specific dispensers maps
        for ((user, dispensers) in userDispensersMap.entries()) {
            let updatedDispensers = Array.map<Dispenser, Dispenser>(
                dispensers,
                func(dispenser) : Dispenser {
                    if (dispenser.id == dispenserId) {
                        return { dispenser with status = newStatus };
                    } else {
                        return dispenser;
                    };
                },
            );
            userDispensersMap.put(user, updatedDispensers);
        };

        var qdcList = List.fromArray(qdcMap);
        var updatedQdcList = List.filter<(Text, (Text, Text))>(
            qdcList,
            func(entry) : Bool {
                let campaignId = entry.0;
                let (qrSetId, currentDispenserId) = entry.1;
                let updatedEntry = if (currentDispenserId == dispenserId) {
                    (campaignId, (qrSetId, ""));
                } else {
                    entry;
                };
                if (updatedEntry.1.0 == "" and updatedEntry.1.1 == "") {
                    false;
                } else {
                    true;
                };
            },
        );
        qdcMap := List.toArray(updatedQdcList);
    };

    public shared ({ caller = user }) func dispenserClaim(
        _dispenserId : Text
    ) : async Result.Result<Int, Text> {

        if (Principal.isAnonymous(user)) {
            throw Error.reject("Anonymous principals are not allowed.");
        };
        let dispenserOpt = dispensers.get(_dispenserId);

        switch (dispenserOpt) {
            case null {
                return #err("Dispenser not found");
            };
            case (?dispenser) {

                let currentTime = Time.now();
                if (currentTime < dispenser.startDate) {
                    return #err("Claim period has not started yet");
                };

                // Check if user is in the whitelist
                if (dispenser.whitelist.size() > 0) {
                    let userInWhitelist = Array.find(dispenser.whitelist, func(p : Principal) : Bool { p == user });
                    switch (?userInWhitelist) {
                        case null {
                            return #err("User not whitelisted");
                        };
                        case (?_) {

                        };
                    };
                };
                // User is whitelisted, proceed with the rest of the claim logic
                let campaignOpt = campaigns.get(dispenser.campaignId);

                switch (campaignOpt) {
                    case null {
                        return #err("Campaign not found");
                    };
                    case (?campaign) {
                        let remainingClaimsOpt = campaignLinks.get(dispenser.campaignId);

                        switch (remainingClaimsOpt) {
                            case null {
                                return #err("No claims found for this campaign");
                            };
                            case (?remainingClaims) {
                                if (remainingClaims.size() == 0) {
                                    return #err("No more tokens to claim");
                                };

                                // Check if user has already claimed a token from this dispenser
                                let userClaims = userClaimedDispensers.get(user);
                                switch (userClaims) {
                                    case null {
                                        // No previous claims, proceed with claim
                                    };
                                    case (?claims) {
                                        let alreadyClaimed = Array.find(
                                            claims,
                                            func(claimedId : Text) : Bool {
                                                claimedId == dispenser.id;
                                            },
                                        );
                                        if (alreadyClaimed != null) {
                                            return #err("User has already claimed a token from this dispenser");
                                        };
                                    };
                                };

                                // Claim the token (assuming claimToken returns a Result)
                                let claimResult = await claimToken(user, campaign.collection, remainingClaims[0]);
                                switch (claimResult) {
                                    case (#ok(result)) {
                                        // Update user claims
                                        let updatedClaims = switch (userClaims) {
                                            case null {
                                                List.push<Text>(dispenser.id, List.nil<Text>());
                                            }; // Start new List
                                            case (?existingClaimsArray) {
                                                let existingClaims = List.fromArray(existingClaimsArray); // Convert to List
                                                List.push<Text>(dispenser.id, existingClaims); // Add to existing List
                                            };
                                        };
                                        let updatedClaimsArray = List.toArray(updatedClaims);
                                        userClaimedDispensers.put(user, updatedClaimsArray);
                                        return #ok(result); // Return the claimed token ID
                                    };
                                    case (#err(err)) {
                                        return #err(err); // Return any error from claimToken
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };

    // Function to schedule dispenser deletion based on start time and duration
    func scheduleDispenserDeletion(dispenserId : Text, startTime : Time.Time, duration : Int) : async () {
        let now = Time.now();

        // Calculate the expiration time
        let expirationTime = (startTime) + (duration * 60_000_000_000); // duration is in minutes, converting to nanoseconds
        let timeRemaining = if (expirationTime > now) expirationTime - now else now - expirationTime;
        let natDuration = Nat64.toNat(Nat64.fromIntWrap(timeRemaining));

        if (timeRemaining > 0) {
            let id = Timer.setTimer<system>(
                #nanoseconds natDuration,
                func() : async () {
                    await markDispenserStatus(dispenserId, #Expired);
                },
            );
            dispenserTimers.put(dispenserId, id);
        };
    };

    // func deleteDispenser(dispenserId: Text) : async  () {

    //     // Delete the dispenser itself
    //     dispensers.delete(dispenserId);

    //     // Cancel the scheduled timer if it exists
    //     switch (dispenserTimers.get(dispenserId)) {
    //         case (?timerId) {
    //             Timer.cancelTimer(timerId);
    //             dispenserTimers.delete(dispenserId);
    //         };
    //         case null {};
    //     };

    //     // Remove the dispenser from the user's dispenser map
    //     for ((user, userDispensers) in userDispensersMap.entries()) {
    //         let updatedDispensers = Array.filter<Dispenser>(
    //             userDispensers,
    //             func(dispenser) : Bool {
    //                 dispenser.id != dispenserId;
    //             },
    //         );
    //         if (updatedDispensers.size() == 0) {
    //             userDispensersMap.delete(user);
    //         } else {
    //             userDispensersMap.put(user, updatedDispensers);
    //         };
    //     };
    // };

    // Get details of a specific Dispenser
    public shared query func getDispenserDetails(dispenserId : Text) : async ?Dispenser {
        dispensers.get(dispenserId);
    };

    // Get all dispensers created by a user
    public shared query ({ caller = user }) func getUserDispensers() : async ?[Dispenser] {
        userDispensersMap.get(user);
    };

    public shared query ({ caller = user }) func getUserDispensersPaginate(
        page : Nat,
        pageSize : Nat,
    ) : async {
        data : [Dispenser];
        current_page : Nat;
        total_pages : Nat;
    } {
        // Retrieve the dispensers for the current user
        switch (userDispensersMap.get(user)) {
            case (?dispenserArray) {
                let totalItems = dispenserArray.size();
                let newestFirst = Array.reverse(dispenserArray);
                // Calculate total pages
                let totalPages = if (totalItems % pageSize == 0) {
                    totalItems / pageSize;
                } else {
                    (totalItems / pageSize) + 1;
                };

                // Calculate start and end index for pagination
                let startIndex = page * pageSize;
                if (startIndex >= totalItems) {
                    // If the start index exceeds total items, return empty data
                    return {
                        data = [];
                        current_page = page + 1;
                        total_pages = totalPages;
                    };
                };

                let endIndex = Nat.min(totalItems, startIndex + pageSize);

                // Collect the paginated dispensers
                var resultDispensers : List.List<Dispenser> = List.nil();
                var currentIndex : Nat = 0;
                for (dispenser in newestFirst.vals()) {
                    if (currentIndex >= startIndex and currentIndex < endIndex) {
                        resultDispensers := List.push(dispenser, resultDispensers);
                    };
                    currentIndex += 1;
                };

                let resultArray = List.toArray(List.reverse(resultDispensers));

                return {
                    data = resultArray;
                    current_page = page + 1;
                    total_pages = totalPages;
                };
            };

            case null {
                // Return empty data if no dispensers are found for the user
                return { data = []; current_page = 0; total_pages = 0 };
            };
        };
    };

    // Generation of unique dispenser ID
    private func generateDispenserId(user : Principal) : Text {
        // Using user ID (Principal) and current timestamp to generate a unique dispenser ID
        let timestamp = Time.now();
        let userId = Principal.toText(user);
        "Dispenser-" # userId # "_" # Int.toText(timestamp);
    };

    // Function to get campaign IDs where QRSet is available
    public query func getCampaignsWithQRSet() : async [Text] {

        let qdcList = List.fromArray(qdcMap);

        // Filter campaigns where the QRSet is present (non-empty)
        let qrSetCampaigns = List.filter(
            qdcList,
            func(entry : (Text, (Text, Text))) : Bool {
                let (campaignId, (qrSet, _)) = entry;
                return qrSet != "";
            },
        );

        // Extract only the campaign IDs and return them as an array
        return List.toArray(
            List.map(
                qrSetCampaigns,
                func(entry : (Text, (Text, Text))) : Text {
                    let (campaignId, _) = entry;
                    return campaignId;
                },
            )
        );
    };

    // Function to get campaign IDs where Dispenser is available
    public query func getCampaignsWithDispenser() : async [Text] {

        let qdcList = List.fromArray(qdcMap);

        // Filter campaigns where the Dispenser is present (non-empty)
        let dispenserCampaigns = List.filter(
            qdcList,
            func(entry : (Text, (Text, Text))) : Bool {
                let (campaignId, (_, dispenser)) = entry;
                return dispenser != "";
            },
        );

        // Extract only the campaign IDs and return them as an array
        return List.toArray(
            List.map(
                dispenserCampaigns,
                func(entry : (Text, (Text, Text))) : Text {
                    let (campaignId, _) = entry;
                    return campaignId;
                },
            )
        );
    };

    public type Icrc28TrustedOriginsResponse = {
        trusted_origins : [Text];
    };

    // Equivalent to the function that returns the record type
    public func icrc28_trusted_origins() : async Icrc28TrustedOriginsResponse {
        let trusted_origins = ["https://x4ayz-2iaaa-aaaak-akv6a-cai.icp0.io", "http://localhost:3000", "http://bd3sg-teaaa-aaaaa-qaaba-cai.localhost:4943", "http://127.0.0.1:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai", "http://127.0.0.1:4943", "https://claimlink.xyz"];

        return {
            trusted_origins = trusted_origins;
        };
    };

};
