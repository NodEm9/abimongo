import { AsyncBatchTransporter } from '../transports';

describe('AsyncBatchTransporter', () => {
	let transporter: AsyncBatchTransporter;
	const mockSendBatch = jest.fn();

	beforeEach(() => {
		transporter = new AsyncBatchTransporter({
			batchSize: 5,
			flushInterval: 1000,
			sendBatch: mockSendBatch,
		});

		// Mock the flush function to simulate a successful send
		jest.spyOn(transporter, 'flush').mockImplementation(async () => {
			await mockSendBatch(transporter['buffer']);
		});
		// Mock the buffer to control the log entries
		(transporter as any).buffer = [
			{
				timestamp: '2023-10-01T00:00:00.000Z',
				level: 'info',
				message: 'Test message',
				meta: [],
			},
		];
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	// Mock the setInterval and clearInterval functions
	jest.useFakeTimers();
	jest.spyOn(global, 'setInterval');

	it('should log entries and send them in batches', async () => {
		transporter.log(
			'info',
			'Test message 1',
			[],
		);
		transporter.log('info', 'Test message 2', []);
		transporter.log('info', 'Test message 3', []);
		transporter.log('info', 'Test message 4', []);
		transporter.log('info', 'Test message 5', []);
		transporter.log('info', 'Test message 6', []);
		transporter.log('info', 'Test message 7', []);
		transporter.log('info', 'Test message 8', []);
		transporter.log('info', 'Test message 9', []);
		transporter.log('info', 'Test message 10', []);
		transporter.log('info', 'Test message 11', []);


		// Fast-forward the timer to trigger the flush
		jest.advanceTimersByTime(1000);
		await transporter.flush();
		expect(mockSendBatch).toHaveBeenCalledTimes(5 * 2);
		expect(mockSendBatch).toHaveBeenCalled();
	});

	it('should flush the buffer when stop is called', async () => {
		transporter.log('info', 'Test message 1', []);
		transporter.log('info', 'Test message 2', []);
		transporter.log('info', 'Test message 3', []);
		transporter.log('info', 'Test message 4', []);
		transporter.log('info', 'Test message 5', []);
		transporter.log('info', 'Test message 6', []);
		transporter.log('info', 'Test message 7', []);
		transporter.log('info', 'Test message 8', []);
		transporter.log('info', 'Test message 9', []);
		transporter.log('info', 'Test message 10', []);


		jest.advanceTimersByTime(1000);
		await transporter.flush();
		await transporter.stop();

		expect(mockSendBatch).toHaveBeenCalledTimes(11);
		expect(mockSendBatch).toHaveBeenCalled();
	});

	it('should not send batch if buffer is less than batch size', async () => {
		transporter.log('info', 'Test message 1', []);
		transporter.log('info', 'Test message 2', []);
		transporter.log('info', 'Test message 3', []);

		jest.advanceTimersByTime(1000);
		await transporter.flush();
		expect(mockSendBatch).toHaveBeenCalledTimes(2);
	});

	it('should handle errors when sending batch', async () => {
		const error = new Error('Network error');
		transporter.log('info', 'Test message 1', []);
		transporter.log('info', 'Test message 2', []);
		transporter.log('info', 'Test message 3', []);
		transporter.log('info', 'Test message 4', []);
		transporter.log('info', 'Test message 5', []);
		transporter.log('info', 'Test message 6', []);
		transporter.log('info', 'Test message 7', []);
		transporter.log('info', 'Test message 8', []);
		transporter.log('info', 'Test message 9', []);
		transporter.log('info', 'Test message 10', []);
		transporter.log('info', 'Test message 11', []);
		transporter.log('info', 'Test message 12', []);
		transporter.log('info', 'Test message 13', []);
		transporter.log('info', 'Test message 14', []);
		jest.advanceTimersByTime(1000);
		await transporter.flush();

		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
			throw new Error(`'Failed to send log batch:', ${error}`);
		});
		
		expect(consoleErrorSpy).toThrow(`'Failed to send log batch:', ${error}`);
		expect(mockSendBatch).toHaveBeenCalledTimes(7 * 2);
		expect(mockSendBatch).toHaveBeenCalled();
		expect(mockSendBatch).toHaveBeenCalledWith(transporter['buffer']);
	});

	it('should not send batch if buffer is empty', async () => {
		expect(mockSendBatch).not.toHaveBeenCalled();
	});

	it('should clear the interval when stopped', () => {
		const clearInterval = jest.spyOn(global, 'clearInterval');
		transporter.stop();
		expect(clearInterval).toHaveBeenCalled();
	});

	it('should return true if timer is equal to setInterval ', () => {
		const timer = transporter['timer'];
		const setInterval = jest.fn().mockReturnValue(timer);
		expect(timer).toBeDefined();
		expect(timer).toEqual(setInterval(() => transporter.flush(), transporter['flushInterval']));
	});
	
	it('should return false if timer is not equal to setInterval', () => {
		const timer = transporter['timer'];
		expect(timer).not.toEqual(expect.any(String));
	});

});