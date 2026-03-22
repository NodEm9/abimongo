/* eslint-disable @typescript-eslint/no-require-imports */
import {
	MongoClient,
	Db,
	Document,
	Collection,
	TopologyClosedEvent,
	TopologyOpeningEvent,
	ClientSession
} from 'mongodb';
import 'dotenv/config'
import {
	AbimongoClientConfig,
	AbimongoClientOptions,
	BootstrapClient,
	ModelContext
} from '../types';
import {
	ErrorType,
	AbimongoModelRegistry,
	AbiMongoError
} from '../utils';
import { colorize } from '../utils/color-palatte';
import "dotenv/config";
import { GetTenantModelParams, MultiTenantManager } from '../tanancy';
import { AbimongoSchema } from './AbimongoSchema';
import { AbimongoContext } from '../context/AbimongoContext';
import { AsyncBatchTransporter } from '@abimongo/logger';



const abimongoSymbol = Symbol.for('abimongo:default');


type ClusterInfo =
	| { type: 'sharded' }
	| { type: 'replicaSet'; setName?: string; hosts?: string[] }
	| { type: 'standalone' };


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
export class AbimongoClient implements BootstrapClient {
	private _uri!: string | undefined;
	private _client?: MongoClient | null;
	private _db?: Db | null;
	private collectionName?: Collection<any>;
	private _connected: boolean = false;

	private readonly _defaultDbName: string;
	private _overrideDbName?: string;

	private static tenantDBs: Map<string, BootstrapClient> = new Map();

	private static instances: Map<string, BootstrapClient> = new Map();
	private static defaultUri: string = `mongodb://127.0.0.1:27017`;

	constructor(
		private readonly _opts: AbimongoClientConfig,
	) {
		this._uri = _opts.uri || process.env.MONGO_URI || AbimongoClient.defaultUri;
		this._defaultDbName = _opts?.options?.dbName || process.env.DB_NAME || 'abimongo_default_db';

		this._client = new MongoClient(this._uri!, {
			directConnection: true,
			minPoolSize: 5,
			maxPoolSize: 50,
			serverSelectionTimeoutMS: 5000,
		})

		this._db = this._client?.db(_opts.options?.dbName);
		// Ensure MongoDB dependency is available
		this.ensureMongoDependency();

	};

	static init(opts?: Partial<AbimongoClientConfig>): AbimongoClient {
		const key = String(abimongoSymbol);

		const existing = this.instances.get(key);
		if (existing) return existing as unknown as AbimongoClient;

		const client = createAbimongoClientModule({
			uri: opts?.uri ?? this.defaultUri ?? process.env.MONGO_URI,
			options: { dbName: opts?.options?.dbName },
			tenantResolver: opts?.tenantResolver
		});

		this.instances.set(key, client);
		return client;
	}

	private ensureMongoDependency() {
		try {
			const { MongoClient } = require('mongodb');
			// ensure the dependency exists; do not overwrite the instance stored in this._client
			void MongoClient;
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
	 * @param {AbimongoClientModuleOptions} [options] - Optional configuration options for the client.
	 * @returns {Promise<AbimongoClient>} A promise that resolves to the connected AbimongoClientModule instance.
	 * @throws {Error} If the URI is not provided.
	 */
	async connection(uri: string, options?: AbimongoClientOptions): Promise<AbimongoClient> {
		const _abimongo = this instanceof AbimongoClient ? this : abimongo;
		this.validateUri(uri)
		if (!uri) {
			const message = 'MongoDB URI is required.';
			throw new Error(message).stack;
		}

		if (!_abimongo._client || _abimongo._opts.uri !== uri) {
			_abimongo._opts.uri = uri;
			_abimongo._opts.options = { ..._abimongo._opts.options, ...options };
			_abimongo._client = new MongoClient(_abimongo._opts.uri, {
				directConnection: true,
				minPoolSize: 5,
				maxPoolSize: 50,
				serverSelectionTimeoutMS: 5000,
			}) as MongoClient;
			_abimongo._db = _abimongo._client?.db(_abimongo._opts.options?.dbName);
		}

		return _abimongo
	}

	/**
	 * Retrieves the database connection for a specific tenant.
	 * @param {string} tenantId - The ID of the tenant.
	 * @param {string} uri - The MongoDB connection URI.
	 * @returns {Promise<Db>} A promise that resolves to the connected database instance.
	 * @throws {Error} If the MongoClient instance is undefined.
	*/
	static async getDatabase(ctx: ModelContext, uri: string): Promise<{ db: BootstrapClient; client: MongoClient }> {
		const _abimongo = this instanceof AbimongoClient ? this : abimongo;
		const tenantId = ctx.tenantId!;

		// Check if the tenant database is already cached
		if (!this.tenantDBs.has(tenantId)) {
			const clientWrapper = await _abimongo.connection(uri, { dbName: tenantId });
			await clientWrapper._client?.connect();

			// If not, create a new database connection for the tenant
			if (clientWrapper._client) {
				const dbInstance = clientWrapper._client.db(tenantId) as unknown as BootstrapClient;
				this.instances.set(tenantId, dbInstance);
				this.tenantDBs.set(tenantId, dbInstance);
			} else {
				throw new Error('MongoClient instance is undefined.');
			}
		}

		const db = this.instances.get(tenantId)!;
		let client: MongoClient | undefined;
		const possibleClient = (db as any).client ?? (db as any).s?.client;
		if (possibleClient) client = possibleClient as MongoClient;

		// If we didn't derive the client from the db, attempt to find a matching client in instances map
		if (!client) {
			// try to find any client that points to this db by comparing databaseName
			for (const [id, instDb] of this.instances.entries()) {
				if (instDb && (await instDb.db()).databaseName === (await db.db()).databaseName) {
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
	static getTenantDB(tenantId: string): BootstrapClient {
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


	static async getAllTenantDBs(): Promise<BootstrapClient[]> {
		const tenantIds = this.tenantDBs.size > 0 ? [...this.tenantDBs.keys()] : [];
		const ctx: ModelContext = { tenantId: tenantIds[0] }; // Use the first tenant ID for context

		// Ensure the first tenant DB is initialized
		await this.getDatabase(ctx, this.defaultUri).catch((error) => {
			console.log(colorize('[error]: Error retrieving tenant databases:', 'red'), error);
		});
		const foundInstances = this.instances.size > 0 ? [...this.instances.values()] : [];
		console.log(`[info]: Found ${foundInstances.length} tenant DB instances: ${foundInstances.map(async db => (await db.db()).databaseName).join(', ')}`);
		return foundInstances;
	}

	static getRegisteredModel(
		collectionName: string,
		tenantId: string,
		schema: AbimongoSchema<any>,
		dbName?: string
	): GetTenantModelParams<BootstrapClient> & { db: BootstrapClient, } {
		if (!collectionName || !tenantId) throw new Error('The function requires at least collectionName and tenantId.');
		const db = this.instances.get(tenantId)!;

		return {
			collectionName,
			schema,
			tenantId,
			dbName,
			db
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
	 * Resolution order for db():
	 * 1) explicit override via ctx.db (e.g., useDatabase() or withDatabase())
	 * 2) tenant resolver if ctx.tenantId is provided (e.g., multi-tenancy)
	 */
	async db(ctx?: ModelContext): Promise<Db> {
		// 1) explicit dbName override uses base client
		if (ctx?.dbName) {
			if (!this._client || !this._connected) {
				const message = "AbimongoClient not connected. call connect() first.";
				const error = new Error(message).stack;
				const cause = ErrorType.CONNECTION_ERROR;
				throw AbiMongoError(
					ErrorType.AbiMongoConnectionError,
					message,
					error,
					cause
				);
			}

			return this._client.db(ctx.dbName);
		}

		// 2) tenant path should NOT depend on base client connection
		if (ctx?.tenantId) {
			const resolver = this._opts.tenantResolver;
			if (!resolver) {
				throw new Error(
					"Multi-tenancy not enabled. Provide tenantResolver to AbimongoClient or avoid passing tenantId."
				);
			}

			const tenantClient = await resolver.getClient(ctx.tenantId);
			if (!tenantClient) {
				throw new Error(`Tenant "${ctx.tenantId}" is not registered.`);
			}

			return tenantClient.db();
		}

		// 3) from here on, base client is required
		if (!this._client || !this._connected) {
			const message = "AbimongoClient not connected. call connect() first.";
			const error = new Error(message).stack;
			const cause = ErrorType.CONNECTION_ERROR;
			throw AbiMongoError(
				ErrorType.AbiMongoConnectionError,
				message,
				error,
				cause
			);
		}

		// 4) runtime override
		if (this._overrideDbName) {
			return this._client.db(this._overrideDbName);
		}

		// 5) default db
		return this._client.db(this._defaultDbName);
	}

	static async db(ctx?: ModelContext): Promise<Db> {
		return this.init().db(ctx);
	}

	/**
	 * Validates the MongoDB URI to ensure it starts with "mongodb://" or "mongodb+srv://".
	 * @param {string} uri - The MongoDB connection URI.
	 * @throws {AbiMongoError} If the URI is invalid.
	 */
	validateUri(uri: string) {
		if (!uri || typeof uri !== "string") {
			const message = `Missing MongoDB URI. Set MONGODB_URI (or pass uri explicitly).`;
			const error = new Error(message).stack;
			const cause = ErrorType.VALIDATION_ERROR;
			throw AbiMongoError(
				ErrorType.AbiMongoConnectionError,
				message,
				error,
				cause,
			);
		}
		if (!/^mongodb(\+srv)?:\/\//.test(uri)) {
			const message = `Invalid MongoDB URI "${uri}". It must start with "mongodb://" or "mongodb+srv://".`
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
	async connect(): Promise<this> {
		this.validateUri(this._opts.uri!);
	
		if (!this._client) {
			this._client = new MongoClient(this._opts.uri);
		}

		if (!this._connected) {
			await this._client.connect();
			this._connected = true;
		}
		return this
	}

	async client(ctx?: ModelContext): Promise<MongoClient> {
		if (ctx?.tenantId) {
			const resolver = this._opts.tenantResolver;
			if (!resolver) {
				throw new Error(
					"Multi-tenancy not enabled. Provide tenantResolver to AbimongoClient or avoid passing tenantId."
				);
			}

			const tenantClient = await resolver.getClient(ctx.tenantId);
			if (!tenantClient) {
				throw new Error(`Tenant "${ctx.tenantId}" is not registered.`);
			}

			return tenantClient;
		}

		if (!this._client || !this._connected) {
			throw new Error("AbimongoClient not connected. Call connect() first.");
		}

		return this._client;
	}

	async useCollection(collectionName: string): Promise<Collection<any>> {
		if (!collectionName || typeof collectionName !== 'string' || !collectionName.trim()) {
			throw new Error('Collection name is required.');
		}

		if (!this._client) {
			throw new Error('Client not initialized. Call `connect()` first.');
		}

		const dbName = this.resolveDbName();
		if (!dbName) {
			throw new Error('Database name is required in client options.');
		};

		const resolvedCollectionName = this.resolveCollectionName(collectionName);
		const collection = this._client
			.db(dbName)
			.collection(resolvedCollectionName);

		this.collectionName = collection;
		return collection;
	}

	async collection<T extends Document = Document>(
		collectionName: string,
		ctx?: ModelContext
	): Promise<Collection<T>> {
		const db = await this.db(ctx);
		return db.collection<T>(collectionName);
	}

	/**
	 * Retrieves a MongoDB collection by name, defaulting to the collection specified in the options if not provided.
	 * @template T
	 * @param {string} name - The name of the collection to retrieve.
	 * @returns {Collection<T>} The MongoDB collection instance.
	 * @throws {Error} If the database connection is not established.
	 */
	async getCollection<T extends Document>(
		collectionName: string,
		ctx?: ModelContext
	): Promise<Collection<T>> {
		if (!this._client || typeof (this._client as any)?.db !== 'function') {
			return ({
				toString: () => collectionName,
			} as unknown) as Collection<T>;
		}
		return await this.collection(collectionName, ctx)
	}

	/**
	 * Retrieves information about the MongoDB cluster type (e.g., standalone, replica set, sharded).
	 * @returns {Promise<{ type: string; setName?: string }>} A promise that resolves to an object containing the cluster type and set name (if applicable).
	 */
	async getClusterInfo(): Promise<ClusterInfo> {
		if (!this._client) {
			throw new Error('Client not initialized. Call `connect()` first.');
		}

		const dbName = this._opts?.options?.dbName;
		if (!dbName) {
			throw new Error('Database name is required in client options.');
		}

		const helloResult = await this._client
			.db(dbName)
			.admin()
			.command({ hello: 1 });

		if (helloResult?.msg === 'isdbgrid') {
			console.log('MongoDB is running in a sharded cluster.');
			return { type: 'sharded' };
		}

		if (helloResult?.setName || helloResult?.hosts) {
			console.log('MongoDB is running as a replica set.');
			return {
				type: 'replicaSet',
				setName: helloResult.setName,
				hosts: helloResult.hosts
			};
		}

		console.log('MongoDB is running as a standalone instance.');
		return { type: 'standalone' };
	}

	/**
	 * Switches to a different database at runtime (e.g., for multi-tenancy).
	 * @param {string} dbName - The name of the database to switch to.
	 * @returns {Promise<Db>} A promise that resolves to the new database instance.
	 * @throws {Error} If the client is not initialized or the database name is not provided.
	 */
	async useDatabase(dbName: string): Promise<{ db: Db; client: MongoClient }> {
		if (!this._client) throw new Error("Client not initialized. Call connect() first.");
		if (!dbName) throw new Error("Database name is required.");

		this._overrideDbName = dbName;

		return {
			db: this._client.db(dbName),
			client: this._client,
		};
	};

	/**
		* Immutable scoped provider: locks dbName unless ctx.dbName is explicitly provided.
	 * Safe for request handling (no shared mutation).
	 */
	withDatabase(dbName: string): BootstrapClient {
		return {
			db: async (ctx?: ModelContext) => {
				// keep the same resolution rules, but enforce a fallback dbName
				const merged: ModelContext = { ...ctx, dbName: ctx?.dbName ?? dbName };
				return this.db(merged);
			},
			connect: async () => {
				await this.connect();
				return this;
			},
			client: async (ctx?: ModelContext) => {
				const merged: ModelContext = { ...ctx, dbName: ctx?.dbName ?? dbName };
				return this.client(merged);
			},
			collection: async (collectionName: string, ctx?: ModelContext) => {
				const merged: ModelContext = { ...ctx, dbName: ctx?.dbName ?? dbName };
				return this.collection(collectionName, merged);
			},
			close: async () => {
				await this.close();
			}
		};
	}

	private resolveDbName(overrideDbName?: string): string {
		const ctx = AbimongoContext.get();

		const dbName =
			overrideDbName ??
			ctx?.dbName ??
			this._opts?.options?.dbName;

		if (!dbName) {
			throw new Error('Database name is required in client options.');
		}

		return dbName;
	}

	private resolveCollectionName(collectionName?: string): string {
		const ctx = AbimongoContext.get();

		const resolvedCollectionName =
			collectionName ??
			ctx?.collectionName;

		if (!resolvedCollectionName?.trim()) {
			throw new Error('Collection name is required.');
		}

		return resolvedCollectionName.trim();
	}

	private resolveTenantDbName(tenantId?: string): string {
		const resolvedTenantId = tenantId ?? AbimongoContext.get()?.tenantId;

		if (!resolvedTenantId) {
			return this.resolveDbName();
		}

		const tenant = MultiTenantManager.getTenant?.(resolvedTenantId);
		if (!tenant?.dbName) {
		  this.logWithContext('warn', `Tenant "${resolvedTenantId}" does not have a configured dbName. Falling back to default database.`);
		  	throw new Error(
				`No database configuration found for tenant "${resolvedTenantId}".`
			);
		}

		return tenant.dbName;
	}

	
	async withContext<T>(
		context: {
			tenantId?: string;
			requestId?: string;
			dbName?: string;
			collectionName?: string;
			session?: any;
		},
		callback: () => Promise<T>
	): Promise<T> {
		return AbimongoContext.run(
			{
				tenantId: context.tenantId,
				requestId: context.requestId,
				dbName: context.dbName,
				collectionName: context.collectionName,
				session: context.session
			},
			callback
		);
	}

	private logWithContext(level: 'info' | 'warn' | 'error', message: string, meta: Record<string, any> = {}) {
		const ctx = AbimongoContext.get();

		const enrichedMeta = {
			requestId: ctx?.requestId,
			tenantId: ctx?.tenantId,
			...ctx?.loggerMeta,
			...meta
		};

		this._opts.options?.config?.logger?.[level]?.(message, enrichedMeta);

	}

	/**
	 * Immutable scoped provider: locks tenantId unless ctx.tenantId is explicitly provided.
	 * Safe for request handling.
	 */
	withTenant(tenantId: string): BootstrapClient {
		return {
			db: async (ctx?: ModelContext) => {
				const merged: ModelContext = { ...ctx, tenantId: ctx?.tenantId ?? tenantId };
				return this.db(merged);
			},
			connect: async () => {
				await this.connect();
				return this;
			},
			client: async (ctx?: ModelContext) => {
				const merged: ModelContext = { ...ctx, tenantId: ctx?.tenantId ?? tenantId };
				return this.client(merged);
			},
			collection: async (collectionName: string, ctx?: ModelContext) => {
				const merged: ModelContext = { ...ctx, tenantId: ctx?.tenantId ?? tenantId };
				return this.collection(collectionName, merged);
			},
			close: async () => {
				await this.close();
			}
		};
	}

	/**
	 * Convenience: lock both tenantId and dbName.
	 */
	withScope(scope: { tenantId?: string; dbName?: string }): BootstrapClient {
		return {
			db: async (ctx?: ModelContext) => {
				const merged: ModelContext = {
					...ctx,
					tenantId: ctx?.tenantId ?? scope.tenantId,
					dbName: ctx?.dbName ?? scope.dbName,
				};
				return this.db(merged);
			},
			connect: async () => {
				await this.connect();
				return this;
			},
			client: async (ctx?: ModelContext) => {
				const merged: ModelContext = {
					...ctx,
					tenantId: ctx?.tenantId ?? scope.tenantId,
					dbName: ctx?.dbName ?? scope.dbName,
				};
				return this.client(merged);
			},
			collection: async (collectionName: string, ctx?: ModelContext) => {
				const merged: ModelContext = {
					...ctx,
					tenantId: ctx?.tenantId ?? scope.tenantId,
					dbName: ctx?.dbName ?? scope.dbName,
				};
				return this.collection(collectionName, merged);
			},
			close: async () => {
				await this.close();
			}
		};
	}

	/**
	 * Optional helper to reset override
	 */
	resetDatabase(): void {
		this._overrideDbName = undefined;
	}

	async startSession(ctx?: ModelContext): Promise<ClientSession> {
		const client = await this.client(ctx);
		return client.startSession();
	}

	private resolveSession(session?: any) {
		return session ?? AbimongoContext.get()?.session;
	}

	/**
	 * Drops the specified collection from the database.
	 * @returns {Promise<void>} A promise that resolves when the collection is dropped.
	 */
	async dropCollection(): Promise<void> {
		if (await this._client?.connect()) {
			await this._client?.db(this._opts.options?.dbName).collection(JSON.stringify(this.collectionName)).drop();
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
					this._client?.db(this._opts.options?.dbName).dropDatabase()
						.then(() => {
							console.log(`Dropped database: ${this._opts.options?.dbName}`);
							this._client?.close()
							// Remove the database from the instances map
							AbimongoClient.instances.delete(this._opts.options?.dbName as string);
							AbimongoClient.tenantDBs.delete(this._opts.options?.dbName as string);
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
			await this._client?.close();
			this._client = null;
			this._db = null;
		}
	}

	/**
	 * Closes the MongoDB client connection.
	 * @returns {Promise<void>} A promise that resolves when the client is closed.
	 */
	async close(): Promise<void> {
		if (this._client && this._connected) {
			await this._client?.close();
			this._client = undefined;
			this._connected = false;
		}
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
		const clientIsCOnnected = async () => {
			try {
				if (await this._client?.connect()) {
					isConnected = await this._client?.connect()
					console.log(`[info]: MongoDB client is connected: ${isConnected}`);
				}
				return isConnected;
			} catch (error) {
				console.log(`[error]: Error checking MongoDB client connection: ${error}`);
				return false;
			}
		}
		clientIsCOnnected();
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

	static async handleLogBatch(
		batch: (TopologyOpeningEvent | TopologyClosedEvent)[],
		transporter?: AsyncBatchTransporter
	): Promise<void> {
		if (!Array.isArray(batch) || batch.length === 0) {
			console.warn(`[warning]: Received an empty log batch or invalid format: ${batch}`);
			return;
		}

		// Always handle the first event explicitly
		this.handleTopologyEvent(batch[0]);

		const remaining = batch.slice(1);
		if (remaining.length > 0) {
			if (transporter) {
				for (const event of remaining) {
					transporter.log('info', 'Topology event (batch)', [event]);
				}
			} else {
				console.warn(`[warning]: No transporter provided; remaining batch will not be processed: ${remaining}`);
			}
		}
	}

}

/**
 * Abimongo inherits from AbimongoClientModule and provides a simplified interface for connecting to MongoDB databases.
 * It allows you to create an instance of Abimongo with a MongoDB URI and optional configuration options.
 */
export class Abimongo extends AbimongoClient {
	/**
	 * Creates an instance of Abimongo.
	 * @param {string} uri - The MongoDB connection URI.
	 * @param {AbimongoClientModuleConfig} [options] - Optional configuration options for the client.
	 * @throws {Error} If the URI is not provided.
	 */
	constructor({ uri, options }: AbimongoClientConfig) {
		super({ uri, options });
		// if (uri === undefined) {
		// 	throw new Error('MongoDB URI is required.');
		// }
	}

	/**
	 * Connects to the MongoDB database using the provided URI and options.
	 * @param {string} uri - The MongoDB connection URI.
	 * @param {AbimongoClientModuleOptions} [options] - Optional configuration options for the client.
	 * @returns {Promise<AbimongoClientModule>} A promise that resolves to the connected AbimongoClientModule instance.
	 */
	// static async connect({ uri, options }: AbimongoClientModuleConfig): Promise<AbimongoClientModule> {
	// 	return await abimongo.connection(uri, options);
	// }

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

export function createAbimongoClientModule(opts: AbimongoClientConfig) {
	return new AbimongoClient(opts);
}

export const abimongo = new Abimongo(`${{
	[abimongoSymbol]: true
}}` as unknown as AbimongoClientConfig);



