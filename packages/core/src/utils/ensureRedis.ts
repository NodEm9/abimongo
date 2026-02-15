import { redis } from '../redis-manager'

export async function ensureRedis(this: any) {
	let self = this;
	let publisher = this.publisher;
	let subscriber = this.subscriber;

	try {
		// Ensure we obtain a real connected client from the redis wrapper
		const client: any = await redis.get();
		if (!client) {
			console.log('⚠️ Redis client not available from redis manager; skipping Redis initialization');
			return;
		}

		// If client is not open but has connect, attempt to connect
		if (!client.isOpen && typeof client.connect === 'function') {
			await client.connect();
		}

		// Create publisher/subscriber from the connected client
		if (!publisher) {
			publisher = typeof client.duplicate === 'function' ? client.duplicate() : client;
			if (publisher && typeof publisher.connect === 'function') {
				await publisher.connect();
			}
		}

		if (!subscriber) {
			subscriber = typeof client.duplicate === 'function' ? client.duplicate() : client;
			if (subscriber && typeof subscriber.connect === 'function') {
				await subscriber.connect();
			}
		}

		console.log('[info] Ensuring Redis connection...');
		console.log('[info] Redis connection established');
		return self;
	} catch (err: any) {
		console.log('[info] ⚠️ Redis connection skipped or failed:', (err as any)?.message || String(err));
	}
}