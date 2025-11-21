import { Actor } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

export const icrc1_balance_of = async ({
  actor,
  owner,
}: {
  actor: Actor;
  owner: string;
}): Promise<bigint> => {
  const ownerPrincipal = Principal.fromText(owner);
  const result = await actor.icrc1_balance_of({
    owner: ownerPrincipal,
    subaccount: [], // Optional: specify subaccount
  });
  return result;
};
