// // src/models/user.model.ts: Define your model using AbimongoModel and your schema
// import { AbimongoGraphQL } from "../../lib/graphql/graphql.server";
// import { AbimongoModel } from "../../lib/abimongoModel/AbimongoModel";
// import { AbimongoSchema } from "../../lib/schema/schema";
// import { dbDriver } from "../../examples/dbConfig";
// import { Document } from "../../lib/types";



// interface User extends Document {
// 	name: string;
// 	email: string;
// 	age: number;
// }


// const userSchema = new AbimongoSchema<User>({
// 	name: String,
// 	email: String,
// 	age: Number,
// });


// // Create a new user
// export async function userModel() {
// 	const db = await dbDriver();
// 	const userCollection = await db?.collection<User>("users");
// 	const UserModel = new AbimongoModel<User>(userCollection, userSchema);

// 	const { typeDefs, resolvers } = AbimongoGraphQL.generateSchema(UserModel, "User");


// 	return { typeDefs, resolvers };

// }