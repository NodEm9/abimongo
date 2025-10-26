import { retryWithBackoff } from '../utils';

describe('retryWithBackoff', () => {
	jest.useFakeTimers();
	
	it('should resolve if fn succeeds on first try', async () => {
		const fn = jest.fn().mockResolvedValue('success');
		const resultPromise = retryWithBackoff(fn);
		await expect(resultPromise).resolves.toBe('success');
		expect(fn).toHaveBeenCalledTimes(1);
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.clearAllMocks();
	});
});