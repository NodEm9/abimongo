export function createCircuitBreaker<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  failureThreshold = 3,
  cooldownPeriod = 10_000
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let failures = 0;
  let lastFailureTime = 0;

  return async (...args: Parameters<T>) => {
    const now = Date.now();
    if (failures >= failureThreshold && now - lastFailureTime < cooldownPeriod) {
      throw new Error('Circuit breaker open. Skipping execution.');
    }

    try {
      const result = await fn(...args);
      failures = 0;
      return result;
    } catch (error) {
      failures++;
      lastFailureTime = Date.now();
      throw error;
    }
  };
};