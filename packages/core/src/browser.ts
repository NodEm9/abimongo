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

export * from './lib-core/index.js';
export * from './lib-core/bootstrap/index.js';
export * from './config/index.js';
export * from './graphql/index.js';
export * from './tanancy/index.js';
export * from './context/index.js';
export * from './plugins/index.js';
export * from './debug/index.js';
export { measureQueryForBrowser } from './instrumentation/measureQuery.browser.js';

// This export is needed for adapter-types to avoid circular dependency issues
// when both packages are used together. But it's optional
// export { runWithAdapterContext, resolveTenant } from "@abimongo/adapter-types";

export * from './utils/builders/index.js';
export * from './utils/index.js';
export * from './gc/AbimongoGC.js';
export { GCSettings } from './decorators/gcSettings.js';
export * from './redis-manager/index.js';
export * from './types/index.js';
export type { SchemaType } from './types/schema.type.js';
export type { Document } from './types/document.js';
export type { ErrorType } from './utils/error/errorTypes.js';