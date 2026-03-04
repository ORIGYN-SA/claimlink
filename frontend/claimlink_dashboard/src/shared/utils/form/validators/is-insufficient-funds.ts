/**
 * Validates that the user has sufficient funds for the requested amount
 * @param value - The requested amount (string or number)
 * @param availableBalance - The user's available balance
 * @returns Error message if validation fails, undefined if valid
 */
export function isInsufficientFunds(
  value: string | number | undefined,
  availableBalance: number
): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined; // Let required validator handle this
  }

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return undefined; // Let number validator handle this
  }

  if (numValue > availableBalance) {
    return `Insufficient funds. Available balance: ${availableBalance}`;
  }

  return undefined;
}
