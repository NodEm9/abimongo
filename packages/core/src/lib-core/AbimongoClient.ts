/* eslint-disable @typescript-eslint/no-require-imports */
import {
	MongoClient,
	Db,
	Document,
	Collection,
	TopologyClosedEvent,
	TopologyOpeningEvent
} from 'mongodb';
import 'dotenv/config'
import { AbimongoClientConfig, AbimongoClientOptions } from '../types';
// import { AsyncBatchTransporter } from '@abimongo/logger';
import { GetTanantModelParams } from '../tanancy';
import { AbimongoSchema } from '.';
import {
	ErrorType,
	AbimongoModelRegistry,
	AbiMongoError
} from '../utils';
import chalk from 'chalk';


const abimongoSymbol = Symbol.for('abimongo:default');
const abimongoClientSymbol = Symbol.for('abimongo:client');
const defaultCollectionName = Symbol.for('abimongo:defaultCollectionName');


/**
 * AbimongoClient is a MongoDB client wrapper that provides a simplified interface for connecting to and interacting with MongoDB databases.
 * It supports multi-tenancy, connection pooling, and error handling.
 * It also provides methods for connecting to a database, getting collections name and dropping databases.
 * @param uri - The MongoDB connection URI.
 * @param options - Optional configuration options for the client.
 * @param options.dbName - The name of the database to connect to.
 * @param options.collectionName - The name of the collection to use.
 * @param options.client - An optional MongoDB client instance to use.
 * @param options.logger - An optional logger instance for logging messages.
 * @class AbimongoClient
 */
export class AbimongoClient implements AbimongoClientConfig {
	private _uri: string;
	private _client: MongoClient | null;
	private _db?: Db | null = null;
	private collectionName?: Collection<any>;
	private _dbName?: string;

	private static tenantDBs: Map<string, Db> = new Map();

	private static instances: Map<string, Db> = new Map();
	private static defaultUri: string = `mongodb://127.0.0.1:27017`;

	constructor(
		public uri: string = AbimongoClient.defaultUri,
		public _options?: AbimongoClientOptions,
	) {
		// Use provided uri or fall back to default
		this._uri = uri || AbimongoClient.defaultUri;
		this._options = _options || {};
		this._dbName = this._options?.dbName || process.env.DB_NAME || 'abimongo_default_db';

		// Validate and create client
		this.validateUri(this._uri);
		this._client = this._options?.client || new MongoClient(this._uri, {
			directConnection: true,
			minPoolSize: 5,
			maxPoolSize: 50,
			serverSelectionTimeoutMS: 5000,
		});

		this._db = this._client && typeof this._client.db === 'function' ? this._client.db(this._dbName) : null;
		if (this._client && typeof this._client.db === 'function') {
			this._client.db(this._dbName).collection(this._options?.collectionName || (defaultCollectionName as unknown as string));
		}
		// Ensure MongoDB dependency is available
		this.ensureMongoDependency();
	}

	static init() {
		if (this.instances.has(String(abimongoSymbol))) {
			return this.instances.get(String(abimongoSymbol))!;
		}
		const client = new AbimongoClient(this.defaultUri);
		this.instances.set(String(abimongoSymbol), client.db);
		return client._uri;
	}

	private ensureMongoDependency() {
		try {
			// Require only to ensure peer dependency is installed. Do not overwrite _client.
			require('mongodb');
		} catch (err) {
			console.error(
				'\n❌ Missing peer dependency: "mongodb".\n' +
				'Please install it in your project before continuing:\n\n' +
				'   npm i mongodb\n'
			);
			process.exit(1);
		}
	}

	/**
	 * Connects to the MongoDB database using the provided URI and options.
	 * @param {string} uri - The MongoDB connection URI.
	 * @param {AbimongoClientOptions} [options] - Optional configuration options for the client.
	 * @returns {Promise<AbimongoClient>} A promise that resolves to the connected AbimongoClient instance.
	 * @throws {Error} If the URI is not provided.
	 */
	async connectDb(uri: string | undefined, options?: AbimongoClientOptions): Promise<AbimongoClient> {
		const _abimongo = this instanceof AbimongoClient ? this : abimongo;
		const resolvedUri = uri || _abimongo._uri || AbimongoClient.defaultUri;
		if (!resolvedUri) {
			throw new Error('MongoDB URI is required.');
		}

		if (!_abimongo._client || _abimongo._uri !== resolvedUri) {
			_abimongo._uri = resolvedUri;
			_abimongo._options = options || _abimongo._options;
			_abimongo._client = _abimongo._options?.client || new MongoClient(_abimongo._uri) as MongoClient;
			_abimongo._db = _abimongo._client && typeof _abimongo._client.db === 'function'
				? _abimongo._client.db(_abimongo._options?.dbName || _abimongo._dbName)
				: null;
		}

		return _abimongo;
	}

	/**
	 * Retrieves the database connection for a specific tenant.
	 * @param {string} tenantId - The ID of the tenant.
	 * @param {string} uri - The MongoDB connection URI.
	 * @returns {Promise<Db>} A promise that resolves to the connected database instance.
	 * @throws {Error} If the MongoClient instance is undefined.
	*/
	static async getDatabase(tenantId: string, uri: string): Promise<{ db: Db; client: MongoClient }> {
		const _abimongo = this instanceof AbimongoClient ? this : abimongo;

		// Check if the tenant database is already cached
		if (!this.tenantDBs.has(tenantId)) {
			const clientWrapper = await _abimongo.connectDb(uri, { dbName: tenantId });
			await clientWrapper._client?.connect();

			// If not, create a new database connection for the tenant
			if (clientWrapper._client) {
				const dbInstance = clientWrapper._client.db(tenantId);
				this.instances.set(tenantId, dbInstance);
				this.tenantDBs.set(tenantId, dbInstance);
			} else {
				throw new Error('MongoClient instance is undefined.');
			}
		}

		const db = this.instances.get(tenantId)!;
		// Try to fetch the client that created this DB; prefer cached instance if present
		// We stored the client when creating the DB above as part of the connect flow.
		// If not available, fall back to retrieving from the db object where possible.
		let client: MongoClient | undefined;
		const possibleClient = (db as any).client ?? (db as any).s?.client;
		if (possibleClient) client = possibleClient as MongoClient;

		// If we didn't derive the client from the db, attempt to find a matching client in instances map
		if (!client) {
			// try to find any client that points to this db by comparing databaseName
			for (const [id, instDb] of this.instances.entries()) {
				if (instDb && instDb.databaseName === db.databaseName) {
					const maybeClient = (instDb as any).client ?? (instDb as any).s?.client;
					if (maybeClient) {
						client = maybeClient as MongoClient;
						break;
					}
				}
			}
		}

		if (!client) {
			throw new Error('Unable to resolve MongoClient for tenant DB.');
		}

		return { db, client };
	}


	/**
	 * Retrieves the database connection for a specific tenant.
	 * @param {string} tenantId - The ID of the tenant.
	 * @returns {Db} The connected database instance.
	 * @throws {Error} If the MongoClient instance is undefined.
	 */
	static getTenantDB(tenantId: string): Db {
		if (!tenantId) {
			const message = 'Tenant ID is required.';
			const error = new Error(message).stack
			const cause = ErrorType.VALIDATION_ERROR;
			throw AbiMongoError(
				ErrorType.AbiMongoConnectionError,
				message,
				error,
				cause,
			);
		}
		// Check if the tenant database is already cached
		if (this.tenantDBs.has(tenantId)) {
			return this.tenantDBs.get(tenantId)!;
		}
		// If not, create a new database connection for the tenant
		return this.instances.get(tenantId)!;
	};


	static async getAllTenantDBs(): Promise<Db[]> {
		const tenantIds = this.tenantDBs.size > 0 ? [...this.tenantDBs.keys()] : [];
		// Ensure the first tenant DB is initialized
		await this.getDatabase(tenantIds[0], this.defaultUri).catch((error) => {
			console.log(chalk.red('[error]: Error retrieving tenant databases:'), error);
		});
		const foundInstances = this.instances.size > 0 ? [...this.instances.values()] : [];
		console.log(`[info]: Found ${foundInstances.length} tenant DB instances: ${foundInstances.map(db => db.databaseName).join(', ')}`);
		return foundInstances;
	}

	static getRegisteredModel(
		modelName: string,
		tenantId: string,
		schema?: AbimongoSchema<any>,
	): GetTanantModelParams<Db> & { db: Db, } {
		if (!modelName || !tenantId) throw new Error('The function requires at least modelName and tenantId.');
		const db = this.instances.get(tenantId)!;

		return {
			modelName,
			tenantId,
			schema,
			db,
		};
	};

	static async runGlobalGC() {
		for (const model of AbimongoModelRegistry.getAllModels()) {
			model.startAutoGC(1000);
		}
	}

	/**
	 * Gets the current database instance.
	 * @returns {Db} The connected database instance.
	 * @throws {AbiMongoError} If the database connection is not established.
	 */
	get db(): Db {
		if (this._db === null || this._db === undefined) {
			const message = 'Database connection is not established. call connect() first.';
			const error = new Error(message).stack;
			const cause = ErrorType.NULL_OR_UNDEFINED;
			throw AbiMongoError(
				ErrorType.AbiMongoConnectionError,
				message,
				error,
				cause,
			);
		}
		return this._db;
	}

	/**
	 * Gets the current MongoClient instance.
	 * @returns {MongoClient} The connected MongoClient instance.
	 */
	get client(): MongoClient {
		return this._client!;
	}

	/**
	 * Validates the MongoDB URI to ensure it starts with "mongodb://" or "mongodb+srv://".
	 * @param {string} uri - The MongoDB connection URI.
	 * @throws {AbiMongoError} If the URI is invalid.
	 */
	public validateUri(uri: string): void {
		if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
			const message = 'Invalid MongoDB URI. It must start with "mongodb://" or "mongodb+srv://".';
			const error = new Error(message).stack;
			const cause = ErrorType.VALIDATION_ERROR;
			throw AbiMongoError(
				ErrorType.AbiMongoConnectionError,
				message,
				error,
				cause,
			);
		}
	}

	/**
	 * Establishes a connection to the MongoDB database.
	 * @returns {Promise<Db>} A promise that resolves to the connected database instance.
	 */
	async connect(): Promise<Db> {
		if (!this._client) {
			this._client = new MongoClient(this.uri, { monitorCommands: true });
			await this.client.connect();
			this._db = this.client.db(this._options?.dbName);
		}
		return this._db!;
	}

	/**
	 * Retrieves a MongoDB collection by name.
	 * @template T
	 * @param {string} name - The name of the collection to retrieve.
	 * @returns {Collection<T>} The MongoDB collection instance.
	 * @throws {Error} If the database connection is not established.
	 */
	collection<T extends Document>(name: string): Collection<T> {
		if (!this._client) {
			const message = 'You are attempting to access a collection without a database connection.';
			const cause = 'DB_NAME_ERROR';

			const error = new Error(message).stack;
			console.log(chalk.red(`[${cause}]: ${error}`));
		}
		return this._client?.db(this._options?.dbName).collection<T>(name) as Collection<T>;
	}

	/**
	 * Retrieves a MongoDB collection by name, defaulting to the collection specified in the options if not provided.
	 * @template T
	 * @param {string} name - The name of the collection to retrieve.
	 * @returns {Collection<T>} The MongoDB collection instance.
	 * @throws {Error} If the database connection is not established.
	 */
	getCollection<T extends Document>(name: string): Collection<T> {
		if (!this._client) {
			const message = 'No collection found, please check the database name.';
			const cause = 'DB_NAME_ERROR';

			const error = new Error(message).stack;
			console.log(chalk.red(`[${cause}]: ${error}`));
		}
		return this._client?.db(this._options?.dbName).collection<T>(name) as Collection<T>;
	}

	/**
	 * Retrieves information about the MongoDB cluster type (e.g., standalone, replica set, sharded).
	 * @returns {Promise<{ type: string; setName?: string }>} A promise that resolves to an object containing the cluster type and set name (if applicable).
	 */
	async getClusterInfo(): Promise<{ type: string; setName?: string }> {
		const adminDb = this.client.db(this?._options?.dbName).admin();
		const result = await adminDb.command({ isMaster: 1 });

		if (result.msg === 'isdbgrid') {
			console.log('MongoDB is running in a sharded cluster.');
			return { type: 'sharded' };
		} else if (result.setName) {
			console.log(`MongoDB is running in a replica set: ${result.setName}`);
			return { type: 'replicaSet', setName: result.setName };
		} else {
			console.log('MongoDB is running as a standalone instance.');
			return { type: 'standalone' };
		}
	}

	/**
	 * Switches to a different database at runtime (e.g., for multi-tenancy).
	 * @param {string} dbName - The name of the database to switch to.
	 * @returns {Promise<Db>} A promise that resolves to the new database instance.
	 * @throws {Error} If the client is not initialized or the database name is not provided.
	 */
	async useDatabase(dbName: string): Promise<{ db: Db; client: MongoClient }> {
		if (!this._client) {
			throw new Error("Client not initialized. Call `connect()` first.");
		}
		if (!dbName) {
			const message = 'Database name is required.';
			throw new Error(message).stack;
		}

		this._db = this._client ? this._client.db(dbName) : dbName as unknown as Db;
		this.collectionName = this.client.db(this._options?.dbName).collection(this._options?.collectionName as string);
		return { db: this._db, client: this._client };
	}

	/**
	 * Switches to a different collection at runtime.
	 * @param {string} collectionName - The name of the collection to switch to.
	 * @returns {Promise<Collection<any>>} A promise that resolves to the new collection instance.
	 * @throws {Error} If the client is not initialized or the collection name is not provided.
	 */
	async useCollection(collectionName: string): Promise<Collection<any>> {
		if (!this._client) {
			throw new Error("Client not initialized. Call `connect()` first.");
		}
		if (!collectionName) {
			const message = 'Collection name is required.';
			throw new Error(message).stack;
		}

		this.collectionName = this.client.db(this._options?.dbName).collection(collectionName);
		return this.collectionName;
	}

	/**
	 * Drops the specified collection from the database.
	 * @returns {Promise<void>} A promise that resolves when the collection is dropped.
	 */
	async dropCollection(): Promise<void> {
		if (await this._client?.connect()) {
			await this._client?.db(this._options?.dbName).collection(JSON.stringify(this.collectionName)).drop();
		}
	}

	/**
	 * Drops the entire database.
	 * @returns {Promise<boolean>} A promise that resolves to `true` if the database is dropped successfully, `false` otherwise.
	 */
	dropDatabase(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this._client?.connect()
				.then(() => {
					this._client?.db(this._options?.dbName).dropDatabase()
						.then(() => {
							console.log(`Dropped database: ${this._options?.dbName}`);
							this._client?.close()
							// Remove the database from the instances map
							AbimongoClient.instances.delete(this._dbName as string);
							AbimongoClient.tenantDBs.delete(this._dbName as string);
							resolve(true);
						})
						.catch((error) => {
							console.log(`Failed to drop database: ${error}`);
							reject(error);
						});
				})
		});
	}

	/**
	 * Disconnects from the MongoDB database.
	 * @returns {Promise<void>} A promise that resolves when the client is disconnected.
	 */
	async disconnect(): Promise<void> {
		if (this._client) {
			await this.client.close();
			this._client = null;
			this._db = null;
		}
	}

	/**
	 * Closes the MongoDB client connection.
	 * @returns {Promise<void>} A promise that resolves when the client is closed.
	 */
	async close(): Promise<void> {
		await this.client.close();
		console.log('[info]: Disconnected from MongoDB');
	}
	/**
	 * Checks if the MongoDB client is connected.
	 * @returns {boolean} `true` if the client is connected, `false` otherwise.
	 */
	isConnected(): boolean {
		if (!this._client?.connect) {
			console.log('[error]: MongoDB client is not connected.');
			return false;
		}

		let isConnected;
		const clientIsConnected = async () => {
			try {
				if (await this._client?.connect()) {
					isConnected = await this._client?.connect()
					console.log(`[info]: MongoDB client is connected: ${this._client?.db(this._dbName)}`);
				}
				return isConnected;
			} catch (error) {
				console.log(`[error]: Error checking MongoDB client connection: ${error}`);
				return false;
			}
		}
		clientIsConnected();
		return isConnected ? true : false;
	}

	/**
	 * Handles MongoDB topology events (e.g., opening, closing).
	 * @param {TopologyOpeningEvent | TopologyClosedEvent} event - The topology event to handle.
	 */
	static handleTopologyEvent(event: TopologyOpeningEvent | TopologyClosedEvent): void {
		if (event instanceof TopologyOpeningEvent) {
			console.log(`Topology opened: ${event.topologyId}`);
		} else if (event instanceof TopologyClosedEvent) {
			console.log(`Topology closed: ${event.topologyId}`);
		} else {
			console.warn(`[warning]: Unknown topology event: ${event}`);
		}
	}

	// static async handleLogBatch(
	// 	batch: (TopologyOpeningEvent | TopologyClosedEvent)[],
	// 	transporter?: AsyncBatchTransporter
	// ): Promise<void> {
	// 	if (!Array.isArray(batch) || batch.length === 0) {
	// 		console.warn(`[warning]: Received an empty log batch or invalid format: ${batch}`);
	// 		return;
	// 	}

	// 	// Always handle the first event explicitly
	// 	this.handleTopologyEvent(batch[0]);

	// 	const remaining = batch.slice(1);
	// 	if (remaining.length > 0) {
	// 		if (transporter) {
	// 			for (const event of remaining) {
	// 				transporter.log('info', 'Topology event (batch)', [event]);
	// 			}
	// 		} else {
	// 			console.warn(`[warning]: No transporter provided; remaining batch will not be processed: ${remaining}`);
	// 		}
	// 	}
	// }

}

/**
 * Abimongo inherits from AbimongoClient and provides a simplified interface for connecting to MongoDB databases.
 * It allows you to create an instance of Abimongo with a MongoDB URI and optional configuration options.
 */
export class Abimongo extends AbimongoClient {
	/**
	 * Creates an instance of Abimongo.
	 * @param {string} uri - The MongoDB connection URI.
	 * @param {AbimongoClientConfig} [options] - Optional configuration options for the client.
	 * @throws {Error} If the URI is not provided.
	 */
	constructor(uri?: string, options?: AbimongoClientOptions) {
		// Allow constructing with no URI; parent constructor provides the default.
		super(uri, { dbName: options?.dbName || '' });
	}

	/**
	 * Connects to the MongoDB database using the provided URI and options.
	 * @param {string} uri - The MongoDB connection URI.
	 * @param {AbimongoClientOptions} [options] - Optional configuration options for the client.
	 * @returns {Promise<AbimongoClient>} A promise that resolves to the connected AbimongoClient instance.
	 */
	static async connect(uri: string, options?: AbimongoClientOptions): Promise<AbimongoClient> {
		return await abimongo.connectDb(uri, options);
	}

	/**
	 * Retrieves the current Abimongo instance.
	 * @returns {Abimongo} The current Abimongo instance.
	 */
	static getInstance(): Abimongo {
		if (abimongo[abimongoSymbol]) {
			return abimongo;
		} else {
			throw new Error('Abimongo instance not found.');
		}
	}
}

export const abimongo = new Abimongo();


