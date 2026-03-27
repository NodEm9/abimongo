import type {
  Db,
  Collection,
  // Document,
  MongoClient,
  ClientSession,
} from "mongodb";
import { Document } from "./document.js";
import { DbProvider, ModelContext } from "./db.provider.js";

export interface BootstrapClient extends DbProvider {
  connect(): Promise<this>;
  close(): Promise<void>;
  client(ctx?: ModelContext): Promise<MongoClient>;
  collection<T extends Document = Document>(
    collectionName: string,
    ctx?: ModelContext
  ): Promise<Collection<T>>;
}