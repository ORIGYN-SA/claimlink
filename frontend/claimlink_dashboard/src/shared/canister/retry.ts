/**
 * Retry Utilities
 *
 * Shared retry logic with exponential backoff for IC canister operations.
 * Extracted from certificates.service.ts for reuse across services.
 */

export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Name of the operation for logging (default: 'Operation') */
  operationName?: string;
  /** Initial delay in ms before first retry (default: 1000) */
  initialDelayMs?: number;
  /** Multiplier for exponential backoff (default: 2) */
  backoffMultiplier?: number;
  /** Whether to log retry attempts (default: true) */
  logRetries?: boolean;
}

/**
 * Retry an async operation with exponential backoff
 *
 * @param operation - Async function to retry
 * @param options - Retry configuration
 * @returns Result of the operation
 * @throws Error after all retries exhausted
 *
 * @example
 * ```typescript
 * const result = await retryWithBackoff(
 *   () => actor.mint(request),
 *   { operationName: 'Mint certificate', maxRetries: 3 }
 * );
 * ```
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const {
    maxRetries = 3,
    operationName = 'Operation',
    initialDelayMs = 1000,
    backoffMultiplier = 2,
    logRetries = true,
  } = options ?? {};

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        const delay = initialDelayMs * Math.pow(backoffMultiplier, attempt);

        if (logRetries) {
          console.warn(
            `${operationName} failed (attempt ${attempt + 1}/${maxRetries + 1}), ` +
              `retrying in ${delay}ms...`,
            lastError.message
          );
        }

        await sleep(delay);
      }
    }
  }

  throw new Error(
    `${operationName} failed after ${maxRetries + 1} attempts: ${lastError?.message}`
  );
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry with a simple fixed delay (no exponential backoff)
 *
 * @param operation - Async function to retry
 * @param maxRetries - Number of retries
 * @param delayMs - Fixed delay between retries
 * @param operationName - Name for logging
 */
export async function retryWithFixedDelay<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
  operationName: string = 'Operation'
): Promise<T> {
  return retryWithBackoff(operation, {
    maxRetries,
    operationName,
    initialDelayMs: delayMs,
    backoffMultiplier: 1, // Fixed delay = multiplier of 1
  });
}
