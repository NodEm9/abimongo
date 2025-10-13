/**
 * Represents the types of events supported by Abimongo.
 */
export type EventType =
	| 'pre-save'
	| 'post-save'
	| 'pre-update'
	| 'post-update'
	| 'pre-delete'
	| 'post-delete'
	| 'aggregate'
	| 'disconnect'
	| 'connect'
	| 'dropDatabase'
	| 'createIndex'
	| 'dropIndex'
	| 'create'
	| 'find'
	| 'findOne'
	| 'insertOne'
	| 'insertMany'
	| 'updateOne'
	| 'updateMany'
	| 'deleteOne'
	| 'deleteMany'

export const eventTypes: EventType[] = [
	'pre-save',
	'post-save',
	'pre-update',
	'post-update',
	'pre-delete',
	'post-delete',
	'aggregate',
	'disconnect',
	'connect',
	'dropDatabase',
	'createIndex',
	'dropIndex',
	'create',
	'find',
	'findOne',
	'insertOne',
	'insertMany',
	'updateOne',
	'updateMany',
	'deleteOne',
	'deleteMany'
];
