import { Abimongo, abimongo, AbimongoClient } from "../src/lib-core";
import { MultiTenantManager } from "../src/tanancy/MultiTenantManager";
import "dotenv/config";
// import { logger } from "./example-1/router";
// import { logger } from "../src/config";


export const dbConfig = {
	uri: process.env.MONGO_URI!,
	dbName: 'abimongo-example',
	collectionName: 'tenants',
	tenantId: {
		'tenant-a': 'tenant-a',
		'tenant-b': 'tenant-b',
		'tenant-c': 'tenant-c',
	},
	tenantUri: {
		'tenant-a': process.env.TENANT_A_URI!,
		'tenant-b': process.env.TENANT_B_URI!,
		'tenant-c': process.env.TENANT_C_URI!,
	}
}

export async function dbDriver() {
	try {

		const tenants = dbConfig.tenantUri
		Array.isArray(tenants) || console.error('Invalid tenant URIs configuration:', tenants);

		const clientDB = new AbimongoClient(tenants['tenant-a'], {
			dbName: dbConfig.dbName,
			// logger,
		});

		//  const dbName = await abimongo.useDatabase(dbConfig.dbName);
		// const clientDB = await abimongo.connectDb(process.env.TENANT_A_URI!, {
		// 	dbName: dbConfig.dbName
		// });

		await clientDB.connect();

		// Register lazy tenant URIs so they can be resolved on first use
		const tenantUris = dbConfig.tenantUri || {};
		for (const [tid, uri] of Object.entries(tenantUris)) {
			if (typeof uri === 'string' && uri.length > 0) {
				MultiTenantManager.registerLazyTenant(tid, uri);
			}
		}

		console.log(`Connected to database: ${[JSON.stringify(clientDB.db.databaseName)]}`);
		return clientDB;

	} catch (err: any) {
		console.error(`Error connecting to database:`, err?.stack);
		process.exit(1)
	}
};