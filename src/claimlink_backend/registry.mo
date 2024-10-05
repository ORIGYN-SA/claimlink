import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Array "mo:base/Array";
actor class CanisterRegistry(owner : Principal){
    
    // Define operation error types
    public type OperationError = {
        #NotAuthorized;
        #BadParameters;
        #NonExistentItem;
        #Unknown : Text;
    };

    // Define a detail value type
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

    // Define a struct for AddCanisterInput
    public type AddCanisterInput = {
        name: Text;
        description: Text;
        thumbnail: Text;
        frontend: ?Text;
        principal_id: Principal;
        details: [(Text, DetailValue)];
    };

    // Define a struct for CanisterMetadata
    public type CanisterMetadata = {
        name: Text;
        description: Text;
        thumbnail: Text;
        frontend: ?Text;
        principal_id: Principal;
        submitter: Principal;
        last_updated_by: Principal;
        last_updated_at: Time.Time;
        details: [(Text, DetailValue)];
    };

    // Constants for name and description length limits
    let DESCRIPTION_LIMIT: Nat = 1200;
    let NAME_LIMIT: Nat = 24;

    // Define the Admins structure
    stable var admins: [Principal] = [owner];

    // CanisterDB (equivalent to the Rust HashMap)
    stable var canisterDB: [(Principal, CanisterMetadata)] = [];

    public query func owners() : async [Principal]{
        admins
    };

    // Utility function to check if a given principal is an admin
    public func isAdmin(account: Principal): async Bool {
        return switch (Array.find<Principal>(admins, func (admin: Principal): Bool {
            return admin == account;
        })) {
            case (?_) true;
            case null false;
        };
    };

    // Add a new admin (must be done by an existing admin)
    public shared (msg) func add_admin(new_admin: Principal): async Result.Result<(), OperationError> {
        let caller = msg.caller;
        if (await isAdmin(caller)) {
            admins := Array.append(admins, [new_admin]);
            return #ok(());
        } else {
            return #err(#NotAuthorized);
        };
    };

    // Remove an admin (must be done by an existing admin)
    public shared (msg) func remove_admin(admin: Principal): async Result.Result<(), OperationError> {
        let caller = msg.caller;
        if (await isAdmin(caller)) {
            admins := Array.filter(admins, func (x: Principal): Bool {
                return x != admin;
            });
            return #ok(());
        } else {
            return #err(#NotAuthorized);
        };
    };

    // Function to add or update canister metadata in the registry
    public func add_canister(
        caller: Principal,
        metadata: AddCanisterInput,
        trusted_source: ?Principal
    ): async Result.Result<(), OperationError> {
        let source = switch (trusted_source) {
            case (?principal) principal;
            case null caller;
        };

        let existingEntry = Array.find(canisterDB, func ((id, _): (Principal, CanisterMetadata)): Bool {
            id == metadata.principal_id
        });

        switch (existingEntry) {
            case (?(_, existingMetadata)){
                let admin = await isAdmin(caller);
                if (existingMetadata.submitter == caller or admin) {
                    let updatedMetadata: CanisterMetadata = {
                        name = metadata.name;
                        description = metadata.description;
                        thumbnail = metadata.thumbnail;
                        frontend = metadata.frontend;
                        principal_id = metadata.principal_id;
                        submitter = existingMetadata.submitter;
                        last_updated_by = caller;
                        last_updated_at = Time.now();
                        details = metadata.details;
                    };
                    canisterDB := Array.filter(canisterDB, func ((id : Principal, _ : CanisterMetadata)): Bool { id != metadata.principal_id });
                    canisterDB := Array.append(canisterDB, [(metadata.principal_id, updatedMetadata)]);
                    return #ok(());
                } else {
                    return #err(#NotAuthorized);
                };
            };
            case null{
                let newMetadata: CanisterMetadata = {
                    name = metadata.name;
                    description = metadata.description;
                    thumbnail = metadata.thumbnail;
                    frontend = metadata.frontend;
                    principal_id = metadata.principal_id;
                    submitter = caller;
                    last_updated_by = caller;
                    last_updated_at = Time.now();
                    details = metadata.details;
                };
                canisterDB := Array.append(canisterDB, [(metadata.principal_id, newMetadata)]);
                return #ok(());
            };
        };
    };

    // Function to remove a canister
    public func remove_canister(
        caller: Principal,
        principal_id: Principal,
        trusted_source: ?Principal
    ): async Result.Result<(), OperationError> {
        let source = switch (trusted_source) {
            case (?principal) principal;
            case null caller;
        };

        let entry = Array.find(canisterDB, func ((id : Principal , _ : CanisterMetadata)): Bool { id == principal_id });

        switch (entry) {
            case (?(_, metadata)){
                let admin = await isAdmin(caller);
                if (metadata.submitter == caller or admin) {
                    canisterDB := Array.filter(canisterDB, func ((id : Principal, _ : CanisterMetadata)): Bool { id != principal_id });
                    return #ok(());
                } else {
                    return #err(#NotAuthorized);
                };
            };
            case null
                return #err(#NonExistentItem);
        };
    };

    // Query all canister metadata
    public query func get_all(): async [CanisterMetadata] {
        return Array.map(canisterDB, func ((_ : Principal, metadata : CanisterMetadata)): CanisterMetadata { metadata });
    };

    // Query specific canister metadata
    public query func get(canister: Principal): async ?CanisterMetadata {
        let entry = Array.find(canisterDB, func ((id : Principal, _ : CanisterMetadata)): Bool { id == canister });
        switch (entry) {
            case (?(_, metadata))
                return ?metadata;
            case null
                return null;
        };
    };


}