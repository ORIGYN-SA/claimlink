import { useMutation, useQueryClient } from "@tanstack/react-query";
import { decodeIcrcAccount } from "@dfinity/ledger-icrc";
import type { ActorSubclass } from "@dfinity/agent";
import { Actor, type Agent, HttpAgent } from "@dfinity/agent";
// @ts-expect-error: later will be fixed
import { idlFactory } from "../idlFactory";
// @ts-expect-error: later will be fixed
import { idlFactory as idlFactoryICP } from "../idlFactoryICP";
import type { Result } from "../interfaces/ledger";

const icrc1_transfer = async (
  actor: ActorSubclass,
  transferArgs: { amount: bigint; account: string; fee: bigint }
) => {
  const { amount, account } = transferArgs;
  const decodedAccount = decodeIcrcAccount(account);
  const owner = decodedAccount.owner;
  const subaccount = decodedAccount?.subaccount
    ? [decodedAccount.subaccount]
    : [];

  const result = await actor.icrc1_transfer({
    to: {
      owner,
      subaccount,
    },
    fee: [],
    memo: [],
    from_subaccount: [],
    created_at_time: [],
    amount: amount,
  });
  return result;
};

const send_dfx = async (
  actor: ActorSubclass,
  transferArgs: { amount: bigint; account: string; fee: bigint; memo?: bigint }
) => {
  const { amount, account, memo, fee } = transferArgs;
  const result = await actor.send_dfx({
    to: account,
    fee: {
      e8s: fee,
    },
    memo: memo ?? 0n,
    from_subaccount: [],
    created_at_time: [],
    amount: { e8s: amount },
  });
  return result;
};

const useTransfer = (
  canisterId: string,
  agent: Agent | HttpAgent | undefined,
  options: {
    ledger: string;
    is_principal_standard?: boolean;
  }
) => {
  const queryClient = useQueryClient();
  const { ledger, is_principal_standard = true } = options;
  return useMutation<bigint | undefined, Error, {
    amount: bigint;
    account: string;
    fee: bigint;
  }>({
    mutationFn: async ({
      amount,
      account,
      fee,
    }: {
      amount: bigint;
      account: string;
      fee: bigint;
    }) => {
      try {
        const actorLedger = Actor.createActor(idlFactory, {
          agent,
          canisterId,
        });

        const actorLedgerICP = Actor.createActor(idlFactoryICP, {
          agent,
          canisterId,
        });

        if (!is_principal_standard) {
          await send_dfx(actorLedgerICP, {
            amount,
            account,
            fee,
          });
          return undefined; // send_dfx doesn't return block index
        } else {
          const icrc1Transfer = (await icrc1_transfer(actorLedger, {
            amount,
            account,
            fee,
          })) as Result;
          if (
            Object.keys(icrc1Transfer)[0] === "Err" &&
            "Err" in icrc1Transfer
          ) {
            throw new Error(Object.keys(icrc1Transfer.Err).toString());
          }
          // Return the block index from Ok variant
          if ("Ok" in icrc1Transfer) {
            return icrc1Transfer.Ok;
          }
        }
      } catch (err) {
        console.error(err);
        throw new Error("Transfer error! Please retry later.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["FETCH_LEDGER_BALANCE", ledger],
      });
      queryClient.invalidateQueries({
        queryKey: ["FETCH_ACCOUNT_TRANSACTIONS", ledger],
      });
    },
  });
};

export default useTransfer;
