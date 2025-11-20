<!-- `c:\Users\User\Documents\GitHub\abimongo\docs\website\tutorials\core_tutotrials\abimongo-graphql.md` -->

---
title: Abimongo + GraphQL (Next.js) — Multi-tenant starter
description: A copy-pasteable Next.js + GraphQL tutorial showing how to wire Abimongo into a multi-tenant GraphQL API and a minimal React frontend.
---

## Goal

This tutorial shows a minimal, copy-pasteable Next.js application that exposes a GraphQL API backed by Abimongo and implements multi-tenancy.

- API: Apollo Server (via `apollo-server-micro`) running in `pages/api/graphql.ts`.
- Multi-tenancy: tenants are registered at startup with Abimongo's multi-tenant manager and the request tenant is set using `TenantContext.run()` so all downstream Abimongo calls resolve to the tenant DB.
- Frontend: a tiny React page that calls the GraphQL API and demonstrates tenant isolation.

You can copy the whole project into a fresh folder and run it locally. The examples use JavaScript for simplicity.

## Prerequisites

- Node 18+ (or current LTS)
- A MongoDB server for each tenant (local `mongod` is fine). For local testing you can use a single MongoDB instance and separate databases/URIs per tenant.
- `@abimongo/core` available in your environment (either published or linked from your workspace). If you're testing locally, publish to your local registry or `npm link` the package.

## Project layout (what we'll create)

- package.json
- .env.local
- lib/abimongo.js         — Abimongo initialization + tenant registration helper
- lib/schemas/user.js     — AbimongoSchema for the `User` type
- pages/api/graphql.js    — GraphQL API (Apollo Server micro) with tenant context middleware
- pages/index.js          — Simple React UI that calls the GraphQL API

---

## 1) package.json

Create a minimal Next.js project and install the required deps.

package.json

```json
{
	"name": "abimongo-graphql-next",
	"version": "0.1.0",
	"private": true,
	"scripts": {
		"dev": "next dev -p 3000",
		"build": "next build",
		"start": "next start -p 3000"
	},
	"dependencies": {
		"next": "^14.0.0",
		"react": "^18.0.0",
		"react-dom": "^18.0.0",
		"apollo-server-micro": "^4.0.0",
		"graphql": "^16.0.0",
		"cross-fetch": "^3.1.5",
		"@abimongo/core": "^1.0.0"
	}
}
```

Install:

```bash
npm install
```

If you're working inside the abimongo monorepo, you can instead `pnpm add` or use `npm link` so `@abimongo/core` resolves locally.

---

## 2) Environment variables

Create `.env.local` with your tenant URIs. We'll encode a small JSON map in `TENANTS_JSON` for convenience in this tutorial. Example:

```
PORT=3000
# JSON string mapping tenantId -> mongodb URI
TENANTS_JSON={"tenant-a":"mongodb://localhost:27017/tenant_a","tenant-b":"mongodb://localhost:27017/tenant_b"}
```

When using a cloud MongoDB provider, make sure each tenant uses a separate database/URI for isolation.

---

## 3) Abimongo bootstrap helper (lib/abimongo.js)

This file initializes Abimongo multi-tenancy at server start. It calls `initMultiTenancy` (which registers tenants) and exposes a convenience `ensureAbimongo()` function so our API route can await initialization.

Create `lib/abimongo.js`:

```js
// lib/abimongo.js
import { initMultiTenancy, AbimongoGraphQL, TenantContext } from '@abimongo/core';

let initialized = false;
let graphQLInstance = null;

export async function ensureAbimongo() {
	if (initialized) return { graphQLInstance };

	const raw = process.env.TENANTS_JSON || '{}';
	let tenants = {};
	try {
		tenants = JSON.parse(raw);
	} catch (err) {
		console.error('TENANTS_JSON parse error:', err.message);
		throw err;
	}

	// initMultiTenancy accepts an object { tenantId: uri }
	// lazy: false will connect immediately. Set lazy: true to defer.
	await initMultiTenancy(tenants, { lazy: false });

	// Create a single AbimongoGraphQL generator instance and keep it.
	// The generated schema uses TenantContext internally (Abimongo resolvers pick it up).
	graphQLInstance = new AbimongoGraphQL({ useRedis: false });

	initialized = true;
	return { graphQLInstance };
}

export { TenantContext };

```

Notes:

- `initMultiTenancy(tenants, { lazy: false })` registers the tenants and connects immediately. In production you may prefer lazy connections or more advanced tenant lifecycle management.
- `TenantContext` is exported so our request handler can run each request inside the correct tenant context.

---

## 4) Define your Abimongo schema (lib/schemas/user.js)

Create a small user schema using `AbimongoSchema` and export it. This same schema is used by the GraphQL generator.

```js
// lib/schemas/user.js
import { AbimongoSchema } from '@abimongo/core';

export const UserSchema = new AbimongoSchema({
	name: String,
	email: String,
	age: Number,
	createdAt: Date,
});

// Optional: add a simple GC config
UserSchema.getGCConfig = () => ({ ttlField: 'createdAt' });

export default UserSchema;
```

---

## 5) GraphQL API (pages/api/graphql.js)

This is the Next.js API route that mounts Apollo Server. Important details:

- We `ensureAbimongo()` at module scope to register tenants and create the AbimongoGraphQL instance. That step is async; we await it in the handler when needed.
- For each incoming request we extract the tenant id from the `x-tenant-id` header, run the handler inside `TenantContext.run(tenantId, ...)` so all Abimongo resolvers and helpers resolve to that tenant's DB.

Create `pages/api/graphql.js`:

```js
// pages/api/graphql.js
import { ApolloServer } from 'apollo-server-micro';
import { json } from 'micro';
import Cors from 'micro-cors';
import { ensureAbimongo, TenantContext } from '../../lib/abimongo';

let apolloServer = null;
let serverStarted = false;

const cors = Cors();

async function getApolloServer() {
	if (apolloServer) return apolloServer;

	const { graphQLInstance } = await ensureAbimongo();
	const schema = await graphQLInstance.generateSchema();

	apolloServer = new ApolloServer({
		schema,
	});

	// Start Apollo (required by v4 before using the handler)
	if (!serverStarted) {
		await apolloServer.start();
		serverStarted = true;
	}

	return apolloServer;
}

const handler = async (req, res) => {
	if (req.method === 'OPTIONS') return res.end();

	const tenantId = req.headers['x-tenant-id'] || req.query.tenant || 'tenant-a';
	if (!tenantId) {
		res.statusCode = 400;
		return res.end('Tenant id required via x-tenant-id header');
	}

	// Ensure Abimongo + GraphQL are initialized
	const server = await getApolloServer();

	// Run inside the tenant context so Abimongo resolvers operate against the tenant DB
	return TenantContext.run(tenantId, async () => {
		const apolloHandler = server.createHandler({ path: '/api/graphql' });
		return apolloHandler(req, res);
	});
};

export const config = {
	api: {
		bodyParser: false,
	},
};

export default cors(async (req, res) => {
	// body parsing must be handled by Apollo; just pass through
	await handler(req, res);
});
```

Notes:

- We keep a singleton `ApolloServer` instance to avoid rebuilding the schema for every request.
- The handler uses `TenantContext.run(tenantId, () => ...)` so any Abimongo helper that uses `TenantContext.getTenantId()` will resolve correctly.

---

## 6) Minimal frontend (pages/index.js)

Create a tiny React page that allows switching tenant and creating / listing users.

```jsx
// pages/index.js
import React, { useState, useEffect } from 'react';

const GRAPHQL = '/api/graphql';

const fetchGQL = async (tenantId, query, variables = {}) => {
	const res = await fetch(GRAPHQL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-tenant-id': tenantId,
		},
		body: JSON.stringify({ query, variables }),
	});
	return res.json();
};

export default function Home() {
	const [tenant, setTenant] = useState('tenant-a');
	const [users, setUsers] = useState([]);
	const [name, setName] = useState('Alice');

	const loadUsers = async () => {
		const q = `query { findUsers { id name email age createdAt } }`;
		const r = await fetchGQL(tenant, q);
		setUsers(r.data?.findUsers || []);
	};

	useEffect(() => { loadUsers(); }, [tenant]);

	const addUser = async () => {
		const mutation = `mutation($input: CreateUserInput!) { createUser(input: $input) { id name email age } }`;
		const input = { name, email: `${name.toLowerCase()}@example.com`, age: 30 };
		await fetchGQL(tenant, mutation, { input });
		await loadUsers();
	};

	return (
		<div style={{ padding: 24 }}>
			<h1>Abimongo + GraphQL (multi-tenant)</h1>
			<label>Tenant: </label>
			<select value={tenant} onChange={e => setTenant(e.target.value)}>
				<option value="tenant-a">tenant-a</option>
				<option value="tenant-b">tenant-b</option>
			</select>

			<h2>Create user</h2>
			<input value={name} onChange={e => setName(e.target.value)} />
			<button onClick={addUser}>Create</button>

			<h2>Users (tenant: {tenant})</h2>
			<button onClick={loadUsers}>Refresh</button>
			<ul>
				{users.map(u => (
					<li key={u.id}>{u.name} — {u.email} — {u.age}</li>
				))}
			</ul>
		</div>
	);
}
```

Notes:

- The GraphQL schema generated by `AbimongoGraphQL` exposes simple `findUsers` and `createUser` operations for models that exist. The auto-generated schema may use different operation names depending on your Abimongo config; use GraphiQL or `schema` introspection to confirm.

---

## 7) Example GraphQL queries

- List users

```graphql
query {
	findUsers {
		id
		name
		email
		age
		createdAt
	}
}
```

- Create user (mutation)

```graphql
mutation CreateUser($input: CreateUserInput!) {
	createUser(input: $input) {
		id
		name
	}
}
```

When calling from the frontend or a client, be sure to include `x-tenant-id` as a header.

---

## 8) Run it

1. Ensure MongoDB is running and you have the tenant URIs in `.env.local`.
2. npm run dev
3. Open `http://localhost:3000` and choose tenants from the dropdown. Each tenant reads/writes its own DB.

If you prefer to experiment with GraphiQL, you can `POST` to `/api/graphql` with the `x-tenant-id` header or use an external client (Apollo Studio / GraphiQL) and set headers.

---

## 9) Implementation notes & best practices

- TenantContext.run vs setTenantId: Prefer `TenantContext.run(tenantId, () => ...)` to ensure context flows across async calls. `TenantContext.setTenantId()` and `clear()` are ok for scripts and tests but not per-request handlers.
- Connection lifecycle: `initMultiTenancy(..., { lazy: false })` opens connections for all tenants at startup — good for small numbers of tenants. For many tenants, register tenants lazily with `registerLazyTenant`/`initMultiTenancy(..., { lazy: true })` and connect on first use.
- Security: Validate tenant ids and ensure the incoming `x-tenant-id` is authorized for the calling client (e.g., via JWT claims).
- Schema generation: `AbimongoGraphQL` auto-generates CRUD operations for Abimongo models — you can extend or override the generated resolvers with `customResolvers()` or add `customTypeDefs()`.

---

## 10) Troubleshooting

- If GraphQL schema generation fails, ensure `@abimongo/core` is installed and that the `UserSchema` (or any registered schema) is exported and imported before `generateSchema()` runs.
- If tenant models are missing, confirm `initMultiTenancy()` ran and tenants are registered. Also confirm `x-tenant-id` header matches a registered tenant id.