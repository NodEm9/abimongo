import { ClientSession, Db, MongoClient } from "mongodb";
import { AbimongoConfig } from "./AbimongoConfig.js";

export type ModelContext = {
  tenantId?: string;
  dbName?: string;
  db?: Db;
  collectionName?: string;
  config?: AbimongoConfig;
  session?: ClientSession;
  withDeleted?: boolean;
  onlyDeleted?: boolean;
  hardDelete?: boolean;
};


export interface DbProvider {
	db(ctx?: ModelContext): Promise<Db>;
	client?(ctx?: ModelContext): Promise<MongoClient>;
	startSession?(ctx?: ModelContext): Promise<ClientSession>;
}

export interface AbimongoLoggerLike {
	info?: (message: string, meta?: Record<string, any>) => void;
	warn?: (message: string, meta?: Record<string, any>) => void;
	error?: (message: string, meta?: Record<string, any>) => void;
	debug?: (message: string, meta?: Record<string, any>) => void;
}

export interface AbimongoContextState {
	tenantId?: string;
	requestId?: string;
	dbName?: string;
	collectionName?: string;
	session?: ClientSession;
	loggerMeta?: Record<string, any>;
	logger?: AbimongoLoggerLike;
	debug?: boolean;
	meta?: Record<string, any>;
	observer?: AbimongoQueryObserver;
}

export interface AbimongoQueryObserver {
  onQuery?: (payload: Record<string, any>) => void | Promise<void>;
  onQueryError?: (payload: Record<string, any>) => void | Promise<void>;
}