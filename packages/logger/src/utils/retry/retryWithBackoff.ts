/** * Retries an asynchronous function with exponential backoff.
 * @param fn - The asynchronous function to retry.
 * @param retries - The maximum number of retry attempts.
 * @param delayMs - The initial delay in milliseconds before retrying.
 * @param backoffFactor - The factor by which to multiply the delay after each failed attempt.
 * @returns The result of the asynchronous function if successful.
 * @throws The error from the last failed attempt if all retries are exhausted.
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 5,
  delayMs = 500,
  backoffFactor = 2
): Promise<T> {
  let attempt = 0;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= retries) throw error;

      const waitTime = delayMs * Math.pow(backoffFactor, attempt);
      await new Promise(res => setTimeout(res, waitTime));
    }
  }

  throw new Error('Retry attempts exhausted');
}
