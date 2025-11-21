import { Actor } from "@dfinity/agent";

const icrc1_fee = async (actor: Actor): Promise<bigint> => {
  const result = await actor.icrc1_fee();
  return result;
};

export default icrc1_fee;
