import { ClientSession, Db, MongoClient } from "mongodb";
import { AbimongoConfig } from "./AbimongoConfig";

export type ModelContext = {
	tenantId?: string;
	dbName?: string;
	collectionName?: string;
	config?: AbimongoConfig;
	session?: ClientSession
};


export interface DbProvider {
	db(ctx?: ModelContext): Promise<Db>;
	client?(ctx?: ModelContext): Promise<MongoClient>;
	startSession?(ctx?: ModelContext): Promise<ClientSession>;
}

