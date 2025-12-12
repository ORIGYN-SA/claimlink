/**
 * Date Formatting Utilities
 *
 * Handles date formatting for certificate display.
 * Supports timestamps (milliseconds) and ISO date strings.
 */

/**
 * Format a timestamp to a localized date string
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @param locale - Locale for formatting (default: browser locale)
 * @returns Formatted date string
 */
export function formatTimestamp(
  timestamp: number,
  locale?: string
): string {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      console.warn('formatTimestamp: invalid timestamp', timestamp);
      return '';
    }
    return date.toLocaleDateString(locale || navigator.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('formatTimestamp error:', error);
    return '';
  }
}

/**
 * Format an ISO date string to a localized date string
 *
 * @param isoDate - ISO date string (e.g., "2024-01-15")
 * @param locale - Locale for formatting (default: browser locale)
 * @returns Formatted date string
 */
export function formatDateString(
  isoDate: string,
  locale?: string
): string {
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
      console.warn('formatDateString: invalid date', isoDate);
      return isoDate; // Return original if invalid
    }
    return date.toLocaleDateString(locale || navigator.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('formatDateString error:', error);
    return isoDate;
  }
}

/**
 * Format a date value from ORIGYN metadata
 *
 * Handles both timestamp (number) and ISO string formats.
 *
 * @param value - Timestamp (milliseconds) or ISO date string
 * @param locale - Locale for formatting
 * @returns Formatted date string
 */
export function formatMetadataDate(
  value: number | string | undefined,
  locale?: string
): string {
  if (value === undefined || value === null) {
    return '';
  }

  // Handle timestamp (number)
  if (typeof value === 'number') {
    return formatTimestamp(value, locale);
  }

  // Handle string (could be timestamp as string or ISO date)
  if (typeof value === 'string') {
    // Check if it's a numeric string (timestamp)
    const numValue = Number(value);
    if (!isNaN(numValue) && value.length > 8) {
      return formatTimestamp(numValue, locale);
    }
    // Otherwise treat as ISO date string
    return formatDateString(value, locale);
  }

  return '';
}

/**
 * Parse a date from ORIGYN metadata content
 *
 * @param content - Content object which may contain { date: timestamp }
 * @returns Date object or null
 */
export function parseDateContent(
  content: { date?: number } | string | undefined
): Date | null {
  if (!content) return null;

  // Handle { date: timestamp } format
  if (typeof content === 'object' && 'date' in content && content.date) {
    const date = new Date(content.date);
    return isNaN(date.getTime()) ? null : date;
  }

  // Handle string format
  if (typeof content === 'string') {
    const date = new Date(content);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
}

/**
 * Get relative time description (e.g., "2 days ago", "in 3 months")
 *
 * @param date - Date to compare
 * @param locale - Locale for formatting
 * @returns Relative time string
 */
export function getRelativeTime(
  date: Date,
  locale?: string
): string {
  try {
    const rtf = new Intl.RelativeTimeFormat(locale || navigator.language, {
      numeric: 'auto',
    });

    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (Math.abs(diffDays) < 1) {
      return rtf.format(0, 'day');
    } else if (Math.abs(diffDays) < 30) {
      return rtf.format(diffDays, 'day');
    } else if (Math.abs(diffDays) < 365) {
      return rtf.format(Math.round(diffDays / 30), 'month');
    } else {
      return rtf.format(Math.round(diffDays / 365), 'year');
    }
  } catch (error) {
    // Fallback if Intl.RelativeTimeFormat not supported
    return formatTimestamp(date.getTime(), locale);
  }
}

/**
 * Check if a date is expired (in the past)
 */
export function isExpired(date: Date): boolean {
  return date.getTime() < Date.now();
}

/**
 * Check if a date is expiring soon (within 30 days)
 */
export function isExpiringSoon(date: Date, daysThreshold = 30): boolean {
  const thresholdMs = daysThreshold * 24 * 60 * 60 * 1000;
  const diff = date.getTime() - Date.now();
  return diff > 0 && diff < thresholdMs;
}
