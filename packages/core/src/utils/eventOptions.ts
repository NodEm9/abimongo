// import { logger } from "@abimongo/logger";
import { EventType } from "../types";
import { ILogger } from "../types";

/**
 * Mapping from event type to option key.
 */
const eventOptionMap: Record<EventType, string> = {
	"pre-save": "save",
	"post-save": "save",
	"pre-update": "update",
	"post-update": "update",
	"pre-delete": "delete",
	"post-delete": "delete",
	"aggregate": "aggregate",
	"disconnect": "disconnect",
	"connect": "connect",
	"dropDatabase": "dropDatabase",
	"createIndex": "index",
	"dropIndex": "index",
	"create": "create",
	"find": "find",
	"findOne": "find",
	"insertOne": "insertOne",
	"insertMany": "insertMany",
	"updateOne": "updateOne",
	"updateMany": "updateMany",
	"deleteOne": "deleteOne",
	"deleteMany": "deleteMany",
};

/**
 * Returns the options object for the given event type.
 * @param eventType - The type of the event.
 * @returns The options for the event.
 */
export function getEventOptions(eventType: EventType): Record<string, boolean> {
	const key = eventOptionMap[eventType] || eventType;
	return { [key]: true };
}

/**
 * Returns the event type based on the options provided.
 * @param options - The options for the event.
 * @returns The event type, or null if not found.
 */
export function getEventType(options: Record<string, any>): EventType | null {
	const key = Object.keys(options).find((k) =>
		Object.values(eventOptionMap).includes(k)
	);
	if (!key) return null;
	// Find the first eventType that maps to this key
	const eventType = (Object.keys(eventOptionMap) as EventType[]).find(
		(et) => eventOptionMap[et] === key
	);
	return eventType || null;
}

/**
 * Returns a human-readable description for the given event type.
 * @param eventType - The type of the event.
 * @returns The event description.
 */
export function describeEvent(eventType: EventType): string {
	const descriptions: Partial<Record<EventType, string>> = {
		"pre-save": "Before Save",
		"post-save": "After Save",
		"pre-update": "Before Update",
		"post-update": "After Update",
		"pre-delete": "Before Delete",
		"post-delete": "After Delete",
		aggregate: "Aggregation",
		disconnect: "Disconnect",
		connect: "Connect",
		dropDatabase: "Drop Database",
		createIndex: "Create Index",
		dropIndex: "Drop Index",
		create: "Create",
		find: "Find",
		findOne: "Find One",
		insertOne: "Insert One",
		insertMany: "Insert Many",
		updateOne: "Update One",
		updateMany: "Update Many",
		deleteOne: "Delete One",
		deleteMany: "Delete Many",
	};
	return descriptions[eventType] || eventType;
};



/**
 * Logs the event action using a provided logger.
 * @param logger - The logger instance (must have a log method).
 * @param eventType - The type of the event.
 * @param message - Optional custom message.
 * @param level - Log level (default: 'info').
 * @param context - Optional context or payload to log.
 */
export function logEvent(
	logger,
	eventType: EventType,
	message?: string,
	level: string = 'info',
	context?: any
) {
	const eventDesc = describeEvent(eventType);
	const logMsg = message
		? `[ABIMONGO EVENT]: ${eventDesc}: ${message}`
		: `[Abimongo] Event: ${eventDesc}`;
	logger.log(logMsg, level, context);
}

// This is a simple console logger implementation
// It's Temporary and should be replaced with a proper logging solution
const logger: ILogger = {
	info: (message: string) => {
		console.info(message);
	},
	warn: (message: string) => {
		console.warn(message);
	},
	error: (message: string) => {
		console.error(message);
	},
	fatal: (message: string) => {
		console.error(`FATAL: ${message}`);
	},
	debug: (message: string) => {
		console.debug(message);
	}
};

/**
 * Logs an event with a default logger.
 * @param eventType - The type of the event.
 * @param message - Optional custom message.
 * @param level - Log level (default: 'info').
 * @param context - Optional context or payload to log.
 */
export function logDefaultEvent(
	eventType: EventType,
	message?: string,
	level: string = 'info',
	context?: any
) {
	logEvent(logger, eventType, message, level, context);
	return eventType
}

