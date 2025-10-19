
import { dbDriver } from "../dbConfig";
import { castId, } from "../../src/utils";
import { AbimongoModel, AbimongoSchema } from "../../src/lib-core";
import { Document, SchemaType } from "../../src/types";
import { ObjectId } from "mongodb";
import { applyMTenant } from "../index";

// Define the user interface
interface UserDocument extends Document {
	_id?: ObjectId;
	name: string;
	posts: ObjectId[];
	comments: ObjectId[];
};

// Define the post interface
interface PostDocument extends Document {
	_id?: ObjectId;
	authorId: ObjectId;
	title: string;
	content: string;
	// other fields...
};

// Define the comment interface
interface CommentDocument extends Document {
	_id?: ObjectId;
	postId: ObjectId;
	authorId: ObjectId;
	content: string;
	// other fields...
};

// Define the user schema
const userSchema = new AbimongoSchema<UserDocument>({
	_id: ObjectId,
	name: String,
	posts: { type: SchemaType.Types.ObjectId, required: false, ref: 'posts' },
	comments: [{ type: SchemaType.Types.ObjectId, ref: 'comments' }],
});

// Define the post schema
const postSchema = new AbimongoSchema<PostDocument>({
	_id: ObjectId,
	authorId: { type: SchemaType.Types.ObjectId, required: true, ref: 'users' },
	title: String,
	content: String,

});

// Define the comment schema
const commentSchema = new AbimongoSchema<CommentDocument>({
	_id: ObjectId,
	postId: { type: SchemaType.Types.ObjectId, required: true, ref: 'posts' },
	authorId: { type: SchemaType.Types.ObjectId, required: true, ref: 'users' },
	content: String,
});


export async function main() {
	// Connect to the database
	const db = await dbDriver();
	const userCollection = db.getCollection<UserDocument>('users');
	const postCollection = db.getCollection<PostDocument>('posts');
	const commentCollection = db.getCollection<CommentDocument>('comments');

	// await applyMTenant(); // Initialize multi-tenancy

	// Add relationship to the post schema
	postSchema.addRelationship('comments', 'postId');

	const tenantId = 'tenantId';

	// Initialize models
	const userModel = new AbimongoModel<UserDocument>({
		collectionName: `${userCollection.collectionName}`,
		schema: userSchema,
		// tenantId,
	});
	const postModel = new AbimongoModel<PostDocument>({
		collectionName: `${postCollection.collectionName}`,
		schema: postSchema,
		// tenantId,
	});
	const commentModel = new AbimongoModel<CommentDocument>({
		collectionName: `${commentCollection.collectionName}`,
		schema: commentSchema,
		// tenantId, 
	});

	// Create a user
	const user = await userModel.create({ name: 'John Doe', posts: [], comments: [] });

	const userId = castId(user._id!);

	// Create a post
	const post = await postModel.create({ authorId: userId, title: 'Hello World', content: 'This is my first post' });
	const postId = castId(post._id);

	// Create a comment
	const comment = await commentModel.create({ postId: postId, authorId: userId, content: 'Nice post!' });

	// Link the post to the user
	await userModel.updateOne({ _id: user._id }, { $set: { posts: [post._id!] } });
	await userModel.updateOne({ _id: user._id }, { $set: { comments: [comment._id!] } });

	// Link the comment to the post
	await postModel.updateOne({ _id: post._id }, { $set: { comments: [comment._id] } });

	// Fetch the post with comments populated
	const postWithComments = await postModel.findOne({ _id: post._id });

	console.log('User created: ', user);
	console.log('Post created: ', post);
	console.log('Comment created: ', comment);

	console.log('Post commets: ', postWithComments);

	const populatedPostWithComments = await postModel.populateMany(postWithComments!, 'comments', commentModel);
	console.log('Populated Post with Comments:', populatedPostWithComments);

	// await postModel.deleteOne({ _id: post._id });
	await postModel.deleteWithTransaction({ _id: post._id });

	// // Fetch the post with comments populated
	const postWithCommentsAfterDelete = await postModel.findOne({ _id: post._id });
	console.log('Post after delete:', postWithCommentsAfterDelete);
}
main();

