import type { IDL } from '@dfinity/candid';

export const idlFactory: IDL.InterfaceFactory;
export const init: (args: { IDL: typeof IDL }) => IDL.Type[];
