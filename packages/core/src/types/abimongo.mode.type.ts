import { Collection, Db, MongoClient } from "mongodb";
import { AbimongoClient, AbimongoSchema } from "../lib-core";
import { Document } from "./document";
import { DbProvider } from "./db.provider";

/**
 * Options for configuring an Abimongo model.
 * @template T - The type of the document in the model.
 */
export interface AbimongoModelOptions<T extends Document = any> {
	collectionName: string;
	schema?: AbimongoSchema<T>;
	abimongo?: AbimongoClient;
	provider?: DbProvider;
	ctx?: {
		tenantId?: string;
		dbName?: string;
		db?: Db; // explicit override
	};
	collection?: Collection<T>;
	gcConfig?: {
		ttl: number; 
		indexName?: string; 
		createdAtField?: string; 
		updatedAtField?: string;
		enableGC?: boolean;
		field?: string;
	}
};


/**
 * Represents a relationship between collections in MongoDB.
 * @template T - The type of the document in the collection.
 */
export interface Relationship<T = any> {
	/**
	 * The name of the referenced collection.
	 */
	ref: string;

	/**
	 * The field in the current document that holds the reference.
	 */
	localField: keyof T;
};