/**
 * @author Emmanuel Nodolomwanyi - Abimongo Team
 * @package - @abimongo/core
 * @version 1.1.5
 */

/**
 * Abimongo Core Library for Browser
 * This module provides core functionalities for Abimongo in a browser environment.
 * It includes database operations, configuration, and more.
 * @module Abimongo Core Browser Module
 * @version 1.1.5
 */


console.log('Abimongo Core Library Loaded for (Browser)');

export * from './lib-core';
export * from './lib-core/bootstrap';
export * from './config';
export * from './graphql';
export * from './tanancy';
export * from './context';
export * from './plugins';
export * from './debug';
export { measureQueryForBrowser } from './instrumentation';

// This export is needed for adapter-types to avoid circular dependency issues
// when both packages are used together. But it's optional
// export { runWithAdapterContext, resolveTenant } from "@abimongo/adapter-types";

export * from './utils/builders';
export * from './utils';
export * from './gc';
export { GCSettings } from './decorators/gcSettings';
export * from './redis-manager';
export * from './types';
export type { SchemaType } from './types/schema.type';
export type { Document } from './types/document';
export type { ErrorType } from './utils/error/errorTypes';