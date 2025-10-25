import 'dotenv/config';
import express from 'express';
import cors from 'cors';
// import { main, Profile, User } from './example-relations/one-to-one';
import { main, getUsers, userSchema, postSchema } from './example-1';
import { dbDriver, dbConfig } from './dbConfig';
import jwt from 'jsonwebtoken';
import { ApolloServer } from '@apollo/server';
import { AbimongoGraphQL } from '../src/graphql/AbimongoGraphQL';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
// import { SubscriptionServer } from 'subscriptions-transport-ws';
import { SubscribePayload, ExecutionResult } from 'graphql-ws';
// import { ExpressContextFunctionArgument, expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { applyMultiTenancy } from '../src/tanancy/applyMultiTenancy'
import { getTenantModel } from '../src/tanancy/TenantModelResolver';
// import { logger } from './example-1/router';
// import { logger } from '../src/config';
// import { consoleTransport } from '@abimongo/abimongo-logger'
import { AbimongoGC } from '../src/gc/AbimongoGC';
// import {createLogger} from '../src/loggers/createLogger';
dbDriver()

// const logger = setupLogger(abimongoConfig['./logs/debug.log']);



export type UserType = {
	_id?: string;
	name: string;
	email: string;
	contact: string;
	tenantId: string;
	// age?: number;
	// bio?: string;
}

// export const tenants = dbConfig.tenantUri;

const app = express() as express.Express;
// const graphQLService = new AbimongoGraphQL();
const PORT = 8000;
// const httpServer = createServer(app);


app.use(express.json() as express.Express);
// app.use(cors());
app.use(express.urlencoded({ extended: false }) as express.Express);


export const gc = new AbimongoGC({ interval: '30s' }); // run cleanup every 30 seconds
gc.start();



//handle Multi-tenancy registration and initialization
const tenants = dbConfig.tenantUri;

// const tenants = JSON.parse(JSON.stringify(initOps.tenants.tenant));

export const applyMTenant = async () => {

	// Use the applyMultiTenancy function to set up multi-tenancy
	// with the specified options and the app instance.
	return await applyMultiTenancy(app, tenants, {
		headerKey: 'x-tenant-id',
		initOptions: {
			lazy: true,  // Lazy initialization of tenants
			// config: {
			// 	// enabled: true,
			// }
		},
	})
}

applyMTenant().then((tenants) => {
	console.log(`Multi-tenancy applied successfully! Tenants: ${Object.keys(dbConfig.tenantUri).join(', ')} `,);
	return tenants;
}).catch((err: any) => {
	console.log('Failed to register Tenants', err);
	process.exit(1)
})


app.get('/user', async (req, res) => {
	const users = await getUsers();
	// if (users.length) {
	// 	const userCatched = await getTenantModel({
	// 		modelName: 'users',
	// 		schema: userSchema,
	// 		tenantId: dbConfig.tenantId['tenant-a'],

	// 	})

	// 	await userCatched.findCached({ _id: users })
	// 	console.log('User Catched:', userCatched);
	// }
	console.log('Users fetched:', users?.users);
	res.json(users);
});

app.post('/user', async (req, res) => {
	const data: UserType = req.body;
	// // const profileData: Profile = req.body;
	const tenantModel = await getTenantModel({
		modelName: 'users',
		schema: userSchema,
		tenantId: dbConfig.tenantId['tenant-a']!,
	});
	console.log('Tenant model:', tenantModel.name);
	console.log('Data: ', { ...data });
	if (!tenantModel) {
		console.error('Tenant model not found');
		res.status(500).json({ error: 'Tenant model not found' });
	}

	const user = await main(data);
	if (!user) {
		console.log('User not created: Check your data');
		res.status(500).json({ error: 'User not created: Check your inputs' });
	} else {
		console.log('User created:', user);
	}
	res.json(user);
});

app.post('/post', async (req, res) => {
	const data = req.body;
	const tenantModel = await getTenantModel({
		modelName: 'posts',
		schema: postSchema,
		tenantId: dbConfig.tenantId['tenant-a']!,
	});
console.log('Tenant model:', tenantModel.name);
	if (!tenantModel) {
		console.error('Tenant model not found');
		res.status(500).json({ error: 'Tenant model not found' });
	}
	const post = await tenantModel.create(data);
	if (!post) {
		console.error('Post not created: Check your data');
		res.status(500).json({ error: 'Post not created: Check your inputs' });
	}
	else {
		console.info('Post created:', post);
	}
	res.json(post);
});

app.listen(PORT, () => {
	console.log(`Express server is running on http://localhost:${PORT}`);
});

// httpServer.listen(PORT, () => {
// 	console.log(`Server is running on http://localhost:${PORT}`);
// })



//  type ExpressContextFunctionArgument = { tenantId: string };

// const server = new ApolloServer<ExpressContextFunctionArgument>({
// 	schema: graphQLService.generateSchema(),
// 	plugins: [
// 		ApolloServerPluginDrainHttpServer({ httpServer }),
// 	],
// })

// const startServer = async () => {
// 	await server.start();

//  return	app.use(
// 		"/graphql",
// 		express.json(),
// 		cors(),
// 		express.urlencoded({ extended: true }),
// 		expressMiddleware(server, {
// 			context: async ({ req, res }: ExpressContextFunctionArgument) => {
// 				const token = req.headers.authorization || '';

// 				try {
// 					const user = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET!);
// 					return { req, res, tenantId: (user as jwt.JwtPayload).tenantId, user };
// 				} catch {
// 					throw new Error('Authentication failed');
// 				}
// 			},
// 		}) as unknown as express.RequestHandler<ExpressContextFunctionArgument, any, any>,

// 	);
// };

// startServer().then(() => {
// 	console.log('Apollo Server started');
// }).catch((error) => {
// 	console.error('Error starting Apollo Server:', error);
// });

// await server.start();

// 	app.use(
// 		"/graphql",
// 		express.json(),
// 		cors<cors.CorsRequest>(),
// 		express.urlencoded({ extended: true }),
// 		expressMiddleware(server, {
// 			context: async ({ req, res }) => {
// 				const token = req.headers.authorization || '';

// 				try {
// 					const user = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET!);
// 					return { req, res, tenantId: (user as jwt.JwtPayload).tenantId, user };
// 				} catch {
// 					throw new Error('Authentication failed');
// 				}
// 			},
// 		}) as unknown as express.RequestHandler<ExpressContextFunctionArgument, any, any>,

// 	);


// const SubscriptionServer: ExecutionResult = {
// 	data: {
// 		execute: execute,
// 		subscribe,
// 		schema: graphQLService.generateSchema(),
// 	},
// 	extensions: { server: httpServer, path: '/subscriptionServer' }
// }



// httpServer.listen(4000, () => {
// 	console.log(`🚀 GraphQL Server ready at http://localhost:4000/graphql`);
// 	console.log(`🔄 WebSocket Subscriptions ready at ws://localhost:4000/graphql`);
// });

export default app