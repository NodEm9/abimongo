import type { ClientSession, Filter, UpdateFilter, Document } from 'mongodb';

export type AbimongoMiddlewareOperation =
  | 'find'
  | 'findOne'
  | 'create'
  | 'updateOne'
  | 'deleteOne'
  | 'deleteMany'
  | 'bulkInsert'
  | 'bulkUpdate'
  | 'aggregate'
  | 'findOneAndUpdate'
  | 'findOneAndDelete'
  | 'findOneAndReplace'
  | 'findOneAndUpsert';

export interface AbimongoMiddlewareContext<T extends Document = Document> {
  operation: AbimongoMiddlewareOperation;
  modelName?: string;
  collectionName: string;
  tenantId?: string;
  dbName?: string;
  session?: ClientSession;
  filter?: Filter<T>;
  update?: UpdateFilter<T>;
  doc?: Partial<T>;
  docs?: Partial<T>[];
  pipeline?: object[];
  result?: any;
  meta?: Record<string, any>;
}

export type AbimongoMiddlewareHandler<T extends Document = Document> =
	(ctx: AbimongoMiddlewareContext<T>) => Promise<void> | void;
	

	