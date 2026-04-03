import { Abimongo, abimongo, AbimongoClient, createAbimongoClientModule } from "../src/lib-core";
import "dotenv/config";
import { MultiTenantManager } from "../src/tanancy";
import { DbProvider } from "../src/types";
import { MongoClient } from "mongodb";
// import { logger } from "./example-1/router";
// import { logger } from "../src/config";


export const dbConfig = {
	uri: process.env.MONGO_URI || "mongodb://localhost:27017",
	dbName: process.env.DB_NAME || "abimongo",
	collectionName: 'abimongo_tenants',
	tenantId: {
		'tenant-a': 'tenant-a',
		'tenant-b': 'tenant-b',
		'tenant-c': 'tenant-c',
	},
	tenantUri: {
		'tenant-a': "mongodb://localhost:27017/tenant-a",
		'tenant-b': "mongodb://localhost:27017/tenant-b",
		'tenant-c': "mongodb://localhost:27017/tenant-c",
	}
}

export async function dbDriver() {
	try {

		const tenants = dbConfig.tenantUri
		const tArray = Array.isArray(tenants);
		console.log(`Tenants Type: ${tArray}, Tenants: ${JSON.stringify(tenants)}`);

		const clientDB = AbimongoClient.init({
			uri: dbConfig.uri,
			options: { dbName: dbConfig.dbName },
		});


		createAbimongoClientModule({
			uri: dbConfig.uri,
			options: { dbName: dbConfig.dbName },
			tenantResolver: {
				getClient: async (tenantId: string) => {
					let tenantUri = dbConfig.tenantUri["tenant-a"];
					tenantId = tenantUri || "tenant-a";
					console.log(`Resolving tenant: ${tenantId}, URI: ${tenantUri}`);
					return await abimongo.client()
				}
			}
		});

		//  const dbName = await abimongo.useDatabase(dbConfig.dbName);
		// const clientDB = await abimongo.connectDb(process.env.TENANT_A_URI!, {
		// 	dbName: dbConfig.dbName
		// });

		await clientDB.connect();

		console.log(`Connected to database: ${[JSON.stringify((await clientDB.db()).databaseName)]}`);
		return clientDB;

	} catch (err: any) {
		console.error(`Error connecting to database:`, err?.stack);
		process.exit(1)
	}
};