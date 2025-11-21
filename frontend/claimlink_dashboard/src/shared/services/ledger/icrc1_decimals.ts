import { Actor } from "@dfinity/agent";

const icrc1_decimals = async (actor: Actor): Promise<number> => {
  const result = await actor.icrc1_decimals();
  return Number(result);
};

export default icrc1_decimals;
