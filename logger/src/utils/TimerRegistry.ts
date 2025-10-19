const intervals = new Set<NodeJS.Timeout>();
const timeouts = new Set<NodeJS.Timeout>();

/**
 * Registers an interval and adds it to the internal set.
 * This is useful for tracking and managing intervals in the application.
 * @param id - The interval ID returned by `setInterval`.
 * @returns The registered interval ID.
 * @example
 * const intervalId = registerInterval(setInterval(() => console.log('Hello'), 1000));
 */
export function registerInterval(id: NodeJS.Timeout) {
  intervals.add(id);
  return id;
}

/**
 * Registers a timeout and adds it to the internal set.
 * This is useful for tracking and managing timeouts in the application.
 * @param id - The timeout ID returned by `setTimeout`.
 * @returns The registered timeout ID.
 * @example
 * const timeoutId = registerTimeout(setTimeout(() => console.log('Hello'), 1000));
 */
export function registerTimeout(id: NodeJS.Timeout) {
  timeouts.add(id);
  return id;
}

/**
 * Clears all registered intervals and timeouts.
 * This is useful for cleanup, especially in tests or when shutting down the application.
 */
export async function clearAllTimers() {
  try {
    for (const id of intervals) clearInterval(id);
    for (const id of timeouts) clearTimeout(id);

    intervals.clear();
    timeouts.clear();

  } catch (error) {
    console.error('Error clearing timers:', error);
  }
}
