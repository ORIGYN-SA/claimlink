/**
 * Prevents non-numeric characters from being entered in an input
 * Allows digits, one decimal point, and negative sign at the start
 * @param event - The keyboard event
 */
export function preventNonNumeric(
  event: React.KeyboardEvent<HTMLInputElement>
): void {
  const key = event.key;
  const value = event.currentTarget.value;

  // Allow control keys
  if (
    key === "Backspace" ||
    key === "Delete" ||
    key === "Tab" ||
    key === "Escape" ||
    key === "Enter" ||
    key === "ArrowLeft" ||
    key === "ArrowRight" ||
    key === "ArrowUp" ||
    key === "ArrowDown" ||
    (event.ctrlKey && (key === "a" || key === "c" || key === "v" || key === "x"))
  ) {
    return;
  }

  // Allow digits
  if (key >= "0" && key <= "9") {
    return;
  }

  // Allow decimal point if not already present
  if (key === "." && !value.includes(".")) {
    return;
  }

  // Allow negative sign only at the start
  if (key === "-" && value.length === 0) {
    return;
  }

  // Prevent all other keys
  event.preventDefault();
}

/**
 * Prevents non-numeric characters (integers only)
 * Only allows digits, no decimal points or negative signs
 * @param event - The keyboard event
 */
export function preventNonInteger(
  event: React.KeyboardEvent<HTMLInputElement>
): void {
  const key = event.key;

  // Allow control keys
  if (
    key === "Backspace" ||
    key === "Delete" ||
    key === "Tab" ||
    key === "Escape" ||
    key === "Enter" ||
    key === "ArrowLeft" ||
    key === "ArrowRight" ||
    key === "ArrowUp" ||
    key === "ArrowDown" ||
    (event.ctrlKey && (key === "a" || key === "c" || key === "v" || key === "x"))
  ) {
    return;
  }

  // Allow digits only
  if (key >= "0" && key <= "9") {
    return;
  }

  // Prevent all other keys
  event.preventDefault();
}

/**
 * Prevents non-numeric characters (positive numbers only)
 * Allows digits and one decimal point, no negative signs
 * @param event - The keyboard event
 */
export function preventNonPositiveNumeric(
  event: React.KeyboardEvent<HTMLInputElement>
): void {
  const key = event.key;
  const value = event.currentTarget.value;

  // Allow control keys
  if (
    key === "Backspace" ||
    key === "Delete" ||
    key === "Tab" ||
    key === "Escape" ||
    key === "Enter" ||
    key === "ArrowLeft" ||
    key === "ArrowRight" ||
    key === "ArrowUp" ||
    key === "ArrowDown" ||
    (event.ctrlKey && (key === "a" || key === "c" || key === "v" || key === "x"))
  ) {
    return;
  }

  // Allow digits
  if (key >= "0" && key <= "9") {
    return;
  }

  // Allow decimal point if not already present
  if (key === "." && !value.includes(".")) {
    return;
  }

  // Prevent all other keys
  event.preventDefault();
}
