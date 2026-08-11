import 'dotenv/config';
import express from 'express';
// import cors from 'cors';
// import { main, Profile, User } from './example-relations/one-to-one';
import { main, getUsers, deleteUser, userSchema, postSchema, setup } from './example-1';
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
import { getTenantModel } from '../src/tanancy/TenantModelResolver';
import { createExpressAdapter } from '../../adapter-express/src/index';
import { consoleTransport, MetricsTracker } from '@abimongo/logger';
// import { logger } from './example-1/router';
import { logger } from '../src/config';
// import { consoleTransport } from '@abimongo/abimongo-logger'
import { AbimongoGC } from '../src/gc/AbimongoGC';
import { bufferedTransporter, lokiTransport } from '../src';
// import {createLogger} from '../src/loggers/createLogger';
import { MultiTenantManager } from '../src';
// import { elasticTransport } from '../dist';
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


const trackerMetric = new MetricsTracker()
// export const tenants = dbConfig.tenantUri;

const app = express()
// const graphQLService = new AbimongoGraphQL();
const PORT = 8000;
// const httpServer = createServer(app);


app.use(express.json() as express.Express);
// app.use(cors());
app.use(express.urlencoded({ extended: false }) as express.Express);


export const gc = new AbimongoGC({ interval: '30s' }); // run cleanup every 30 seconds
gc.start();

trackerMetric.start(60000); // Track metrics every 60 seconds


//handle Multi-tenancy registration and initialization
const tenants = dbConfig.tenantUri;



// const tenants = JSON.parse(JSON.stringify(initOps.tenants.tenant));
export const applyMTenant = async () => {

	const adapter = await createExpressAdapter();
	
	adapter.name = 'express';
	adapter.install(app, 
		{
			tenancy: {
				header: 'x-tenant-id',
				fallback: 'tenant-a',
			},
			requestIdHeader: 'x-request-id',
			enableTransactions: true,
	});

	return adapter;
	// return await abimongoExpress({
	// 	header: 'x-tenant-id',
	// 	cookie: 'tenant',
	// 	param: 'tenantId',
	// 	subdomain: false,
	// 	jwtClaim: 'tenantId',
	// 	fallback: 'tenant-a',
	// })

	// Install tenancy middleware
	// return await installTenancyExpress(app, tenants, {
	// 	tenancy: {
	// 		header: 'x-tenant-id',
	// 		fallback: 'tenant-a',
	// 	},
	// 	initOptions: {
	// 		lazy: true,  // Lazy initialization of tenants
	// 	},
	// });

	// Use the applyMultiTenancy function to set up multi-tenancy
	// with the specified options and the app instance.
	// return await applyMultiTenancy(app, tenants, {
	// 	headerKey: 'x-tenant-id',
	// 	initOptions: {
	// 		lazy: true,  // Lazy initialization of tenants
	// 		config: {
	// 			enabled: true,
	// 			logLevel: 'info', // Set the log level
	// 			useColor: true, // Enable colored logs
	// 			transports: [
	// 				{
	// 					write: async (message: string, level?: any, meta?: any[]): Promise<void> => {
	// 						console.log(message); // Log to console
	// 						return Promise.resolve();
	// 					},
	// 				},
	// 				consoleTransport(true),
	// 			], // Use console transport for logging
	// 			json: false, // Disable JSON format for logs,
	// 			formatOptions: {
	// 				// Customize the log format if needed
	// 				timestamp: true, // Include timestamp in logs
	// 				prefix: '[ABIMONGO]', // Prefix for log messages
	// 				source: 'abimongo', // Source of the logs
	// 				colorize: true, // Enable colors in logs
	// 				json: true
	// 			},
	// 			hooks: {
	// 				onLog: (entry) => {
	// 					if (entry.level === 'info') {
	// 						console.log(`[ALERT] ${entry.message}`);
	// 					}
	// 				},
	// 				onError: (error, context) => {
	// 					console.error('Logging error occurred:', error, context);
	// 				},
	// 			}
	// 			// Place valid AbimongoLoggerSettings properties here if needed
	// 		}
	// 	},
	// })
}


applyMTenant().then(() => {
	console.info(`Registerd tenants successfully! Tenants: ${Object.keys(dbConfig.tenantUri).join(', ')} `,);
}).catch((err: any) => {
	console.error('Failed to register Tenants', err);
	process.exit(1)
})

const registerTenants = async () => {
	// Register tenants
	for (const [tenantId, uri] of Object.entries(dbConfig.tenantUri)) {
		await MultiTenantManager.registerTenant(tenantId, uri);
		console.info(`Registered tenant: ${tenantId} with URI: ${uri}`);
	}
};

registerTenants().then(() => {
	console.info('All tenants registered successfully.');
}).catch((err) => {
	console.error('Error registering tenants:', err);
});

const newTenant = Object.keys(dbConfig.tenantUri)[0];

app.get('/user', async (req, res) => {
	const users = await getUsers() as { users: UserType[] };
	// if (users.users.length) {
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
	const tenantId = req.headers['x-tenant-id'] || newTenant;
	const data: UserType = req.body;

	const clientDb = await dbDriver();
	const UserModel = await setup()
	// const userCollection = clientDb.getCollection<UserType>('users');
	// // const profileData: Profile = req.body;
	// const tenantModel = await getTenantModel({
	// 	collectionName: userCollection.collectionName || 'users',
	// 	schema: userSchema,
	// 	tenantId: tenantId,
	// });
	// if (tenantId.length) {
	// 	logger.info(`Creating user for tenant: ${tenantId.toLowerCase()}`);
	// }
	// console.log('Tenant model:', tenantModel.name);
	// console.log('Data: ', { ...data });
	// if (!tenantModel) {
	// 	console.error('Tenant model not found');
	// 	res.status(500).json({ error: 'Tenant model not found' });
	// }

	try {
		// const newData = await main({ ...data, tenantId: tenantId.toString() });

		const newData = await UserModel.create({ ...data, tenantId: tenantId });
		res.json({ data: newData });
	} catch (error) {
		console.error(error);
		res.status(500).send({ error: "Failed to create data" });
	} finally {
		await clientDb.close().catch((e) => console.error("close failed:", e));
	}

	// const user = await main({ ...data } as UserType);

	// res.json(user);
});

app.post('/post', async (req, res) => {
	const tenanaId = req.headers['x-tenant-id'] as string;
	const data = req.body;
	const tenantModel = await getTenantModel({
		collectionName: 'posts',
		schema: postSchema,
		tenantId: tenanaId,
	});
	console.info('Tenant model:', tenantModel.name);
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

app.delete('/user/:id', async (req, res) => {
	const tenanaId = req.headers['x-tenant-id'] as string;
	const userId = req.params.id;
	// const postId = req.params.id;
	// const tenantModel = await getTenantModel({
	// 	collectionName: 'posts',
	// 	schema: postSchema,
	// 	tenantId: tenanaId,
	// });
	// console.info('Tenant model:', tenantModel.name);

	// if (!tenantModel) {
	// 	console.error('Tenant model not found');
	// 	res.status(500).json({ error: 'Tenant model not found' });
	// }

	// const deletedPost = await tenantModel.deleteOne({ _id: postId });
	// if (deletedPost.deletedCount === 0) {
	// 	console.error('Post not found or already deleted');
	// 	res.status(404).json({ error: 'Post not found or already deleted' });
	// } else {
	// 	console.info('Post deleted successfully');
	// 	res.json({ message: 'Post deleted successfully' });
	// }

	const deletedUser = await deleteUser(userId);
	if (deletedUser.deletedCount === 0) {
		console.error('User not found or already deleted');
		res.status(404).json({ error: 'User not found or already deleted' });
	} else {
		console.info('User deleted successfully');
		res.json({ message: 'User deleted successfully' });
	}

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