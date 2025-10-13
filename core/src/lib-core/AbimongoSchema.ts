import { Collection, OptionalUnlessRequiredId } from "mongodb";
import {
	HookFunction,
	SchemaDefinition,
	Document,
	Relationship
} from "../types";
// import { logger } from "../config";
import { GCConfig } from "../types";


/**
 * The AbimongoSchema class allows you to define a schema for your MongoDB documents, including custom validation, indexing, and relationships between collections.
 * It also supports hooks for pre- and post-processing of documents, as well as virtual fields
 */
export class AbimongoSchema<T extends Document> {
	private schemaDefinition: SchemaDefinition<T>;
	private hooks: Record<string, Array<(data: any) => Promise<void>>> = {};
	private indexes: any[] = [];
	private virtuals: { [key: string]: (doc: any) => any } = {};
	private validators: { [key: string]: (value: any) => boolean } = {};
	private relationships: Relationship[] = [];
	private gcConfig?: GCConfig;


	/**
	 * Creates an instance of AbimongoSchema.
	 * @param {SchemaDefinition<T> | Record<keyof T, any>} schemaDefinition - The schema definition for the document.
	 */
	constructor(schemaDefinition: SchemaDefinition<T>) {
		this.schemaDefinition = schemaDefinition;
	}

	/**
	 * Retrieves the schema definition.
	 * @returns {Record<keyof T, any>} The schema definition.
	 */
	getSchema(): SchemaDefinition<T> {
		return this.schemaDefinition;
	}

	/**
	 * Adds a custom validator for a specific field.
	 * @param {string} field - The field to validate.
	 * @param {(value: any) => boolean} fn - The validation function.
	 */
	validator(field: string, fn: (value: any) => boolean): void {
		this.validators[field] = fn;
	}

	/**
	 * Validates a document against the schema's custom validators.
	 * @param {OptionalUnlessRequiredId<T>} doc - The document to validate.
	 * @throws {Error} If validation fails for any field.
	 */
	validate(doc: OptionalUnlessRequiredId<T>): void {
		for (const [field, validate] of Object.entries(this.validators)) {
			if (!validate(doc[field])) {
				console.log(`[error]: Validation failed for field: ${field}`);
				throw new Error(`Validation failed for field: ${field}`);
			}
		}
	}

	/**
	 * Adds an index to the schema.
	 * @param {any} fields - The fields to index.
	 * @param {any} [options] - Optional index options.
	 */
	index(fields: any, options?: any): void {
		this.indexes.push({ fields, options });
	}

	/**
	 * Applies all defined indexes to a MongoDB collection.
	 * @param {Collection<any>} collection - The MongoDB collection to apply indexes to.
	 * @returns {Promise<void>} Resolves when all indexes are applied.
	 */
	async applyIndexes(collection: Collection<any>): Promise<void> {
		for (const { fields, options } of this.indexes) {
			await collection.createIndex(fields, options);
		}
	}

	/**
	 * Adds a relationship to the schema.
	 * @param {string} ref - The name of the referenced collection.
	 * @param {keyof T} localField - The field in the current document that holds the reference.
	 */
	addRelationship(ref: string, localField: keyof T): void {
		this.relationships.push({ ref, localField });
	}

	/**
	 * Retrieves all relationships defined in the schema.
	 * @returns {Relationship[]} An array of relationships.
	 */
	getRelationships(): Relationship[] {
		return this.relationships;
	}

	/**
	 * Adds a virtual field to the schema.
	 * @param {string} name - The name of the virtual field.
	 * @param {(doc: any) => any} getter - The function to compute the virtual field's value.
	 */
	virtual(name: string, getter: (doc: any) => any): void {
		this.virtuals[name] = getter;
	}

	/**
	 * Applies all virtual fields to a document.
	 * @param {any} doc - The document to apply virtual fields to.
	 */
	applyVirtuals(doc: any): void {
		for (const [key, getter] of Object.entries(this.virtuals)) {
			Object.defineProperty(doc, key, {
				get: () => getter(doc),
				enumerable: true,
			});
		}
	}

	/**
	 * Adds a hook to be executed for a specific event.
	 * @param {string} event - The event name (e.g., "save", "delete").
	 * @param {HookFunction} fn - The hook function to execute.
	 */
	addHook(event: string, fn: HookFunction): void {
		if (!this.hooks[event]) this.hooks[event] = [];
		this.hooks[event].push(fn);
	}

	/**
	 * Executes all hooks for a specific event.
	 * @param {string} event - The event name.
	 * @param {any} data - The data to pass to the hook functions.
	 * @returns {Promise<void>} Resolves when all hooks are executed.
	 */
	async executeHooks(event: string, data: any): Promise<void> {
		if (this.hooks[event]) {
			for (const hook of this.hooks[event]) {
				await hook(data);
			}
		}
	}

	/**
	 * Adds a pre-hook for a specific action.
	 * @param {string} action - The action name (e.g., "save", "delete").
	 * @param {HookFunction} fn - The hook function to execute before the action.
	 */
	pre(action: string, fn: HookFunction): void {
		if (!this.hooks[action]) {
			this.hooks[action] = [];
		}
		this.hooks[action].push(fn);
	}

	/**
	 * Retrieves all hooks for a specific action.
	 * @param {string} action - The action name.
	 * @returns {Array<HookFunction>} An array of hook functions.
	 */
	getHooks(action: string): Array<HookFunction> {
		return this.hooks[action] || [];
	}

	/**
	 * Adds a post-hook for a specific action.
	 * @param {string} action - The action name (e.g., "save", "delete").
	 * @param {HookFunction} fn - The hook function to execute after the action.
	 */
	post(action: string, fn: HookFunction): void {
		if (!this.hooks[action]) {
			this.hooks[action] = [];
		}
		this.hooks[action].push(fn);
	}

	/**
	 * Triggers middleware for a specific action.
	 * @param {string} action - The action name.
	 * @param {any} data - The data to pass to the middleware functions.
	 * @returns {Promise<void>} Resolves when all middleware functions are executed.
	 */
	async triggerMiddleware(action: string, data: any): Promise<void> {
		const hooks = this.getHooks(action);
		if (!hooks.length) return;
		for (const hook of hooks) {
			try {
				await hook(data);
			} catch (error) {
				console.error(`[error]: Error in ${action} middleware:`, error);
			}
		};
	};

	registerSchema(schemaDefinition: SchemaDefinition<T>): void {
		this.schemaDefinition = schemaDefinition;
		console.info("Schema registered:", this.schemaDefinition);
	}

	setGCConfig(config: GCConfig): this {
		this.gcConfig = config;
		return this;
	}

	getGCConfig(): GCConfig | undefined {
		return this.gcConfig;
	}
}




export class Schema extends AbimongoSchema<Document> {
	constructor(schemaDefinition: SchemaDefinition<Document>) {
		super(schemaDefinition);
		this.registerSchema(schemaDefinition);
	}

	// You can add additional methods or overrides specific to your application needs
	async create(data: OptionalUnlessRequiredId<Document>): Promise<Document> {
		this.validate(data);
		return this.executeHooks('pre', data)
			.then(() => {
				// Here you would typically insert the document into the MongoDB collection
				// For example:
				// return this.collection.insertOne(data);
				return data; // Placeholder for actual insert operation
			})
			.then((result) => {
				this.applyVirtuals(result);
				return this.executeHooks('post', result).then(() => result);
			});
	}

	static create<T extends Document>(schemaDefinition: SchemaDefinition<T>): Schema {
		return new Schema(schemaDefinition);
	}
}



