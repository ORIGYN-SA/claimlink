import Nat "mo:base/Nat";
import Nat16 "mo:base/Nat16";
import Nat64 "mo:base/Nat64";
import List "mo:base/List";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Types "./Types";
import Cycles "mo:base/ExperimentalCycles";
import Time "mo:base/Time";
import Debug "mo:base/Debug";

shared actor class Dip721NFT(custodian: Principal, init : Types.Dip721NonFungibleToken) = Self {
  stable var transactionId: Types.TransactionId = 0;
  stable var nfts = List.nil<Types.Nft>();
  stable var custodians = List.make<Principal>(custodian);
  stable var logo : Types.LogoResult = init.logo;
  stable var name : Text = init.name;  
  stable var symbol : Text = init.symbol;
  stable var maxLimit : Nat16 = init.maxLimit;
  stable var banner : Types.LogoResult = init.banner;
  stable var description : Text = init.description;
  stable var created_at : Time.Time = init.created_at;
  stable var featured : Bool = init.featured;
  private stable var capacity = 1000000000000000000;
  private stable var balance = Cycles.balance();

  // https://forum.dfinity.org/t/is-there-any-address-0-equivalent-at-dfinity-motoko/5445/3
  let null_address : Principal = Principal.fromText("aaaaa-aa");

  public query func balanceOfDip721(user: Principal) : async Nat64 {
    return Nat64.fromNat(
      List.size(
        List.filter(nfts, func(token: Types.Nft) : Bool { token.owner == user })
      )
    );
  };

  public shared ({caller}) func addcustodians(custodian: Principal) : async Result.Result<Types.AddCustodian,Types.AddCustodianError> {
    Debug.print("Caller" # debug_show( caller));
    if (not List.some(custodians, func (c : Principal) : Bool { c == caller })) {
      return #err(#Unauthorized);
    } else if (List.some(custodians, func (c : Principal) : Bool { c == custodian })) {
      return #err(#AlreadyCustodian);
    } else {
      custodians := List.push(custodian, custodians);
      return #ok(#CustodianAdded);
    };
  };

  public query func ownerOfDip721(token_id: Types.TokenId) : async Types.OwnerResult {
    let item = List.find(nfts, func(token: Types.Nft) : Bool { token.id == token_id });
    switch (item) {
      case (null) {
        return #Err(#InvalidTokenId);
      };
      case (?token) {
        return #Ok(token.owner);
      };
    };
  };

  public shared({ caller }) func safeTransferFromDip721(from: Principal, to: Principal, token_id: Types.TokenId) : async Types.TxReceipt {  
    if (to == null_address) {
      return #Err(#ZeroAddress);
    } else {
      return transferFrom(from, to, token_id, caller);
    };
  };

  public shared({ caller }) func transferFromDip721(from: Principal, to: Principal, token_id: Types.TokenId) : async Types.TxReceipt {
    return transferFrom(from, to, token_id, caller);
  };

  func transferFrom(from: Principal, to: Principal, token_id: Types.TokenId, caller: Principal) : Types.TxReceipt {
    let item = List.find(nfts, func(token: Types.Nft) : Bool { token.id == token_id });
    switch (item) {
      case null {
        return #Err(#InvalidTokenId);
      };
      case (?token) {
        if (
          caller != token.owner and
          not List.some(custodians, func (custodian : Principal) : Bool { custodian == caller })
        ) {
          return #Err(#Unauthorized);
        } else if (Principal.notEqual(from, token.owner)) {
          return #Err(#Other);
        } else {
          nfts := List.map(nfts, func (item : Types.Nft) : Types.Nft {
            if (item.id == token.id) {
              let update : Types.Nft = {
                owner = to;
                id = item.id;
                metadata = token.metadata;
                locked = true;
                forsale = false;
                listed = true;
                priceinusd = item.priceinusd;
                logo = item.logo;
              };
              return update;
            } else {
              return item;
            };
          });
          transactionId += 1;
          return #Ok(transactionId);   
        };
      };
    };
  };

  public query func supportedInterfacesDip721() : async [Types.InterfaceId] {
    return [#TransferNotification, #Burn, #Mint];
  };

  public query func logoDip721() : async Types.LogoResult {
    return logo;
  };

  public query func nameDip721() : async Text {
    return name;
  };

  public query func symbolDip721() : async Text {
    return symbol;
  };

  public query func totalSupplyDip721() : async Nat64 {
    return Nat64.fromNat(
      List.size(nfts)
    );
  };

  public query func bannerDip721() : async Types.LogoResult {
    return banner;
  };

  public query func descriptionDip721() : async Text {
    return description;
  };

  public query func createdAtDip721() : async Time.Time {
    return created_at;
  };

  public query func featuredDip721() : async Bool {
    return featured;
  };

  public query func getDIP721details() : async Types.Dip721NonFungibleToken {
    return {
      logo = logo;
      name = name;
      symbol = symbol;
      maxLimit = maxLimit;
      banner = banner;
      description = description;
      created_at = created_at;
      featured = featured;
    };
  };

  public query func getMetadataDip721(token_id: Types.TokenId) : async Types.MetadataResult {
    let item = List.find(nfts, func(token: Types.Nft) : Bool { token.id == token_id });
    switch (item) {
      case null {
        return #Err(#InvalidTokenId);
      };
      case (?token) {
        return #Ok(token.metadata);
      }
    };
  };

  public query func getNFT(token_id: Types.TokenId) : async Types.NftResult {
    let item = List.find(nfts, func(token: Types.Nft) : Bool { token.id == token_id });
    switch (item) {
      case null {
        return #Err( #NoNftFound);
      };
      case (?token) {
        return #Ok(token);
      }
    };
  };

  public query func getMaxLimitDip721() : async Nat16 {
    return maxLimit;
  };

  public func getMetadataForUserDip721(user: Principal) : async Types.ExtendedMetadataResult {
    let item = List.find(nfts, func(token: Types.Nft) : Bool { token.owner == user });
    switch (item) {
      case null {
        return #Err(#Other);
      };
      case (?token) {
        return #Ok({
          metadata_desc = token.metadata;
          token_id = token.id;
        });
      }
    };
  };

  public query func getTokenIdsForUserDip721(user: Principal) : async [Types.TokenId] {
    let items = List.filter(nfts, func(token: Types.Nft) : Bool { token.owner == user });
    let tokenIds = List.map(items, func (item : Types.Nft) : Types.TokenId { item.id });
    return List.toArray(tokenIds);
  };

  public query func getallNFT() : async [Types.Nft] {
    return List.toArray(nfts);
  };

  public shared func mintDip721(to: Principal, metadata: Types.MetadataDesc , priceinusd : Float, logo : Types.LogoResult) : async Types.MintReceipt {
    if (not List.some(custodians, func (custodian : Principal) : Bool { custodian == to })) {
      return #Err(#Unauthorized);
    };

    let newId = Nat64.fromNat(List.size(nfts));
    let nft : Types.Nft = {
      owner = to;
      id = newId;
      metadata = metadata;
      locked = true;
      forsale = false;
      listed = true;
      priceinusd = priceinusd;
      logo = logo;
    };
    nfts := List.push(nft, nfts);
    transactionId += 1;
    return #Ok({
      token_id = newId;
      id = transactionId;
    });
  };


  public shared ({caller}) func lockDip721(token_id: Types.TokenId) : async Result.Result<Types.Locktoken,Types.LockTokenError> {
    let item = List.find(nfts, func(token: Types.Nft) : Bool { token.id == token_id });
    switch (item) {
      case null {
        return #err(#InvalidTokenId);
      };
      case (?token) {
        if (caller != token.owner) {
          return #err(#Unauthorized);
        } else if (token.locked) {
          return #err(#AlreadyLocked);
        } else {
          nfts := List.map(nfts, func (item : Types.Nft) : Types.Nft {
            if (item.id == token.id) {
              let update : Types.Nft = {
                owner = item.owner;
                id = item.id;
                metadata = item.metadata;
                locked = true;
                forsale = item.forsale;
                listed = item.listed;
                priceinusd = item.priceinusd;
                logo = item.logo;
              };
              return update;
            } else {
              return item;
            };
          });
          transactionId += 1;
          return #ok(#LockedSuccessfully);
        };
      };
    };
  };

  public shared ({caller}) func unlockDip721(token_id: Types.TokenId) : async Result.Result<Types.Unlocktoken,Types.UnlockTokenError> {
    let item = List.find(nfts, func(token: Types.Nft) : Bool { token.id == token_id });
    switch (item) {
      case null {
        return #err(#InvalidTokenId);
      };
      case (?token) {
        if (caller != token.owner) {
          return #err(#Unauthorized);
        } else if (not token.locked) {
          return #err(#AlreadyUnlocked);
        } else {
          nfts := List.map(nfts, func (item : Types.Nft) : Types.Nft {
            if (item.id == token.id) {
              let update : Types.Nft = {
                owner = item.owner;
                id = item.id;
                metadata = item.metadata;
                locked = false;
                forsale = item.forsale;
                listed = item.listed;
                priceinusd = item.priceinusd;
                logo = item.logo;
              };
              return update;
            } else {
              return item;
            };
          });
          transactionId += 1;
          return #ok(#UnlockedSuccessfully);
        };
      };
    };
  };

 public func wallet_receive() : async { accepted: Nat64 } {
    let amount = Cycles.available();
    let limit : Nat = capacity - balance;
    let accepted = 
        if (amount <= limit) amount
        else limit;
    let deposit = Cycles.accept(accepted);
    assert (deposit == accepted);
    balance += accepted;
    { accepted = Nat64.fromNat(accepted) };
};  
  
  public shared({caller}) func wallet_balance() : async Nat {
    return balance
};
  public query func getCanisterId() : async Principal {
    return Principal.fromActor(Self);
  };

  public query func showcustodians() : async [Principal] {
    return List.toArray(custodians);
  };
}