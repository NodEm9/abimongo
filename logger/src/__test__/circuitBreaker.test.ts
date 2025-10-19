import { createCircuitBreaker } from '../utils';

describe('createCircuitBreaker', () => {
	it('should call the wrapped function and return its result', async () => {
		const fn = jest.fn().mockResolvedValue('success');
		const breaker = createCircuitBreaker(fn);

		const result = await breaker('test');
		expect(result).toBe('success');
		expect(fn).toHaveBeenCalledWith('test');
	});

	it('should reset failures after a successful call', async () => {
		const fn = jest
			.fn()
			.mockRejectedValueOnce(new Error('fail'))
			.mockResolvedValueOnce('ok');
		const breaker = createCircuitBreaker(fn, 2, 1000);

		await expect(breaker()).rejects.toThrow('fail');
		const result = await breaker();
		expect(result).toBe('ok');
	});

	it('should throw if failures exceed threshold and cooldown has not passed', async () => {
		jest.useFakeTimers();
		const fn = jest.fn().mockRejectedValue(new Error('fail'));
		const breaker = createCircuitBreaker(fn, 2, 10000);

		await expect(breaker()).rejects.toThrow('fail');
		await expect(breaker()).rejects.toThrow('fail');

		// Should now be open
		await expect(breaker()).rejects.toThrow('Circuit breaker open. Skipping execution.');

		jest.useRealTimers();
	});

	it('should allow calls after cooldown period', async () => {
		jest.useFakeTimers();
		const fn = jest.fn().mockRejectedValue(new Error('fail'));
		const breaker = createCircuitBreaker(fn, 1, 5000);

		await expect(breaker()).rejects.toThrow('fail');
		await expect(breaker()).rejects.toThrow('Circuit breaker open. Skipping execution.');

		// Advance time past cooldown
		jest.advanceTimersByTime(5001);

		// Should try again (and fail)
		await expect(breaker()).rejects.toThrow('fail');

		jest.useRealTimers();
	});

	it('should work with functions that take arguments', async () => {
		const fn = jest.fn(async (a: number, b: number) => a + b);
		const breaker = createCircuitBreaker(fn);

		const result = await breaker(2, 3);
		expect(result).toBe(5);
		expect(fn).toHaveBeenCalledWith(2, 3);
	});
});