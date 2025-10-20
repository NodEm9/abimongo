
export const MAIN_TS_CONTENT = `import { 
AbimongoBootstrap,
initializeMultiTenancy,
initializeGraphQL,  } from '@abimongo/core';
import { createServer } from 'http'; // or Fastify, Hapi, etc.
import { ApolloServer } from '@apollo/server'; // Optional, only if GraphQL is enabled

/**
 * Main bootstrap function
 * This function initializes the application, sets up middleware, and starts the server.
 * Note This is a basic starter template. In a real application, you would expand upon this to include
 * your specific business logic, error handling, and other necessary components.
 */

export async function bootstrap() {
  const app = await AbimongoBootstrapFactory.create(); // Will look for abimongo.config.json by default

  // Connect Mongo
  const mongo = app.getMongoClient();
  await mongo.connect(); // if you expose .connect() method
  console.log('✅ MongoDB connected');

  await initializeMultiTenancy(app);
  await initializeGraphQL(app);


  if (app.config.advanced?.garbageCollector?.enabled) {
    const gcRunner = app.getGCRunner();
    await gcRunner.start();
    console.log('♻️  Garbage Collector started.');
  }

  if (app.config.graphql?.enabled) {
    const schema = app.getGraphQLSchema();

/**
 * Start GraphQL server
 * Note: This is a basic starter point. In a real application, you would integrate Apollo Server with your web framework (Express, Fastify, etc.).
 */
    const server = new ApolloServer({ schema });
    await server.start();

    const httpServer = createServer();

    console.log('🚀 GraphQL server is running.');
    // Optionally mount it to Express or other framework
  } else {
    console.log('✅ MongoDB initialized. No GraphQL enabled.');
  }

   if(app.config.logger?.enabled) {
     const logger = app.getLogger();
     logger.info('Logger is enabled and ready to use.');
    }

 
}

bootstrap().catch((err) => {
  console.error('❌ Error starting application:', err);
})`;

