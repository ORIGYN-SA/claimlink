/**
 * Shared Canister Infrastructure
 *
 * Centralized utilities for ICP canister interactions:
 * - Canister ID configuration
 * - Actor factory
 * - Retry utilities
 *
 * @example
 * ```typescript
 * import {
 *   createCanisterActor,
 *   getCanisterId,
 *   retryWithBackoff
 * } from '@/shared/canister';
 *
 * const actor = createCanisterActor<_SERVICE>(
 *   agent,
 *   getCanisterId('claimlink'),
 *   idlFactory
 * );
 *
 * const result = await retryWithBackoff(
 *   () => actor.create_collection(args),
 *   { operationName: 'Create collection' }
 * );
 * ```
 */

// Canister configuration
export {
  CANISTER_IDS,
  getCanisterId,
  getCanisterIdOptional,
  isCanisterConfigured,
  IC_HOST,
  APP_MODE,
  type CanisterName,
} from './canister-config';

// Actor factory
export {
  createCanisterActor,
  createNamedCanisterActor,
} from './actor-factory';

// Retry utilities
export {
  retryWithBackoff,
  retryWithFixedDelay,
  type RetryOptions,
} from './retry';
