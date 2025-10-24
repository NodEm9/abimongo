import { Abimongo, abimongo, AbimongoClient } from "../src/lib-core";
import "dotenv/config";
// import { logger } from "./example-1/router";
// import { logger } from "../src/config";


export const dbConfig = {
	uri: process.env.MONGO_URI!,
	dbName: process.env.DB_NAME!,
	collectionName: 'tenants',
	tenantId: {
		'tenant-a': process.env.TENANT_A_ID,
		'tenant-b': process.env.TENANT_B_ID!,
		'tenant-c': process.env.TENANT_C_ID!,
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

		const clientDB = new AbimongoClient(process.env.TENANT_A_URI, {
			dbName: dbConfig.dbName,
			// logger: logger,
		});

		//  const dbName = await abimongo.useDatabase(dbConfig.dbName);
		// const clientDB = await abimongo.connectDb(process.env.TENANT_A_URI!, {
		// 	dbName: dbConfig.dbName
		// });

		await clientDB.connect();

		console.log(`Connected to database: ${[JSON.stringify(clientDB.db.databaseName)]}`);
		return clientDB;

	} catch (err: any) {
		console.error(`Error connecting to database:`, err?.stack);
		process.exit(1)
	}
};