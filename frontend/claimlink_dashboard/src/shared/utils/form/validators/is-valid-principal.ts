import { Principal } from "@dfinity/principal";

/**
 * Validates that a string is a valid Internet Computer Principal ID
 * @param value - The principal ID string to validate
 * @returns Error message if validation fails, undefined if valid
 */
export function isValidPrincipal(value: string | undefined): string | undefined {
  if (!value || value.trim() === "") {
    return "Principal ID is required";
  }

  try {
    // Attempt to parse the principal - will throw if invalid
    Principal.fromText(value.trim());
    return undefined;
  } catch (_error) {
    return "Invalid Principal ID format";
  }
}

/**
 * Validates that a principal ID is valid (optional version)
 * Returns undefined for empty values, allowing for optional fields
 * @param value - The principal ID string to validate
 * @returns Error message if validation fails, undefined if valid or empty
 */
export function isValidPrincipalOptional(
  value: string | undefined
): string | undefined {
  if (!value || value.trim() === "") {
    return undefined;
  }

  try {
    Principal.fromText(value.trim());
    return undefined;
  } catch (_error) {
    return "Invalid Principal ID format";
  }
}
