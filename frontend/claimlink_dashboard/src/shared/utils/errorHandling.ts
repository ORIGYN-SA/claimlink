export class LedgerError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: Error | unknown
  ) {
    super(message);
    this.name = 'LedgerError';
  }
}

export const handleLedgerError = (error: Error | unknown): LedgerError => {
  const errorMessage = error instanceof Error ? error.message : String(error);

  // Network errors
  if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
    return new LedgerError(
      'Network error. Please check your connection and try again.',
      'NETWORK_ERROR',
      error
    );
  }

  // Agent/Authentication errors
  if (errorMessage.includes('unauthorized') || errorMessage.includes('not authorized')) {
    return new LedgerError(
      'Authentication failed. Please reconnect your wallet.',
      'AUTH_ERROR',
      error
    );
  }

  // Canister errors
  if (errorMessage.includes('canister') || errorMessage.includes('not found')) {
    return new LedgerError(
      'Token ledger unavailable. Please try again later.',
      'CANISTER_ERROR',
      error
    );
  }

  // Insufficient funds
  if (errorMessage.includes('insufficient') || errorMessage.includes('balance')) {
    return new LedgerError(
      'Insufficient balance for this operation.',
      'INSUFFICIENT_FUNDS',
      error
    );
  }

  // Principal/ID errors
  if (errorMessage.includes('principal') || errorMessage.includes('invalid')) {
    return new LedgerError(
      'Invalid account or principal ID.',
      'INVALID_PRINCIPAL',
      error
    );
  }

  // Timeout errors
  if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
    return new LedgerError(
      'Request timed out. Please try again.',
      'TIMEOUT_ERROR',
      error
    );
  }

  // Generic fallback
  return new LedgerError(
    'An unexpected error occurred. Please try again.',
    'UNKNOWN_ERROR',
    error
  );
};

export const isRetryableError = (error: Error | unknown): boolean => {
  const ledgerError = handleLedgerError(error);

  // Retry network and timeout errors
  if (ledgerError.code === 'NETWORK_ERROR' || ledgerError.code === 'TIMEOUT_ERROR') {
    return true;
  }

  // Retry canister errors (might be temporary)
  if (ledgerError.code === 'CANISTER_ERROR') {
    return true;
  }

  // Don't retry auth or validation errors
  return false;
};

export const getRetryDelay = (attemptIndex: number, error: Error | unknown): number => {
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds
  const exponentialDelay = baseDelay * Math.pow(2, attemptIndex);
  const jitter = Math.random() * 1000; // Add up to 1 second of jitter

  if (isRetryableError(error)) {
    return Math.min(exponentialDelay + jitter, maxDelay);
  }

  return 0; // Don't retry
};
