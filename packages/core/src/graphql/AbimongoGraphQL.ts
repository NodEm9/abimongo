import 'dotenv/config';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { gql } from "graphql-tag"
import { GraphQLSchema } from 'graphql/type/schema';
import { ObjectId, Db } from 'mongodb';
import {
  checkPermission,
  enforceRBAC,
  invalidateTenantCache,
} from "../middleware/rbac/rbacMiddleware";
import { AbimongoGraphQLOptions } from '../types';
import { redis } from '../redis-manager/redisClient';
import { Role } from '../middleware';
import { getTenantDB } from '../utils/builders/getTanantDb';
import { DB_CHANGE_EVENT } from '../utils';



interface UserContext {
  user: { role: Role; tenantId: string };
  db: Db;
  collection: string;
  // tenantId: string ;
};

/**
 * AbimongoGraphQL provides GraphQL schema generation with Redis integration and RBAC support.
 * @class AbimongoGraphQL
 * @remarks Supports multi-tenancy and realtime subscriptions via Redis.
 * @example
 * const graphql = new AbimongoGraphQL({ useRedis: true });
 */
export class AbimongoGraphQL {
  private typeDefs: string[] = [];
  private resolvers: any[] = [];
  private redis = redis
  private useRedis: boolean;
  private subscriber = this.redis.duplicate();
  private publisher = this.redis.duplicate();

  constructor(private options: AbimongoGraphQLOptions = {}) {
    this.useRedis = this.options.useRedis !== false; // Default to true
    this.typeDefs = this.options.customTypeDefs || [];
    this.resolvers = this.options.customResolvers || [];
  }

  /**
 * Add custom typeDefs (string or SDL array)
 */
  customTypeDefs(schema: string | string[]) {
    if (Array.isArray(schema)) {
      this.typeDefs.push(...schema);
    } else {
      this.typeDefs.push(schema);
    }
    return this; // For chaining
  }

  /**
   * Add custom resolvers (will be merged)
   */
  customResolvers(resolver: any) {
    this.resolvers.push(resolver);
    return this; // For chaining
  }

  private async ensureRedis() {
    if (!this.useRedis) return;
    try {
      if (!this.redis.isOpen) {
        await this.redis.connect();
        await this.publisher.connect();
        await this.subscriber.connect();
      }
      console.log('🔄 Ensuring Redis connection...', 'info', {});
      console.log('✅ Redis connection established', 'info', {});
    } catch (err: any) {
      console.log('⚠️ Redis connection skipped or failed:', 'error', err.message);
    }
  }

  /** Use this pattern anywhere Redis is needed */
  private async publishEvent(channel: string, payload: any) {
    const context: UserContext = {
      user: { role: 'admin', tenantId: 'default' }, // Default context
      db: await getTenantDB('default'), // Default DB
      collection: 'default', // Default collection
    };
    try {
      if (!redis.isOpen) {
        console.log('[ABIMONGO] Redis client is not open. Attempting to connect...', 'info', { "tenantId": context.user.tenantId });

        await this.ensureRedis();
        console.log('[ABIMONGO] Redis client connected successfully', 'info', { 'tenantId': context.user.tenantId });
        await this.publisher.publish(channel, JSON.stringify(payload));
      }

      console.log(`[ABIMONGO] ✅ Published to Redis channel "${channel}"`, 'info', { "tenantId": context.user.tenantId });
      return { channel, payload };

    } catch (error) {
      console.log(`[ABIMONGO] ⚠️ Failed to publish to Redis channel "${channel}"`, 'error', { "tenantId": context.user.tenantId });
      console.log(`${error}`);
    }

  }

  /**
   * Add custom typeDefs and resolvers
   */
  private defaultTypeDefs() {
    return gql`
      type Document {
        _id: ID!
        name: String
        email: String
        tenantId: String
      }

      type Query {
        findOne(collection: String!, id: ID!): Document
        findAll(collection: String!): [Document]
      }

      type Mutation {
        createUser(name: String!, email: String!): Document
        createUserWithTenant(name: String!, email: String!, tenantId: String!): Document
        insertOne(collection: String!, data: JSON!): Document
        updateOne(collection: String!, id: ID!, data: JSON!): Document
        deleteOne(collection: String!, id: ID!): Boolean
      }

      type Subscription {
        documentInserted(collection: String!): Document
        documentUpdated(collection: String!): Document
        documentDeleted(collection: String!): ID
      }

      scalar JSON
    `;
  }

  private defaultResolvers() {
    return {
      Query: {
        findOne: enforceRBAC(async (_: any, { collection, id }: any, context: UserContext) => {
          const db = await getTenantDB(context.user.tenantId);
          return db.collection(collection).findOne({
            _id: new ObjectId(id),
            tenantId: context.user.tenantId
          });
        }, 'read'),

        findAll: enforceRBAC(async (_: any, { collection }: any, context: UserContext) => {
          const { user } = context;
          if (!checkPermission(user.role, 'read')) throw new Error('Unauthorized');
          const db = await getTenantDB(user.tenantId);
          return db.collection(collection).find({ tenantId: user.tenantId }).toArray();
        }, 'read'),
      },

      Mutation: {
        createUser: enforceRBAC(async (_: any, { name, email }: any, context: UserContext) => {
          const db = await getTenantDB(context.user.tenantId);
          const result = await db.collection(context.collection).insertOne({ name, email, tenantId: context.user.tenantId });
          const newDoc = await db.collection(context.collection).findOne({ _id: result.insertedId });

          try {
            console.log('[insertOne] publishing to Redis...');
            await this.publishEvent(`${DB_CHANGE_EVENT}_${context.collection}`, JSON.stringify({ documentInserted: newDoc }));

            // logDefaultEvent('create', `[insertOne] Document inserted in ${context.collection}`, 'info', { "tenantId": context.user.tenantId, });
            console.log('create', `[insertOne] Document inserted in ${context.collection}`, 'info', { "tenantId": context.user.tenantId, });
            return newDoc;
          } catch (err: any) {
            // Log the error if Redis publish fails
            // logDefaultEvent('create', `[insertOne] ❌ Redis publish error: ${err.message}`, 'error', { "tenantId": context.user.tenantId, });
            console.log('create', `[insertOne] ❌ Redis publish error: ${err.message}`, 'error', { "tenantId": context.user.tenantId, });
          }
          await invalidateTenantCache(context.user.tenantId, context.user.role);
          return newDoc;
        }, 'create'),

        insertOne: enforceRBAC(async (_: any, { collection, data }: any, context: UserContext) => {
          const db = await getTenantDB(context.user.tenantId);
          const result = await db.collection(collection).insertOne({ ...data, tenantId: context.user.tenantId });
          const newDoc = await db.collection(collection).findOne({ _id: result.insertedId });

          try {
            await this.publishEvent(`${DB_CHANGE_EVENT}_${collection}`, JSON.stringify({ documentInserted: newDoc }));
            // logDefaultEvent('create', `[insertOne] Document inserted in ${context.collection}`, 'info', { "tenantId": context.user.tenantId, });
            console.log('create', `[insertOne] Document inserted in ${context.collection}`, 'info', { "tenantId": context.user.tenantId, });
            return newDoc
          } catch (err: any) {
            // logDefaultEvent('create', `[insertOne] ❌ Redis publish error: ${err.message}`, 'error', { "tenantId": context.user.tenantId, });
            console.log('create', `[insertOne] ❌ Redis publish error: ${err.message}`, 'error', { "tenantId": context.user.tenantId, });
          }
          // Invalidate cache after insert
          await invalidateTenantCache(context.user.tenantId, context.user.role);
          // logDefaultEvent('create', `[insertOne] Cache invalidated`, 'info', { "tenantId": context.user.tenantId, });
          console.log(`[insertOne] Cache invalidated for tenant ${context.user.tenantId} and role ${context.user.role}`, 'info', { "tenantId": context.user.tenantId });
          return newDoc

        }, 'create'),

        updateOne: enforceRBAC(async (_: any, { collection, id, data }: any, context: UserContext) => {
          const db = await getTenantDB(context.user.tenantId);
          await db.collection(collection).updateOne({
            _id: new ObjectId(id)
          }, { $set: data });
          const updatedDoc = await db.collection(collection).findOne({ _id: new ObjectId(id) });

          try {
            await this.publishEvent(`${DB_CHANGE_EVENT}_${collection}`, JSON.stringify({ documentUpdated: updatedDoc }));
            // logDefaultEvent(
            //   'updateOne',
            //   `[updateOne] Document updated in ${collection}`,
            //   'info',
            //   { "tenantId": context.user.tenantId, }
            // );
            console.log(`Document updated: ${id}`);

            return updatedDoc;
          } catch (err: any) {
            // logDefaultEvent('updateOne', `[updateOne] ❌ Redis publish error: ${err.message}`, 'error', { "tenantId": context.user.tenantId, });
            console.log('Redis publish error:', err);
          }
          await invalidateTenantCache(context.user.tenantId, context.user.role);
          return updatedDoc;
        }, 'update'),

        deleteOne: enforceRBAC(async (_: any, { collection, id }: any, context: UserContext) => {
          const db = await getTenantDB(context.user.tenantId);
          const result = await db.collection(collection).deleteOne({ _id: new ObjectId(id) });

          if (result.deletedCount) {
            try {
              await this.publishEvent(`${DB_CHANGE_EVENT}_${collection}`, JSON.stringify({ documentDeleted: id }));
              // logDefaultEvent(
              //   'deleteOne',
              //   `[deleteOne] Document deleted from ${collection}`,
              //   'info',
              //   { "tenantId": context.user.tenantId, }
              // );
              console.log(`Document deleted: ${id}`);

              return true;
            } catch (err: any) {
              console.error('Redis publish error:', err);
              // logDefaultEvent('deleteOne', `[deleteOne] ❌ Redis publish error: ${err.message}`, 'error', { "tenantId": context.user.tenantId, });
            }
          }
          await invalidateTenantCache(context.user.tenantId, context.user.role);

          return false;

        }, 'delete'),
      },

      Subscription: {
        documentInserted: {
          subscribe: async (_: any, { collection }: any) => {
            if (!this.useRedis) throw new Error('Subscriptions disabled: Redis not enabled');
            await this.subscriber?.subscribe(`${DB_CHANGE_EVENT}_${collection}`, (err, message) => {
              if (err) throw new Error(err);
              console.log(`Received:, ${message}`, 'info', {});
              return message;
            })
          }
        },
        documentUpdated: {
          subscribe: async (
            _: any,
            { collection }: { collection: string }) => {
            if (!this.useRedis) throw new Error('Subscriptions disabled: Redis not enabled');
            await this.subscriber?.subscribe(`${DB_CHANGE_EVENT}_${collection}`, (err, message) => {
              if (err) throw new Error(err);
              console.log(`Received:, ${message}`, 'info', {});
              return message;
            })
          }
        },
        documentDeleted: {
          subscribe: async (
            _: any,
            { collection }: { collection: string }) => {
            if (!this.useRedis) throw new Error('Subscriptions disabled: Redis not enabled');
            await this.subscriber?.subscribe(`${DB_CHANGE_EVENT}_${collection}`, (err, message) => {
              if (err) throw new Error(err);
              console.log(`Received:, ${message}`, 'info', {});
              return message;
            })
          }
        },
      }
    };
  }

  subscriptions() {
    return this.useRedis;
  }

  /**
   * Dynamically generate GraphQL Schema
   */
  async generateSchema(model?: any, enableSubscriptions?: boolean): Promise<GraphQLSchema> {
    await this.ensureRedis();
    return makeExecutableSchema({
      typeDefs: [this.defaultTypeDefs(), ...this.typeDefs],
      resolvers: [this.defaultResolvers(), ...this.resolvers],
      ...enableSubscriptions && { subscriptions: this.subscriptions() },
      schemaExtensions: model || {},
    });
  }
};