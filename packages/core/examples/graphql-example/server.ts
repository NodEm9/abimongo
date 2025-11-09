import 'dotenv/config'
import { ApolloServer } from "@apollo/server";
import express from 'express';
// import cors from 'cors';
import { startStandaloneServer } from '@apollo/server/standalone';
import { AbimongoGraphQL } from "../../src/graphql/AbimongoGraphQL";
import { AbimongoSchema, AbimongoModel } from "../../src/lib-core";
import { dbDriver } from "../../examples/dbConfig";
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
// import { logger } from "../example-1/router";
// import { logger } from '../../src/core';
import { logger } from '../../src/config';

import { AbimongoGC } from '../../src/gc/AbimongoGC';


const httpServer = createServer(express());

// Initialize AbimongoGC for garbage collection
const gc = new AbimongoGC({ interval: '1m' }); // run cleanup every 1 minute
// Register the schema with the GC
gc.start();

interface User extends Document {
	[key: string]: any; // Add index signature
	name: string;
	email: string;
	age: number;
	tenanaId: string;
}


const userSchema = new AbimongoSchema<User>({
	name: String,
	email: String,
	age: Number,
	tenanaId: String,
});



const main = async () => {
	const db = await dbDriver();
	// Generate schema using AbimongoGraphQL
	const schema = new AbimongoGraphQL({ useRedis: true });
	userSchema.getGCConfig = () => ({
		ttlField: 'createdAt',
		expiresIn: '2m', // 2 minutes
		softDelete: true,
		archiveBeforeDelete: true,
	});
	
	// schema.customResolvers(
	// 	`
	// 	type Query {
	// 		users: [User]
	// 		user(id: ID!): User
	// 	}
	// 	type Mutation {
	// 		createUser(name: String!, email: String!, age: Int!): User
	// 		updateUser(id: ID!, name: String, email: String, age: Int): User
	// 		deleteUser(id: ID!): Boolean
	// 	}
	// `,
	// ).customTypeDefs(
	// 	`
	// 	type User {
	// 		name: String
	// 		email: String
	// 		age: Int
	// 		tenanaId: String
	// 	}
	// `,
	// );

	// await initializeRedis({ useRedis: true });
	// await connectRedis().then(() => {
	// 	console.log('✅ Redis connected');
	// }
	// ).catch((error: any) => {
	// 	console.error('❌ Failed to connect to Redis:', error.message);
	// 	process.exit(1);
	// });

	// const userCollection = await db?.collection<User>("users");
	// const tenantId = "tenantId";

	// Initialize AbimongoModel without tenantId if not supported
	// new AbimongoModel<User>({
	// 	collectionName: `${userCollection}`, // Ensure this is a valid string
	// 	schema: userSchema,
	// 	client: db.client,
	// });


	// schema.customTypeDefs(
	// 	`
	// 	type User {
	// 		name: String
	// 		email: String
	// 		age: Int
	// 		tenanaId: String
	// 	}
	// `,
	// ).customResolvers(
	// 	`
	// 	type Query {
	// 		users: [User]
	// 		user(id: ID!): User
	// 	},
	// 	type Mutation {
	// 		createUser(name: String!, email: String!, age: Int!): User
	// 		updateUser(id: ID!, name: String, email: String, age: Int): User
	// 		deleteUser(id: ID!): Boolean
	// 	}
	// `,
	// )

	// Initialize ApolloServer
	const server = new ApolloServer({
		schema: await schema.generateSchema(),
		plugins: [
			ApolloServerPluginDrainHttpServer({ httpServer }),
		],
	});

	// Start the server
	await startStandaloneServer(server, {
		listen: { port: 4000 },
		context: async ({ req }) => {
			return {
				user: {
					role: 'user',
					tenantId: req.headers['x-tenant-id'] || 'tenant-a',
				},
				collection: 'users',
				// tenantId: 'tenant-a',
				// logger: logger,
			};
		}
	})
	return server;
};
main().then(() => console.info('Run successful'))
	.catch((error) => console.error(error))

// new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
logger.info(`🚀 Server ready at http://localhost:4000/graphql`);

// // // server.assertStarted('expressMiddleware()');

// // new SubscriptionServer(
// //   {
// //     execute,
// //     subscribe,
// //     schema: graphQLService.generateSchema(),
// //   },
// //   { server: httpServer, path: '/graphql' }
// // );

// // httpServer.listen(4000, () => {
// //   console.log(`🚀 GraphQL Server ready at http://localhost:4000/graphql`);
// //   console.log(`🔄 WebSocket Subscriptions ready at ws://localhost:4000/graphql`);
// // });

// new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));

