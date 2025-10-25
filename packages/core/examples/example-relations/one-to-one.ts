// TypeScript typings for the example
import { AbimongoModel } from "../../src/lib/abimongoModel/AbimongoModel";
import { dbDriver } from "../dbConfig";
import { Document, castId, ObjectId } from "../../src/lib/helpers";
import { AbimongoSchema } from "../../src/lib/schema/schema";
import { SchemaType } from "../../src/lib/types";


// Define Interfaces
interface UserDoc extends Document {
	_id?: ObjectId;
	name: string;
	email: string;
	profileId?: ObjectId; // Reference to Profile
}

interface ProfileDoc extends Document {
	_id?: ObjectId;
	age: number;
	bio: string;
	userId: ObjectId; // Reference back to User
}

// Define Schemas
const profileSchema = new AbimongoSchema<ProfileDoc>({
	age: { type: 'number', required: true },
	bio: { type: 'string', required: true },
	userId: { type: SchemaType.Types.ObjectId, required: true, ref: 'users' },
});

// Define Schemas
const userSchema = new AbimongoSchema<UserDoc>({
	name: { type: 'string', required: true },
	email: { type: 'string', required: true },
	profileId: { type: SchemaType.Types.ObjectId, required: false, ref: 'profiles' },
});


export type User = {
	name: string;
	email: string;
	profileId?: ObjectId;
}

export type Profile = {
	age: number;
	bio: string;
	userId: ObjectId;
}


// Main Function
export async function main(data: User, profile: Profile): Promise<void> {
	// Connect to the database
	const db = await dbDriver();

	// Add Relationships
	profileSchema.addRelationship('age', 'userId');
	profileSchema.addRelationship('bio', 'userId');
	const tenantId = 'tenantId';

	const userCollection = await db.collection<UserDoc>('users');
	const UserModel = new AbimongoModel<UserDoc>(tenantId, `${userCollection}`, db.client, userSchema);

	const profileCollection = db.collection<ProfileDoc>('profiles');
	const ProfileModel = new AbimongoModel<ProfileDoc>(tenantId, `${profileCollection}`, db.client, profileSchema);


	// Create User and Profile
	const newUser = await UserModel.create({
		name: data.name,
		email: data.email,
		profileId: data.profileId
	});

	const userId = castId(newUser._id);
	// const profile = { age: 0, bio: '', userId: userId } as Profile

	const newProfile = await ProfileModel.create({
		age: profile.age,
		bio: profile.bio,
		userId: userId
	});


	// Link Profile to User
	await UserModel.updateOne({ _id: newUser._id }, { $set: { profileId: newProfile._id } });

	// Fetch User with Profile populated
	const userWithProfile = await UserModel.findOne({ _id: newUser._id });
	const populatedUser = await UserModel.populateOne(userWithProfile!, 'profileId', ProfileModel);

	console.log('User with Profile:', populatedUser);
	// UserModel.deleteOne({ _id: newUser._id });
	// ProfileModel.deleteOne({ _id: newProfile._id });

	// await db.disconnect();
}
// main().catch(console.error);