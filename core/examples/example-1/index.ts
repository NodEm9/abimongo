import 'dotenv/config';
import { AbimongoModel } from "../../src/core/AbimongoModelFactory";
import { AbimongoSchema } from "../../src/core/AbimongoSchema";
import { dbDriver, dbConfig } from "../dbConfig";
import { Document } from "../../src/types";
import { createSchema } from "../../src/utils"
import { createModel } from "../../src/utils";
import { logger } from '../../src/config';
import { AbimongoClient } from '../../src/core';
import { gc } from '../index';
import { GCSettings } from '../../src/decorators/gcSettings';

export interface User extends Document {
  _id?: string;
  name: string;
  email: string;
  contact: string;
  tenantId: string;
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
  tenantId: { type: 'string', required: true },
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


@GCSettings({ ttl: 60 }) // <-- Apply TTL of 60 seconds
export class UserSchema extends AbimongoSchema<User> {
  constructor() {
    super({
      name: { type: 'string', required: true },
      email: { type: 'string', required: true },
      deletedAt: { type: 'date', default: null },
    });
  }
}

// export class UserSchema extends AbimongoSchema<User> {
//   constructor() {
//     super({
//       name: { type: 'string', required: true },
//       email: { type: 'string', required: true },
//       deletedAt: { type: 'date', default: null },
//     });
//     this.setGCConfig({
//       ttlField: 'deletedAt',
//       expiresIn: '60s', // 60 seconds
//       softDelete: true
//     });
//   }
// }


// ';
// import { runGarbageCollector } from '../../abimongo_core/gc/gcManager';

// const mongoUri = 'mongodb://localhost:27017/testdb';

async function setup() {
  await dbDriver();
  const db = AbimongoClient.getTenantDB('test-tenant');
  // const schema = new UserSchema();
  const schema = postSchema
  return new AbimongoModel({
    collectionName: 'posts',
    schema,
    db,
    tenantId: dbConfig.tenantId['tenant-a'],
  });
}

(async () => {
  // const userModel = await setup();
  const postModel = await setup();

  // Insert a user marked as deleted more than 1 minute ago
  // await userModel.create({
  //   name: 'John Doe',
  //   email: 'john@example.com',
  //   deletedAt: new Date(Date.now() - 1000 * 120), // 2 minutes ago
  // });

  const post = await postModel.create({
    title: 'My First Post',
    content: 'This is the content of my first post.',
    createdAt: new Date(),
    deletedAt: new Date(Date.now() + 1000 * 120), // 2 minutes ago
  });


  console.log('[Test] Inserted expired soft-deleted user');

  // Run GC
  // const result = await userModel.startAutoGC();
  const result = await postModel.startAutoGC();
  console.log('[Test] GC Result:', result);

  // console.log('[Test] GC result:', result);

  // const remaining = await userModel.find();
  const remaining = await postModel.find();
  console.log('[Test] Remaining documents:', remaining);
})();





// export const UserModel = createModel<User>({
//   name: 'users',
//   schema: userSchema,
//   tenantId: dbConfig.tenantId['tenant-a'],
// });


export async function main(data: User) {
  const db = await dbDriver();
  try {
    // const tenantId = 'tenantId123';
    const userCollection = db.getCollection<User>('users');
    // const tenantDB = await connectToTenantDB(tenantId);
    // const tenantDB2 = await AbimongoClient.getTenantDB(tenantId);
    // const tenantDB = await connectToTenantDB(`${db.db?.databaseName}`);
    // const tenantDb = await AbimongoClient.getDatabase(`${tenantId}`, process.env.MONGO_URI!);

    // console.log('Tenant DB:', tenantDb.databaseName);


    const dbase = await AbimongoClient.getTenantDB('default');

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

    const tenantDb = await db.useDatabase(`${db.db?.databaseName}`);

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
        tenantId: dbConfig.tenantId['tenant-a'],
        db: tenantDb,
        // client: db.client,
      });
    if (!UserModel) {
      return console.error('Model Error: User not created');
    };

    const validData = await UserModel.validate({ ...data });
    console.log('Valid Data:', { ...validData });

    const newUser = await UserModel.create({
      name: data.name,
      email: data.email,
      contact: data.contact,
      tenantId: data.tenantId,
    });
    if (!newUser) {
      console.error('User not created: Check your data and schema');
      return;
    }
    console.log('New User:', newUser);

    UserModel.startAutoGC();
    // UserModel.watchChanges(() => {
    //   console.log('User Model changed');
    // });

    // Find users
    const users = await UserModel.find();
    console.log('All Users:', users);

    //Update a user
    // await UserModel.updateOne(
    //   { _id: newUser._id },
    //   { $set: { age: 30 } }
    // );

    const usersUpdate = await UserModel.findOne({ _id: newUser._id });
    if (!usersUpdate) return
    console.log('User Update:', usersUpdate);

    const fetchCachedData = await UserModel.findCached(`${newUser._id}`);
    console.log('Cached User:', fetchCachedData);

    // Delete a user
    // await UserModel.deleteOne({ _id: newUser._id });
    return newUser;

  } catch (error: any) {
    console.error('Error creating user:', error);
    console.error(error.stack);
  }

  // Disconnect from the database
  // await db.disconnect();

}


export const getUsers = async () => {
  const db = await dbDriver();
  const userCollection = db.getCollection<User>('users');
  const tenantDb = await db.useDatabase(`${db.db?.databaseName}`);
  const UserModel = await createModel<User>({
    name: userCollection.collectionName,
    schema: userSchema,
    tenantId: dbConfig.tenantId['tenant-a'],
    db: tenantDb,
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
