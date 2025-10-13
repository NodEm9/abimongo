import { Collection, Db, MongoClient } from "mongodb";
import { AbimongoSchema } from "../core";
import { Document } from "./document";

/**
 * Options for configuring an Abimongo model.
 * @template T - The type of the document in the model.
 */
export interface AbimongoModelOptions<T extends Document = any> {
	/**
	 * The database instance to use.
	 */
	db?: Db;

	/**
	 * The MongoClient instance to use.
	 */
	client?: MongoClient;

	/**
	 * The tenant ID for multi-tenancy.
	 */
	tenantId?: string;

	/**
	 * The name of the collection.
	 */
	collectionName: string;

	/**
	 * The schema definition for the model.
	 */
	schema?: AbimongoSchema<T>;

	/**
	 * The MongoDB collection instance.
	 */
	collection?: Collection<T>;
	/**
	 * The TTL (Time To Live) index configuration for garbage collection.
	 */
	gcConfig?: {
		ttl: number; // in seconds
		indexName?: string; // optional custom index name

		createdAtField?: string; // optional custom field for creation date
		updatedAtField?: string; // optional custom field for last update date
		/**
		 * Whether to enable garbage collection for this model.
		 */
		enableGC?: boolean;
		/**
		 * The field to use for garbage collection.
		 */
		field?: string;
	}
};


/**
 * Represents a relationship between collections in MongoDB.
 * @template T - The type of the document in the collection.
 */
export interface Relationship<T = any>{
  /**
   * The name of the referenced collection.
   */
  ref: string;

  /**
   * The field in the current document that holds the reference.
   */
  localField: keyof T;
};