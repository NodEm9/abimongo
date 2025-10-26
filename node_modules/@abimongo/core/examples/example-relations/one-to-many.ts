import { AbimongoClient, AbimongoSchema, AbimongoModel } from "../../src/lib-core";
import { castId } from "../../src/utils";
import { dbDriver } from "../dbConfig";
import { SchemaType, Document } from "../../src/types";
import { ObjectId } from "mongodb";


interface User extends Document {
	_id?: ObjectId;
	name: string;
	email: string;
	orders: ObjectId[]; // Reference to Orders
}

interface Order extends Document {
	_id?: ObjectId;
	product: string;
	amount: number;
	userId: ObjectId; // Reference to User
}



const orderSchema = new AbimongoSchema<Order>({
	product: { type: String, required: true },
	amount: { type: Number, required: true },
	userId: { type: SchemaType.Types.ObjectId, required: true, ref: 'users' }
})

const userSchema = new AbimongoSchema<User>({
	name: { type: String, required: true },
	email: { type: String, required: true },
	orders: { type: SchemaType.Types.ObjectId, required: false, ref: 'orders' }
})


export async function createOrder() {
	const db = await dbDriver()
	const orderCollection = db.getCollection<Order>('orders');
	const userCollection = db.getCollection<User>('users');

	const tenantId = 'tenantId';
	const { db: tenantDB, client: tenantClient } = await AbimongoClient.getDatabase(tenantId, process.env.MONGO_URI!);


	const OrderModel = new AbimongoModel<Order>({
		db: tenantDB,
		collectionName: `${orderCollection.collectionName}`, // Use the tenant-specific collection name
		schema: orderSchema,
		tenantId: tenantId,
		client: tenantClient
	});

	const UserModel = new AbimongoModel<User>({
		db: tenantDB,
		collectionName: `${orderCollection.collectionName}`, // Use the tenant-specific collection name
		schema: userSchema,
		tenantId: tenantId,
		client: tenantClient
	});

	// Create User
	const newUser = await UserModel.create({ name: 'Bob', email: 'bob@example.com', orders: [] });

	const userId = castId(newUser._id as ObjectId);

	// Create Orders for User
	const order1 = await OrderModel.create({ product: 'Laptop', amount: 1000, userId: userId });
	const order2 = await OrderModel.create({ product: 'Phone', amount: 500, userId: userId });

	// Link Orders to User
	await UserModel.updateOne({ _id: newUser._id }, { $set: { orders: [order1._id!, order2._id!] } });

	// Fetch User with Orders populated
	const userWithOrders = await UserModel.findOne({ _id: newUser._id });
	const populatedUserWithOrders = await UserModel.populateMany(userWithOrders!, 'orders', OrderModel);

	console.log('User with Orders:', populatedUserWithOrders);
}
createOrder().catch(console.error);