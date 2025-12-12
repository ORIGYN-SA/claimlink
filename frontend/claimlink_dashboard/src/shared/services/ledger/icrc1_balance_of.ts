import { type ActorSubclass } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

export const icrc1_balance_of = async ({
  actor,
  owner,
}: {
  actor: ActorSubclass;
  owner: string;
}): Promise<bigint> => {
  const ownerPrincipal = Principal.fromText(owner);
  const result = (await actor.icrc1_balance_of({
    owner: ownerPrincipal,
    subaccount: [], // Optional: specify subaccount
  })) as bigint;
  return result;
};
