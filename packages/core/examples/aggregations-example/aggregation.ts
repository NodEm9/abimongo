import { dbConfig, dbDriver } from "../dbConfig";
import { Model, createSchema, castId } from "../../src/utils";
import { AbimongoClient, AbimongoModel, AbimongoSchema } from "../../src/lib-core";
import {
	Document,
	SchemaType,
	ModelContext
} from "../../src/types";
import { ObjectId } from "mongodb";
// import { applyMultiTenancy } from "../../src/tanancy/applyMultiTenancy";
import express from 'express';
import { applyMTenant } from "../index";


const app = express();
app.use(express.json() as express.Express);

interface UserDocument extends Document {
	_id?: ObjectId;
	name: string;
	email: string;
	orders: ObjectId[]; // Reference to Orders
}

interface OrderDocument extends Document {
	_id?: ObjectId;
	product: string;
	amount: number;
	userId: ObjectId; // Reference to User
}

const orderSchema = new AbimongoSchema<OrderDocument>({
	product: { type: String, required: true },
	amount: { type: Number, required: true },
	userId: { type: SchemaType.Types.ObjectId, required: true, ref: 'users' }
})

const userSchema = createSchema<UserDocument>({
	name: { type: String, required: true },
	email: { type: String, required: true },
	orders: { type: SchemaType.Types.ObjectId, required: false, ref: 'orders' }
})



export async function main() {
	// Connect to the database
	const db = await dbDriver();

	// const tenantId = 'tenantId123'; // Replace with your actual tenant ID
	await applyMTenant(); // Initialize multi-tenancy

	const userCollection = await db.getCollection<UserDocument>('users');
	const orderCollection = await db.getCollection<OrderDocument>('posts');
	// const commentCollection = await db.getCollection<CommentDocument>('comments');

	const ctx: ModelContext = {}; // Use the tenant ID from config

	const { db: tenantDB, client: tenantClient } = await AbimongoClient.getDatabase({
		tenantId: ctx.tenantId
	},
		// process.env.MONGO_URI!
		'mongodb://localhost:27017'
	);


	// Add relationship to the post schema
	orderSchema.addRelationship('comments', 'postId');

	// Initialize models
	const userModel = Model<UserDocument>({
		collectionName: `${userCollection.collectionName}`, // Use the tenant-specific collection name
		schema: userSchema,
		provider: db,
		ctx: { tenantId: ctx.tenantId }, // Use the tenant ID from config
	});

	const orderModel = new AbimongoModel<OrderDocument>({
		collectionName: `${orderCollection.collectionName}`, // Use the tenant-specific collection name
		schema: orderSchema,
		ctx: { tenantId: ctx.tenantId }, // Use the tenant ID from config
		provider: db,
	});


	// Create a user
	const user = await userModel.create({ name: 'Jack Jones', email: 'jog@mail.com', orders: [] });
	if (!user._id) {
		throw new Error("User ID is undefined");
	}

	const userId = user._id as ObjectId; // Cast to ObjectId if necessary
	const order = await orderModel.create({ product: 'Laptop', amount: 750, userId: userId });
	const order2 = await orderModel.create({ product: 'Phone', amount: 1500, userId: userId });

	console.log(
		userModel.on('aggregate', (data) => console.log('New user created:', data))
	);
	console.log(
		userModel.on('aggregate', () => console.log('User updated:', userId))
	);

	console.log('User:', user);
	console.log('Order:', order);
	const postOrder = await orderModel.find();
	console.log('Posts', postOrder);
	const postOrder2 = await orderModel.findOne({ _id: order2._id });
	console.log('Order2  :', postOrder2);


	// Basic Aggregation Query
	const usersWithOrders = await userModel.aggregate([
		{
			$lookup: {
				from: 'orders',
				localField: '_id',
				foreignField: `${userId}`,
				as: 'orders'
			}
		},
		{ $match: { 'orders.0': { $exists: true } } } // Users with at least one order
	]);

	console.log('Aggregation: ', usersWithOrders);

	//Aggregation with Transactions
	const result = await userModel.aggregateWithTransaction([
		{
			$group: {
				_id: '$role',
				count: { $sum: 1 }
			}
		}
	]);
	console.log('Main Aggreate', result);

	// Streaming Aggregation (Efficient for Large Data)
	const cursor = await userModel.streamAggregation([{ $match: { isActive: true } }]);

	cursor.on('data', async (chunk: any) => {
		chunk = chunk.toObject(); // Convert to object if needed
		chunk = await userModel.populateMany(chunk, 'orders', orderModel);
		console.log('Stream chunk:', chunk);
	})
	cursor.on('error', (err) => {
		console.error('Stream error:', err);
	});

	cursor.on('end', () => {
		console.log('Stream finished.');
	});
}

main();

