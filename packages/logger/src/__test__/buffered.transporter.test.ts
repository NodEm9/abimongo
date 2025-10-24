import { BufferedTransporter } from "../transports";


describe("BufferedTransporter", () => {
	let transporter: BufferedTransporter;
	const mockWrite = jest.fn();

	beforeEach(() => {
		transporter = new BufferedTransporter(
			{ write: mockWrite },
			{ flushInterval: 1000, flushSize: 5 }
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	// Mock the setInterval and clearInterval functions
	jest.useFakeTimers();
	jest.spyOn(global, "setInterval");

	it("should log entries and send them in batches", () => {
		transporter.write("info", "Test message 1", []);
		transporter.write("info", "Test message 2", []);
		transporter.write("info", "Test message 3", []);
		transporter.write("info", "Test message 4", []);
		transporter.write("info", "Test message 5", []);
		transporter.write("info", "Test message 6", []);

		// Fast-forward the timer to trigger the flush
		jest.advanceTimersByTime(1000);
		transporter.flush();

		expect(mockWrite).toHaveBeenCalledTimes(6);
		// expect(mockWrite).toHaveBeenCalledWith(
		// 	expect.stringContaining("Test message")
		// );
	});

	it("should flush the buffer when stop is called", () => {
		transporter.write("info", "Test message 1", []);
		transporter.write("info", "Test message 2", []);
		transporter.write("info", "Test message 3", []);
		transporter.write("info", "Test message 4", []);

		jest.advanceTimersByTime(1000);
		transporter.flush();
		transporter.stop();
		expect(mockWrite).toHaveBeenCalledTimes(4);
		// expect(mockWrite).toHaveBeenCalledWith(
		// 	expect.stringContaining("Test message")
		// );
	});

	it("should not send messages if the buffer is empty", () => {
		transporter.flush();
		expect(mockWrite).not.toHaveBeenCalled();
	});
});