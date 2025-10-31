
export const MAIN_TS_CONTENT = `import { initAbimongo } from '@abimongo/core';
import { createServer } from 'http'; // or Fastify, Hapi, etc.
import { ApolloServer } from '@apollo/server'; // Optional, only if GraphQL is enabled
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
/**
 * Main bootstrap function
 * This function initializes the application, sets up middleware, and starts the server.
 * Note This is a basic starter template. In a real application, you would expand upon this to include
 * your specific business logic, error handling, and other necessary components.
 *
 * Import bootstrap from core/AbimongoBootstrap and use it to access your app components.
 * This is recommended if you have are using Abimongo via a CLI generated project.
 * Doing so ensures that your configuration from abimongo.config.json is properly loaded.
 */

export async function run() {
  const app = await initAbimongo.create(); // Will look for abimongo.config.json by default
  const httpServer = createServer(express());

  // Connect Mongodb
  const db = app.getMongoClient();
  await db?.connect(); // if you expose .connect() method
  console.log('✅ MongoDB connected');

    const gcRunner = app.getGCRunner();
    await gcRunner?.start();
    console.log('♻️  Garbage Collector started.');

  /**
   * Start GraphQL server
   * Note: This is a basic starter point. In a real application, 
   * you would integrate Apollo Server with your web framework (Express, Fastify, etc.).
   */
  const graphql = app.getGraphQL();

  // Uncomment below to start GraphQL server if enabled
//   if (graphql) {
//     /** 
//      * Generate GraphQL schema automatically for testing on playground
//      * This can also be use directly for Multi tenant applications to generate
//      * schema for users creation dynamically
//      */
//    	// Initialize ApolloServer
// 	const server = new ApolloServer({
// 		schema: await graphql.generateSchema(),
// 		plugins: [
// 			ApolloServerPluginDrainHttpServer({ httpServer }),
// 		],
// 	});

// 	// Start the server
// 	await startStandaloneServer(server, {
// 		listen: { port: 4000 },
// 		context: async ({ req }) => {
// 			return {
// 				user: {
// 					role: 'admin',
// 					tenantId: req.headers['x-tenant-id'] || 'tenant-a', // Example of multi-tenant header
// 				},
// 				collection: 'users',
// 				tenantId: 'tenant-a',
// 				// logger: logger,
// 			};
// 		}
// 	})
//     console.log('🚀 GraphQL server is running.');
//     // Optionally mount it to Express or other framework

//     console.log('🚀 Server ready at http://localhost:4000/graphql');
// }

return app;

}`;

