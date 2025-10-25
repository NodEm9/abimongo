import { FileTransporter } from "../transports";
import * as fs from "fs";

describe("FileTransporter", () => {
	let transporter: FileTransporter;
	let mockWrite: { write: jest.Mock };

	beforeEach(() => {
		mockWrite = { write: jest.fn() };
		transporter = new FileTransporter(
			{
				write: mockWrite.write,
				end: jest.fn(),
				on: jest.fn(),
				once: jest.fn(),
				removeListener: jest.fn(),
			} as unknown as fs.WriteStream,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	// Mock the setInterval and clearInterval functions
	jest.useFakeTimers();
	jest.spyOn(global, "setInterval");

	it.only("should write log messages to the file", () => {
		const level = "info";
		const message = "Test log message";
		const meta = [{ foo: "bar" }];

		transporter.log(level, message, meta);

		expect(mockWrite.write).toHaveBeenCalledTimes(1);
		// expect(mockWrite).toHaveBeenCalledWith();
	}
	);

});