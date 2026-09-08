import type { Db } from "mongodb";
import { AbimongoClient } from "../lib-core";
import { shutdownLogger } from "@abimongo/logger";

describe("AbimongoClient.db()", () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("should throw error if client is not connected", async () => {
		const client = new AbimongoClient({
			uri: "mongodb://localhost:27017",
			options: { dbName: "testdb" },
		});

		await expect(client.db()).rejects.toThrow(
			"AbimongoClient not connected. call connect() first."
		);
	});

	it("should return db using ctx.dbName override", async () => {
		const mockDb = { databaseName: "override_db" } as Db;
		const mockMongoClient = {
			db: jest.fn().mockReturnValue(mockDb),
		};

		const client = new AbimongoClient({
			uri: "mongodb://localhost:27017",
			options: { dbName: "defaultdb" },
		});

		Object.defineProperty(client, "_client", {
			value: mockMongoClient,
			writable: true,
		});

		Object.defineProperty(client, "_connected", {
			value: true,
			writable: true,
		});

		const db = await client.db({ dbName: "override_db" });

		expect(mockMongoClient.db).toHaveBeenCalledWith("override_db");
		expect(db).toBe(mockDb);
	});

	it("should return db using runtime override (_overrideDbName)", async () => {
		const mockDb = { databaseName: "runtime_db" } as Db;
		const mockMongoClient = {
			db: jest.fn().mockReturnValue(mockDb),
		};

		const client = new AbimongoClient({
			uri: "mongodb://localhost:27017",
			options: { dbName: "defaultdb" },
		});

		Object.defineProperty(client, "_client", {
			value: mockMongoClient,
			writable: true,
		});

		Object.defineProperty(client, "_connected", {
			value: true,
			writable: true,
		});

		Object.defineProperty(client, "_overrideDbName", {
			value: "runtime_db",
			writable: true,
		});

		const db = await client.db();

		expect(mockMongoClient.db).toHaveBeenCalledWith("runtime_db");
		expect(db).toBe(mockDb);
	});

	it("should return default db when no override exists", async () => {
		const mockDb = { databaseName: "defaultdb" } as Db;
		const mockMongoClient = {
			db: jest.fn().mockReturnValue(mockDb),
		};

		const client = new AbimongoClient({
			uri: "mongodb://localhost:27017",
			options: { dbName: "defaultdb" },
		});

		Object.defineProperty(client, "_client", {
			value: mockMongoClient,
			writable: true,
		});

		Object.defineProperty(client, "_connected", {
			value: true,
			writable: true,
		});

		const db = await client.db();

		expect(mockMongoClient.db).toHaveBeenCalledWith("defaultdb");
		expect(db).toBe(mockDb);
	});

	it("should resolve tenant database using tenantResolver", async () => {
		const mockTenantDb = { databaseName: "tenant_db" } as Db;
		const mockTenantClient = {
			db: jest.fn().mockReturnValue(mockTenantDb),
		};

		const tenantResolver = {
			getClient: jest.fn().mockResolvedValue(mockTenantClient),
		};

		const client = new AbimongoClient({
			uri: "mongodb://localhost:27017",
			options: { dbName: "defaultdb" },
			tenantResolver,
		});

		const db = await client.db({ tenantId: "tenant_a" });

		expect(tenantResolver.getClient).toHaveBeenCalledWith("tenant_a");
		expect(mockTenantClient.db).toHaveBeenCalledTimes(1);
		expect(db).toBe(mockTenantDb);
	});

	it("should throw if tenantId is provided but tenantResolver is missing", async () => {
		const client = new AbimongoClient({
			uri: "mongodb://localhost:27017",
			options: { dbName: "defaultdb" },
		});

		await expect(client.db({ tenantId: "tenant_a" })).rejects.toThrow(
			"Multi-tenancy not enabled. Provide tenantResolver to AbimongoClient or avoid passing tenantId."
		);
	});

	it("should throw if tenantResolver returns null for unknown tenant", async () => {
		const tenantResolver = {
			getClient: jest.fn().mockResolvedValue(null),
		};

		const client = new AbimongoClient({
			uri: "mongodb://localhost:27017",
			options: { dbName: "defaultdb" },
			tenantResolver,
		});

		await expect(client.db({ tenantId: "tenant_unknown" })).rejects.toThrow(
			'Tenant "tenant_unknown" is not registered.'
		);
	});

	it("should prefer ctx.dbName over _overrideDbName", async () => {
		const mockDb = { databaseName: "ctx_db" } as Db;
		const mockMongoClient = {
			db: jest.fn().mockReturnValue(mockDb),
		};

		const client = new AbimongoClient({
			uri: "mongodb://localhost:27017",
			options: { dbName: "defaultdb" },
		});

		Object.defineProperty(client, "_client", {
			value: mockMongoClient,
			writable: true,
		});

		Object.defineProperty(client, "_connected", {
			value: true,
			writable: true,
		});

		Object.defineProperty(client, "_overrideDbName", {
			value: "runtime_db",
			writable: true,
		});

		const db = await client.db({ dbName: "ctx_db" });

		expect(mockMongoClient.db).toHaveBeenCalledWith("ctx_db");
		expect(db).toBe(mockDb);
	});

	it("should prefer tenantId path over base client default db", async () => {
		const mockTenantDb = { databaseName: "tenant_db" } as Db;
		const mockTenantClient = {
			db: jest.fn().mockReturnValue(mockTenantDb),
		};

		const tenantResolver = {
			getClient: jest.fn().mockResolvedValue(mockTenantClient),
		};

		const mockMongoClient = {
			db: jest.fn(),
		};

		const client = new AbimongoClient({
			uri: "mongodb://localhost:27017",
			options: { dbName: "defaultdb" },
			tenantResolver,
		});

		Object.defineProperty(client, "_client", {
			value: mockMongoClient,
			writable: true,
		});

		Object.defineProperty(client, "_connected", {
			value: true,
			writable: true,
		});

		const db = await client.db({ tenantId: "tenant_a" });

		expect(tenantResolver.getClient).toHaveBeenCalledWith("tenant_a");
		expect(mockTenantClient.db).toHaveBeenCalledTimes(1);
		expect(mockMongoClient.db).not.toHaveBeenCalled();
		expect(db).toBe(mockTenantDb);
	});

	it("should throw for ctx.dbName when base client exists but is not connected", async () => {
		const mockMongoClient = {
			db: jest.fn(),
		};

		const client = new AbimongoClient({
			uri: "mongodb://localhost:27017",
			options: { dbName: "defaultdb" },
		});

		Object.defineProperty(client, "_client", {
			value: mockMongoClient,
			writable: true,
		});

		Object.defineProperty(client, "_connected", {
			value: false,
			writable: true,
		});

		await expect(client.db({ dbName: "override_db" })).rejects.toThrow(
			"AbimongoClient not connected. call connect() first."
		);
	});

	afterAll(async () => {
		let driver = new AbimongoClient({
			uri: "mongodb://localhost:27017",
			options: { dbName: "testdb" },
		});
		await driver.connect();
		await driver.dropDatabase();
		// await bufferedTransporter.stop();
		await driver.disconnect();
		await driver.close();
		// Clean up any resources if necessary
		driver = null as any; // Clear the driver instance
		jest.clearAllMocks();
		await shutdownLogger();
	});
});



// import { Db } from "mongodb";
// import { AbimongoClient } from "../lib-core/AbimongoClient";
// import { AbiMongoError, ErrorType } from "../utils";

// describe("AbimongoClient.db()", () => {

// 	it("should throw error if client is not connected", async () => {
// 		const client = new AbimongoClient({
// 			uri: "mongodb://localhost:27017",
// 			options: { dbName: "testdb" }
// 		});

// 		const message = 'AbimongoClient not connected. call connect() first.';
// 		const error = new Error(message).stack;
// 		const cause = ErrorType.CONNECTION_ERROR;

// 	await expect(client.db()).rejects.toThrow(
// 			AbiMongoError(
// 				ErrorType.AbiMongoConnectionError,
// 				message,
// 				error,
// 				cause,
// 			)
// 		)
// 	});

// 	it("should return db using ctx.dbName override", async () => {
// 		const mockDb = { databaseName: "override_db" } as Db;

// 		const mockMongoClient = {
// 			db: jest.fn().mockReturnValue(mockDb)
// 		};

// 		const client = new AbimongoClient({
// 			uri: "mongodb://localhost:27017",
// 			options: { dbName: "defaultdb" }
// 		});

// 		Object.defineProperty(client, "_client", {
// 			value: mockMongoClient,
// 			writable: true
// 		});

// 		const db = await client.db({ dbName: "override_db" });

// 		expect(mockMongoClient.db).toHaveBeenCalledWith("override_db");
// 		expect(db).toBe(mockDb);
// 	});

// 	it("should return db using runtime override (_overrideDbName)", async () => {
// 		const mockDb = { databaseName: "runtime_db" } as Db;

// 		const mockMongoClient = {
// 			db: jest.fn().mockReturnValue(mockDb)
// 		};

// 		const client = new AbimongoClient({
// 			uri: "mongodb://localhost:27017",
// 			options: { dbName: "defaultdb" }
// 		});

// 		Object.defineProperty(client, "_client", {
// 			value: mockMongoClient,
// 			writable: true
// 		});

// 		Object.defineProperty(client, "_overrideDbName", {
// 			value: "runtime_db",
// 			writable: true
// 		});

// 		const db = await client.db();

// 		expect(mockMongoClient.db).toHaveBeenCalledWith("runtime_db");
// 		expect(db).toBe(mockDb);
// 	});

// 	it("should return default database when no override exists", async () => {
// 		const mockDb = { databaseName: "defaultdb" } as Db;

// 		const mockMongoClient = {
// 			db: jest.fn().mockReturnValue(mockDb)
// 		};

// 		const client = new AbimongoClient({
// 			uri: "mongodb://localhost:27017",
// 			options: { dbName: "defaultdb" }
// 		});

// 		Object.defineProperty(client, "_client", {
// 			value: mockMongoClient,
// 			writable: true
// 		});

// 		const db = await client.db();

// 		expect(mockMongoClient.db).toHaveBeenCalledWith("defaultdb");
// 		expect(db).toBe(mockDb);
// 	});

// 	it("should throw if tenantId is provided but tenantResolver is missing", async () => {
// 		const mockMongoClient = {
// 			db: jest.fn()
// 		};

// 		const client = new AbimongoClient({
// 			uri: "mongodb://localhost:27017",
// 			options: { dbName: "defaultdb" }
// 		});

// 		Object.defineProperty(client, "_client", {
// 			value: mockMongoClient,
// 			writable: true
// 		});

// 		await expect(
// 			client.db({ tenantId: "tenant_a" })
// 		).rejects.toThrow(
// 			"Multi-tenancy not enabled. Provide tenantResolver to AbimongoClient or avoid passing tenantId."
// 		);
// 	});

// 	it("should resolve tenant database using tenantResolver", async () => {
//   const mockTenantDb = { databaseName: "tenant_db" } as Db;

//   const mockTenantClient = {
//     db: jest.fn().mockReturnValue(mockTenantDb)
//   };

//   const tenantResolver = {
//     getClient: jest.fn().mockResolvedValue(mockTenantClient)
//   };

//   const client = new AbimongoClient({
//     uri: "mongodb://localhost:27017",
//     options: { dbName: "defaultdb" },
//     tenantResolver
//   });

//   Object.defineProperty(client, "_client", {
//     value: { db: jest.fn() },
//     writable: true
//   });

//   const db = await client.db({ tenantId: "tenant_a" });

//   expect(tenantResolver.getClient).toHaveBeenCalledWith("tenant_a");
//   expect(mockTenantClient.db).toHaveBeenCalled();
//   expect(db).toBe(mockTenantDb);
// });

// });