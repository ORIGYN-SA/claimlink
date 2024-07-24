import ExtTokenClass "../extv2/ext_v2/v2";
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Text "mo:base/Text";


actor Main{
    public shared ({caller = user}) func createExtCollection(): async Principal {
        Cycles.add<system>(500_500_000_000);
        let extToken = await ExtTokenClass.EXTNFT(Principal.fromActor(Main));
        let extCanisterId = await extToken.getCanisterId();
        extCanisterId


    }
}