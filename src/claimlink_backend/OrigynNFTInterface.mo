// https://github.com/ORIGYN-SA/nft/tree/master/src/core_nft
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Blob "mo:base/Blob";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";
import Bool "mo:base/Bool";
import Nat32 "mo:base/Nat32";

module OrigynNFTInterface {

    public type Account = { owner : Principal; subaccount : ?Blob };
    public type TokenId = Nat;
    public type BuildVersion = { major : Nat32; minor : Nat32; patch : Nat32 };
    
    public type Permission = {
        #UpdateMetadata;
        #Minting;
        #UpdateCollectionMetadata;
        #UpdateUploads;
        #ManageAuthorities;
        #ReadUploads;
    };
    
    public type PermissionManager = {
        user_permissions : [(Principal, [Permission])];
    };
    
    public type InitApprovalsArg = {
        max_approvals_per_token_or_collection : ?Nat;
        max_revoke_approvals : ?Nat;
    };

    public type InitArgs = {
        permissions : PermissionManager;
        supply_cap : ?Nat;
        tx_window : ?Nat;
        test_mode : Bool;
        default_take_value : ?Nat;
        max_canister_storage_threshold : ?Nat;
        logo : ?Text;
        permitted_drift : ?Nat;
        name : Text;
        description : ?Text;
        version : BuildVersion;
        max_take_value : ?Nat;
        max_update_batch_size : ?Nat;
        max_query_batch_size : ?Nat;
        commit_hash : Text;
        max_memo_size : ?Nat;
        atomic_batch_transfers : ?Bool;
        collection_metadata : [(Text, CustomValue)];
        symbol : Text;
        approval_init : InitApprovalsArg;
    };

    public type TokenMetadata = {
        name : Text;
        description : Text;
        image : ?Text;
        attributes : ?[Attribute];
    };
    
    public type Attribute = {
        trait_type : Text;
        value : Text;
    };

    public type MintRequest = {
        to : Account;
        metadata : TokenMetadata;
    };
    
    public type TransferRequest = {
        from : Account;
        to : Account;
        token_id : TokenId;
        memo : ?Blob;
        created_at_time : ?Nat64;
    };

    public type CustomValue = {
        #Int : Int;
        #Map : [(Text, CustomValue)];
        #Nat : Nat;
        #Blob : Blob;
        #Text : Text;
        #Array : [CustomValue];
    };

    public type UpdateCollectionMetadataArgs = {
        supply_cap : ?Nat;
        tx_window : ?Nat;
        default_take_value : ?Nat;
        max_canister_storage_threshold : ?Nat;
        logo : ?Text;
        permitted_drift : ?Nat;
        name : ?Text;
        description : ?Text;
        max_take_value : ?Nat;
        max_update_batch_size : ?Nat;
        max_query_batch_size : ?Nat;
        max_memo_size : ?Nat;
        atomic_batch_transfers : ?Bool;
        collection_metadata : ?[(Text, CustomValue)];
        symbol : ?Text;
    };

    public type UpdateCollectionMetadataError = {
        #StorageCanisterError : Text;
        #ConcurrentManagementCall;
    };

    public type UpdateCollectionMetadataResult = Result.Result<(), UpdateCollectionMetadataError>;

    public type TransferResponse = Result.Result<Nat64, TransferError>;
    public type TransferError = {
        #GenericError : { message : Text; error_code : Nat };
        #TemporarilyUnavailable;
        #InsufficientFunds : { balance : Nat };
        #BadBurn : { min_burn_amount : Nat };
        #Duplicate : { duplicate_of : Nat };
        #BadFee : { expected_fee : Nat };
        #CreatedInFuture : { ledger_time : Nat64 };
        #TooOld;
        #InsufficientAllowance : { allowance : Nat };
    };

    public type OrigynNFTCanister = actor {
        update_collection_metadata : (args : UpdateCollectionMetadataArgs) -> async UpdateCollectionMetadataResult;
    };
};
