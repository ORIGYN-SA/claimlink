/**
 * Actor Factory
 *
 * Centralized actor creation for ICP canister interactions.
 * Eliminates duplicate Actor.createActor calls across services.
 */

import { Actor, type Agent } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

/**
 * Create a canister actor with type safety
 *
 * @param agent - IC agent (authenticated or anonymous)
 * @param canisterId - Target canister ID
 * @param idlFactory - Candid interface factory
 * @returns Typed actor instance
 * @throws Error if canisterId is empty
 *
 * @example
 * ```typescript
 * import { idlFactory } from '@canisters/claimlink';
 * import type { _SERVICE } from '@canisters/claimlink';
 *
 * const actor = createCanisterActor<_SERVICE>(agent, canisterId, idlFactory);
 * const result = await actor.list_my_collections({});
 * ```
 */
export function createCanisterActor<T>(
  agent: Agent,
  canisterId: string,
  idlFactory: IDL.InterfaceFactory
): T {
  if (!canisterId) {
    throw new Error('Canister ID is required to create actor');
  }

  return Actor.createActor<T>(idlFactory, {
    agent,
    canisterId,
  });
}

/**
 * Create a canister actor with validation for named canisters
 *
 * @param agent - IC agent
 * @param canisterName - Logical name of the canister
 * @param canisterId - Target canister ID
 * @param idlFactory - Candid interface factory
 * @returns Typed actor instance
 * @throws Error with descriptive message if canisterId is empty
 */
export function createNamedCanisterActor<T>(
  agent: Agent,
  canisterName: string,
  canisterId: string,
  idlFactory: IDL.InterfaceFactory
): T {
  if (!canisterId) {
    throw new Error(
      `${canisterName} canister ID is not configured. ` +
        `Check your environment variables.`
    );
  }

  return Actor.createActor<T>(idlFactory, {
    agent,
    canisterId,
  });
}
