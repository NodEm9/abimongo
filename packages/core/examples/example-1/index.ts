import 'dotenv/config';
import { AbimongoClient, AbimongoModel, AbimongoSchema } from "../../src/lib-core";
import { dbDriver, dbConfig } from "../dbConfig";
import { Document } from "../../src/types";
import { createSchema } from "../../src/utils"
import { Model } from "../../src/utils";
import { logger } from '../../src/config';
import { gc } from '../index';
import { GCSettings } from '../../src/decorators/gcSettings';
import { Session } from 'inspector/promises';
import { MultiTenantManager } from '../../src/tanancy';


export interface User extends Document {
  name: string;
  email: string;
  contact: string;
  _id?: string;
  tenantId?: string;
  session?: Session
}

export interface PostDocument extends Document {
  _id?: string;
  title: string;
  content: string;
  createdAt: Date;
  // Add other fields as needed
  // authorId?: string; // Optional field for user reference
}


export const userSchema = createSchema<User>({
  name: { type: 'string', required: true },
  email: { type: 'string', required: true },
  contact: { type: 'string', required: true },
  tenantId: { type: 'string', required: false },
}).setGCConfig({
  ttlField: 'createdAt',
  expiresIn: '1m', // 1 minute
  softDelete: true,
  archiveBeforeDelete: true,
});

// export const postSchema = new AbimongoSchema<PostDocument>({
//   title: String,
//   content: String,
//   createdAt: {
//     type: Date,
//     default: () => new Date(),
//   },
// }).setGCConfig({
//   ttlField: 'createdAt',
//   expiresIn: '3m', // 3 minutes
//   // expiresIn: '30d', // 30 days
//   softDelete: false, // or true, if you want to keep "deletedAt" timestamp instead of deleting
// });

export const postSchema = new AbimongoSchema<PostDocument>({
  title: String,
  createdAt: { type: Date, default: () => new Date() },
  deletedAt: { type: Date, default: null }
}).setGCConfig({
  ttlField: 'createdAt',
  expiresIn: '30s',
  softDelete: true,
  archiveBeforeDelete: true
});


// @GCSettings( { ttl: 60 }) // <-- Apply TTL of 60 seconds
// export class UserSchema extends AbimongoSchema<User> {
//   constructor() {
//     super({
//       name: { type: 'string', required: true },
//       email: { type: 'string', required: true },
//       deletedAt: { type: 'date', default: null },
//     });
//   }
// }

export class UserSchema extends AbimongoSchema<User> {
  constructor() {
    super({
      name: { type: 'string', required: true },
      email: { type: 'string', required: true },
      deletedAt: { type: 'date', default: null },
    });
    this.setGCConfig({
      ttlField: 'deletedAt',
      expiresIn: '60s', // 60 seconds
      softDelete: true
    });
  }
}

// export const UserModel = new AbimongoModel<User>({
//   collectionName: 'users',
//   schema: userSchema,
//   provider: dbDriver().then(db => db),
// })

// ';
// import { runGarbageCollector } from '../../abimongo_core/gc/gcManager';

// const mongoUri = 'mongodb://localhost:27017/testdb';

export async function setup() {
  // await dbDriver();
  const db = await dbDriver();
  // AbimongoClient.getTenantDB('test-tenant');
  const schema = new UserSchema();
  // const schema = postSchema
  return new AbimongoModel<User>({
    collectionName: 'users',
    schema,
    provider: db
  });
}

(async () => {
  const userModel = await setup();
  const postModel = await setup();

  // Insert a user marked as deleted more than 1 minute ago
  await userModel.create({
    name: 'John Doe',
    email: 'john@example.com',
    contact: '1234567890',
    tenantId: dbConfig.tenantId['tenant-a'],
    deletedAt: new Date(Date.now() - 1000 * 120), // 2 minutes ago
  });

  // const post = await postModel.create({
  //   title: 'My First Post',
  //   content: 'This is the content of my first post.',
  //   createdAt: new Date(),
  //   deletedAt: new Date(Date.now() + 1000 * 120), // 2 minutes ago
  // });

  logger?.info('[Test] Inserted expired soft-deleted user');

  // Run GC
  const result = await userModel.startAutoGC();
  // const result = await postModel.startAutoGC();
  console.log('[Test] GC Result:', result);

  // const remaining = await userModel.find();
  const remaining = await postModel.find();
  console.log('[Test] Remaining documents:', remaining);
})();





// export const UserModel = createModel<User>({
//   name: 'users',
//   schema: userSchema,
//   tenantId: dbConfig.tenantId['tenant-a'],
// });

// (async function registerTenants(){
// 	// Register tenants
// 	for (const [tenantId, uri] of Object.entries(dbConfig.tenantUri)) {
// 		await MultiTenantManager.registerTenant(tenantId, uri);
// 		logger.info(`Registered tenant: ${tenantId} with URI: ${uri}`);
//   }
//   try {
//     const tenantClient = await MultiTenantManager.getClient(dbConfig.tenantId['tenant-a']);
//     const dbName = tenantClient?.db().databaseName;
//     const connectedTenant = MultiTenantManager.getConnectedTenant()
//     logger.info(`Successfully connected to tenant: ${connectedTenant} with DB: ${dbName}`);
//   } catch (err) {
//     logger.error(`Error connecting to tenant: ${dbConfig.tenantId['tenant-a']}`, err);
//   }

//   console.log('All tenants registered successfully.');
// })();

// registerTenants().then(() => {
// 	logger.info('All tenants registered successfully.');
// }).catch((err) => {
// 	logger.error('Error registering tenants:', err);
// });


export async function main(data: User) {
  const client = await dbDriver();
  try {
    // const tenantId = 'tenantId123';
    const userCollection = await client.getCollection<User>('users');;
    // const tenantDB = await connectToTenantDB(tenantId);
    // const tenantDB2 = await AbimongoClient.getTenantDB(tenantId);
    // const tenantDB = await connectToTenantDB(`${db.db?.databaseName}`);
    // const tenantDb = await AbimongoClient.getDatabase(`${tenantId}`, process.env.MONGO_URI!);

    // console.log('Tenant DB:', tenantDb.databaseName);


    // const dbase = await AbimongoClient.getTenantDB('default');

    // const PostModel = new AbimongoModel<PostDocument>({
    //   collectionName: dbase.collection<PostDocument>('posts').collectionName,
    //   schema: postSchema
    // });

    // gc.register(dbase.collection('post'), postSchema as AbimongoSchema<Document>);
    // PostModel.startAutoGC();
    // const newPost = await PostModel.create({
    //   title: 'My First Post',
    //   content: 'This is the content of my first post.',
    //   createdAt: new Date(),
    //   // authorId: 'user123', // Optional field for user reference
    // });
    // if (!newPost) {
    //   console.error('Post not created: Check your data and schema');
    //   return;
    // }
    // console.log('New Post:', newPost);

    // const tenantDb = await client.useDatabase(`${(await client.db())?.databaseName}`);

    // Create a model for the user collection
    // const UserModel =
    //   createModel<User>({
    //     name: userCollection.collectionName,
    //     schema: userSchema,
    //     tenantId: dbConfig.tenantId['tenant-a'],
    //     db: tenantDb,
    //     // client: db.client,
    //   });

    const UserModel = new AbimongoModel<User>({
      collectionName: userCollection.collectionName,
      schema: userSchema,
      provider: client,
      // ctx: { tenantId: dbConfig.tenantUri['tenant-a'] } // Pass tenantId in context for multi-tenancy,
    });
    // if (!UserModel) {
    //   return console.error('Model Error: User not created');
    // };

    const newUser = await UserModel.create({
      name: data.name,
      email: data.email,
      contact: data.contact,
      tenantId: data.tenantId,
      session: data.session // <-- Pass session in context if needed
    });

    if (!newUser) {
      console.error('User not created: Check your data and schema');
      return;
    }

    console.log('New User:', { ...newUser });

    UserModel.startAutoGC();
    // UserModel.watchChanges(() => {
    //   console.log('User Model changed');
    // });

    // Find users
    const users = await UserModel.find();
    console.log('All users found:', users);

    //Update a user
    // await UserModel.updateOne(
    //   { _id: newUser._id },
    //   { $set: { age: 30 } }
    // );

    const usersUpdate = await UserModel.findOne({ _id: newUser._id });
    if (!usersUpdate) return
    console.log('User Update:', usersUpdate);

    const fetchCachedData = await UserModel.findCached(newUser._id!);
    console.log('Cached User:', fetchCachedData);

    // const cacheData = await AbimongoModel.cacheResult(newUser._id!, { ...newUser }, 120); // Cache for 120 seconds
    // console.log('Cache Data Set:', JSON.stringify(cacheData));

    // Delete a user
    // await UserModel.deleteOne({ _id: newUser._id });
    return newUser;

  } catch (error: any) {
    console.error('Error creating user:', error);
    console.error(error.stack);
  }

  // Disconnect from the database
  // await db.disconnect();
  await client.close();
}


export const getUsers = async () => {
  const db = await dbDriver();
  const userCollection = await db.getCollection<User>('users');
  const tenantDb = await db.useDatabase(`${(await db.db())?.databaseName}`);
  const UserModel = Model<User>({
    collectionName: userCollection.collectionName,
    schema: userSchema,

  });

  const users = await UserModel.find({});
  if (!users) {
    console.error('No users found');
    return;
  }
  console.log('All Users:', users);
  // if (users?.length) {
  //   console.log('All Users:', users);
  // } else {
  //   console.log('No users found.');
  // }

  // Disconnect from the database
  // await db.disconnect();
  return { users: users };
}

export const deleteUser = async (userId: string) => {
  const db = await dbDriver();
  const userCollection = await db.getCollection<User>('users');
  const tenantDb = await db.useDatabase(`${(await db.db())?.databaseName}`);
  const UserModel = Model<User>({
    collectionName: userCollection.collectionName,
    schema: userSchema,
  });
  await UserModel.deleteOne({ _id: userId });
  console.log(`User with ID ${userId} deleted.`);

// Disconnect from the database
  // await db.disconnect();
  return  { deletedCount: 1 };
}