**@abimongo/core v1.4.14**

***

# @abimongo/core v1.4.14

## Enumerations

- [ErrorType](enumerations/ErrorType.md)

## Classes

- [Abimongo](classes/Abimongo.md)
- [AbimongoBootstrap](classes/AbimongoBootstrap.md)
- [AbimongoBootstrapFactory](classes/AbimongoBootstrapFactory.md)
- [AbimongoClient](classes/AbimongoClient.md)
- [AbimongoGC](classes/AbimongoGC.md)
- [AbimongoGraphQL](classes/AbimongoGraphQL.md)
- [AbimongoModel](classes/AbimongoModel.md)
- [AbimongoSchema](classes/AbimongoSchema.md)
- [AuthService](classes/AuthService.md)
- [MultiTenantManager](classes/MultiTenantManager.md)
- [RedisService](classes/RedisService.md)
- [Schema](classes/Schema.md)
- [TenantContext](classes/TenantContext.md)

## Interfaces

- [AbimongoClientConfig](interfaces/AbimongoClientConfig.md)
- [AbimongoClientOptions](interfaces/AbimongoClientOptions.md)
- [AbimongoClientType](interfaces/AbimongoClientType.md)
- [AbimongoConfig](interfaces/AbimongoConfig.md)
- [AbimongoConfigFile](interfaces/AbimongoConfigFile.md)
- [AbimongoGraphQLOptions](interfaces/AbimongoGraphQLOptions.md)
- [AbimongoLoggerSettings](interfaces/AbimongoLoggerSettings.md)
- [AbimongoModelOptions](interfaces/AbimongoModelOptions.md)
- [AbimongoPlugin](interfaces/AbimongoPlugin.md)
- [InitMultiTenancyOptions](interfaces/InitMultiTenancyOptions.md)
- [ProjectOptions](interfaces/ProjectOptions.md)
- [Relationship](interfaces/Relationship.md)

## Type Aliases

- [Document](type-aliases/Document.md)
- [EventType](type-aliases/EventType.md)
- [GCConfig](type-aliases/GCConfig.md)
- [GetTanantModelParams](type-aliases/GetTanantModelParams.md)
- [HookFunction](type-aliases/HookFunction.md)
- [Permission](type-aliases/Permission.md)
- [Role](type-aliases/Role.md)
- [SchemaDefinition](type-aliases/SchemaDefinition.md)
- [User](type-aliases/User.md)

## Variables

- [abimongo](variables/abimongo.md)
- [AbimongoModelRegistry](variables/AbimongoModelRegistry.md)
- [abimongoSymbol](variables/abimongoSymbol.md)
- [bufferedTransporter](variables/bufferedTransporter.md)
- [DB\_CHANGE\_EVENT](variables/DB_CHANGE_EVENT.md)
- [DOCUMENT\_DELETED\_EVENT](variables/DOCUMENT_DELETED_EVENT.md)
- [DOCUMENT\_INSERTED\_EVENT](variables/DOCUMENT_INSERTED_EVENT.md)
- [DOCUMENT\_UPDATED\_EVENT](variables/DOCUMENT_UPDATED_EVENT.md)
- [elasticTransport](variables/elasticTransport.md)
- [eventTypes](variables/eventTypes.md)
- [logger](variables/logger.md)
- [lokiTransport](variables/lokiTransport.md)
- [now](variables/now.md)
- [objectIdSymbol](variables/objectIdSymbol.md)
- [redis](variables/redis.md)
- [rolePermissions](variables/rolePermissions.md)
- [SchemaType](variables/SchemaType.md)
- [schemaTypeSymbol](variables/schemaTypeSymbol.md)

## Functions

- [AbiMongoError](functions/AbiMongoError.md)
- [applyMultiTenancy](functions/applyMultiTenancy.md)
- [authorize](functions/authorize.md)
- [cacheWithRedis](functions/cacheWithRedis.md)
- [castId](functions/castId.md)
- [checkPermission](functions/checkPermission.md)
- [connectRedis](functions/connectRedis.md)
- [createModel](functions/createModel.md)
- [createSchema](functions/createSchema.md)
- [describeEvent](functions/describeEvent.md)
- [enforceRBAC](functions/enforceRBAC.md)
- [ensureModelNameSafe](functions/ensureModelNameSafe.md)
- [formatDuration](functions/formatDuration.md)
- [GCSettings](functions/GCSettings.md)
- [generateProject](functions/generateProject.md)
- [generateProjectWithConfig](functions/generateProjectWithConfig.md)
- [getCachedData](functions/getCachedData.md)
- [getEventOptions](functions/getEventOptions.md)
- [getEventType](functions/getEventType.md)
- [getModelFilesFromPath](functions/getModelFilesFromPath.md)
- [getOriginalResolver](functions/getOriginalResolver.md)
- [getRBACAction](functions/getRBACAction.md)
- [getTenantDB](functions/getTenantDB.md)
- [getTenantModel](functions/getTenantModel.md)
- [initializeGraphQL](functions/initializeGraphQL.md)
- [initializeRedis](functions/initializeRedis.md)
- [initMultiTenancy](functions/initMultiTenancy.md)
- [invalidateTenantCache](functions/invalidateTenantCache.md)
- [isObjectId](functions/isObjectId.md)
- [isValidDuration](functions/isValidDuration.md)
- [isValidObjectId](functions/isValidObjectId.md)
- [loadAbimongoConfig](functions/loadAbimongoConfig.md)
- [loadModelsFromPath](functions/loadModelsFromPath.md)
- [logDefaultEvent](functions/logDefaultEvent.md)
- [logEvent](functions/logEvent.md)
- [normalizeLoggerConfig](functions/normalizeLoggerConfig.md)
- [parseDuration](functions/parseDuration.md)
- [setCachedData](functions/setCachedData.md)
- [setLogger](functions/setLogger.md)
