
export const MAIN_TS_CONTENT = `import { AbimongoBootstrap, initializeMultiTenancy, initializeGraphQL  } from '@abimongo/abimongo_core';
import { createServer } from 'http'; // or Fastify, Hapi, etc.
import { ApolloServer } from '@apollo/server'; // Optional


async function start() {
  const app = new AbimongoBootstrap(); // Will look for abimongo.config.json by default

  // Connect Mongo
  const mongo = app.getMongoClient();
  await mongo.connect(); // if you expose .connect() method
  
    await initializeMultiTenancy(app);
    await initializeGraphQL(app);

  if (app.config.graphql?.enabled) {
    const schema = app.getGraphQLSchema();

    const server = new ApolloServer({ schema });
    await server.start();

    const httpServer = createServer();

    console.log('🚀 GraphQL API ready');
    // Optionally mount it to Express or other framework
  } else {
    console.log('✅ MongoDB initialized. No GraphQL enabled.');
  }
}

start().catch((err) => {
  console.error('❌ Error starting application:', err);
})`;
