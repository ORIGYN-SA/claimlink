/**
 * Number utility functions
 * Created to resolve import errors during build
 */

/**
 * Converts a bigint value to a human-readable number with decimals
 */
export const formatTokenAmount = (amount: bigint, decimals: number): number => {
  return Number(amount) / Math.pow(10, decimals);
};

/**
 * Converts a human-readable number to bigint with decimals
 */
export const parseTokenAmount = (amount: number, decimals: number): bigint => {
  return BigInt(Math.floor(amount * Math.pow(10, decimals)));
};

/**
 * Formats a number with thousands separators
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Divides a bigint by 1e8 (commonly used for token amounts with 8 decimals)
 */
export const divideBy1e8 = (
  number: number | bigint | string | (() => bigint),
) => Number(number) / 1e8;

/**
 * Converts a number to locale string with default formatting
 */
export const numberToLocaleString = ({
  value,
  decimals = 3,
  locale = "en-US",
}: {
  value: number;
  decimals?: number;
  locale?: string;
}) => {
  if (value === 0) return "0";
  return value.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

/**
 * Rounds a number and formats it with locale string
 */
interface roundAndFormatLocaleParams {
  number: number;
  locale?: string;
  decimals?: number;
}

export const roundAndFormatLocale = ({
  number,
  locale = "en-US",
  decimals = 3,
}: roundAndFormatLocaleParams) => {
  return Number(number.toFixed(decimals)).toLocaleString(locale);
};
