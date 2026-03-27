import type { ClientSession } from 'mongodb';
import { AbimongoContext } from '../context/AbimongoContext.js';
import { resolveAbimongoOption } from './resolveAbimongoOption.js';

// typed resolver for db/collection/tenant/session.
export interface RuntimeResolutionInput {
	methodTenantId?: string;
	methodDbName?: string;
	methodCollectionName?: string;
	methodSession?: ClientSession;

	modelTenantId?: string;
	modelDbName?: string;
	modelCollectionName?: string;
	modelSession?: ClientSession;

	clientDbName?: string;
}

export interface RuntimeResolutionOutput {
	tenantId?: string;
	dbName?: string;
	collectionName?: string;
	session?: ClientSession;
	requestId?: string;
	loggerMeta?: Record<string, any>;
}

export function resolveRuntimeConfig(
	input: RuntimeResolutionInput
): RuntimeResolutionOutput {
	const ctx = AbimongoContext.get();

	return {
		tenantId: resolveAbimongoOption([
			input.methodTenantId,
			ctx?.tenantId,
			input.modelTenantId
		]),
		dbName: resolveAbimongoOption([
			input.methodDbName,
			ctx?.dbName, 
			input.modelDbName,
			input.clientDbName
		]),
		collectionName: resolveAbimongoOption([
			input.methodCollectionName,
			ctx?.collectionName,
			input.modelCollectionName
		]),
		session: resolveAbimongoOption([
			input.methodSession,
			ctx?.session,
			input.modelSession
		]),
		requestId: ctx?.requestId,
		loggerMeta: ctx?.loggerMeta
	};
}