export function generateGCManager(): string {
  const expirationDays = 7; // or fetch from config
  return `import { AbimongoModel } from '@abimongo/core';
import { ObjectId } from 'mongodb';

export async function runGarbageCollector(model: AbimongoModel<any>) {
  const cutoff = new Date(Date.now() - ${expirationDays} * 24 * 60 * 60 * 1000);
  const oldDocs = await model.find({ deletedAt: { $lt: cutoff } });

  for (const doc of oldDocs) {
    await model.deleteOne({ _id: new ObjectId(doc._id) });
    console.log(\`🗑️ Deleted document \${doc._id}\`);
  }

  console.log('✅ Garbage collection complete');
}
`;
}

export function generateGCRunner(): string {
  return `import { connectToDB } from '../src/db';
import { UserModel } from '../src/models/userModel'; // Replace with your actual model
import { runGarbageCollector } from '../src/gc/gcManager';

(async () => {
  await connectToDB();
  await runGarbageCollector(UserModel);
})();
`;
}
