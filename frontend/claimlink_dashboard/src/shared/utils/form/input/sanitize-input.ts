/**
 * Sanitizes a string input by removing leading/trailing whitespace
 * and optionally removing all whitespace
 * @param value - The input value to sanitize
 * @param removeAllWhitespace - Whether to remove all whitespace (default: false)
 * @returns The sanitized string
 */
export function sanitizeString(
  value: string,
  removeAllWhitespace = false
): string {
  if (removeAllWhitespace) {
    return value.replace(/\s+/g, "");
  }
  return value.trim();
}

/**
 * Sanitizes a numeric input by removing non-numeric characters
 * @param value - The input value to sanitize
 * @param allowDecimal - Whether to allow decimal points (default: true)
 * @param allowNegative - Whether to allow negative signs (default: true)
 * @returns The sanitized numeric string
 */
export function sanitizeNumeric(
  value: string,
  allowDecimal = true,
  allowNegative = true
): string {
  let sanitized = value;

  // Remove all non-numeric characters except decimal and negative
  if (allowDecimal && allowNegative) {
    sanitized = sanitized.replace(/[^0-9.-]/g, "");
  } else if (allowDecimal) {
    sanitized = sanitized.replace(/[^0-9.]/g, "");
  } else if (allowNegative) {
    sanitized = sanitized.replace(/[^0-9-]/g, "");
  } else {
    sanitized = sanitized.replace(/[^0-9]/g, "");
  }

  // Ensure only one decimal point
  if (allowDecimal) {
    const parts = sanitized.split(".");
    if (parts.length > 2) {
      sanitized = parts[0] + "." + parts.slice(1).join("");
    }
  }

  // Ensure negative sign only at the start
  if (allowNegative) {
    const hasNegative = sanitized.startsWith("-");
    sanitized = sanitized.replace(/-/g, "");
    if (hasNegative) {
      sanitized = "-" + sanitized;
    }
  }

  return sanitized;
}

/**
 * Sanitizes an email input by removing whitespace and converting to lowercase
 * @param value - The email input value to sanitize
 * @returns The sanitized email string
 */
export function sanitizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Sanitizes a Principal ID input by removing whitespace
 * @param value - The Principal ID input value to sanitize
 * @returns The sanitized Principal ID string
 */
export function sanitizePrincipal(value: string): string {
  return value.replace(/\s+/g, "");
}

/**
 * Limits the length of an input string
 * @param value - The input value to limit
 * @param maxLength - The maximum allowed length
 * @returns The truncated string
 */
export function limitLength(value: string, maxLength: number): string {
  return value.slice(0, maxLength);
}

/**
 * Sanitizes a URL input by removing whitespace and ensuring protocol
 * @param value - The URL input value to sanitize
 * @param ensureProtocol - Whether to add https:// if missing (default: true)
 * @returns The sanitized URL string
 */
export function sanitizeUrl(value: string, ensureProtocol = true): string {
  let sanitized = value.trim();

  if (ensureProtocol && sanitized && !sanitized.match(/^https?:\/\//i)) {
    sanitized = "https://" + sanitized;
  }

  return sanitized;
}
