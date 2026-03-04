/**
 * Validates that an amount is greater than zero
 * @param value - The value to validate (can be string or number)
 * @returns Error message if validation fails, undefined if valid
 */
export function isAmountGreaterThanZero(
  value: string | number | undefined
): string | undefined {
  if (value === undefined || value === null || value === "") {
    return "Amount is required";
  }

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return "Please enter a valid number";
  }

  if (numValue <= 0) {
    return "Amount must be greater than zero";
  }

  return undefined;
}
