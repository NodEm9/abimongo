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
