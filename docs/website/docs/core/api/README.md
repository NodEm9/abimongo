**@abimongo/core v1.0.0**

***

# @abimongo/core v1.0.0

## Enumerations

- [ErrorType](./core/enumerations/ErrorType.md)

## Classes

- [Abimongo](./core/classes/Abimongo.md)
- [AbimongoBootstrap](./core/classes/AbimongoBootstrap.md)
- [AbimongoBootstrapFactory](./core/classes/AbimongoBootstrapFactory.md)
- [AbimongoClient](./core/classes/AbimongoClient.md)
- [AbimongoGC](./core/classes/AbimongoGC.md)
- [AbimongoGraphQL](./core/classes/AbimongoGraphQL.md)
- [AbimongoModel](./core/classes/AbimongoModel.md)
- [AbimongoSchema](./core/classes/AbimongoSchema.md)
- [AuthService](./core/classes/AuthService.md)
- [MultiTenantManager](./core/classes/MultiTenantManager.md)
- [RedisService](./core/classes/RedisService.md)
- [Schema](./core/classes/Schema.md)
- [TenantContext](./core/classes/TenantContext.md)

## Interfaces

- [AbimongoClientConfig](./core/interfaces/AbimongoClientConfig.md)
- [AbimongoClientOptions](./core/interfaces/AbimongoClientOptions.md)
- [AbimongoClientType](./core/interfaces/AbimongoClientType.md)
- [AbimongoConfig](./core/interfaces/AbimongoConfig.md)
- [AbimongoConfigFile](./core/interfaces/AbimongoConfigFile.md)
- [AbimongoGraphQLOptions](./core/interfaces/AbimongoGraphQLOptions.md)
<!-- - [AbimongoLoggerSettings](./core/interfaces/AbimongoLoggerSettings.md) -->
- [AbimongoModelOptions](./core/interfaces/AbimongoModelOptions.md)
- [AbimongoPlugin](./core/interfaces/AbimongoPlugin.md)
- [InitMultiTenancyOptions](./core/interfaces/InitMultiTenancyOptions.md)
- [ProjectOptions](./core/interfaces/ProjectOptions.md)
- [Relationship](./core/interfaces/Relationship.md)

## Type Aliases

- [Document](./core/type-aliases/Document.md)
- [EventType](./core/type-aliases/EventType.md)
- [GCConfig](./core/type-aliases/GCConfig.md)
- [GetTanantModelParams](./core/type-aliases/GetTanantModelParams.md)
- [HookFunction](./core/type-aliases/HookFunction.md)
- [Permission](./core/type-aliases/Permission.md)
- [Role](./core/type-aliases/Role.md)
- [SchemaDefinition](./core/type-aliases/SchemaDefinition.md)
- [User](./core/type-aliases/User.md)

## Variables

- [abimongo](./core/variables/abimongo.md)
- [AbimongoModelRegistry](./core/variables/AbimongoModelRegistry.md)
- [abimongoSymbol](./core/variables/abimongoSymbol.md)
<!-- - [bufferedTransporter](./core/variables/bufferedTransporter.md) -->
- [DB\_CHANGE\_EVENT](./core/variables/DB_CHANGE_EVENT.md)
- [DOCUMENT\_DELETED\_EVENT](./core/variables/DOCUMENT_DELETED_EVENT.md)
- [DOCUMENT\_INSERTED\_EVENT](./core/variables/DOCUMENT_INSERTED_EVENT.md)
- [DOCUMENT\_UPDATED\_EVENT](./core/variables/DOCUMENT_UPDATED_EVENT.md)
<!-- - [elasticTransport](./core/variables/elasticTransport.md) -->
- [eventTypes](./core/variables/eventTypes.md)
<!-- - [logger](./core/variables/logger.md) -->
<!-- - [lokiTransport](./core/variables/lokiTransport.md) -->
- [now](./core/variables/now.md)
- [objectIdSymbol](./core/variables/objectIdSymbol.md)
- [redis](./core/variables/redis.md)
- [rolePermissions](./core/variables/rolePermissions.md)
- [SchemaType](./core/variables/SchemaType.md)
- [schemaTypeSymbol](./core/variables/schemaTypeSymbol.md)

## Functions

- [AbiMongoError](./core/functions/AbiMongoError.md)
- [applyMultiTenancy](./core/functions/applyMultiTenancy.md)
- [authorize](./core/functions/authorize.md)
- [cacheWithRedis](./core/functions/cacheWithRedis.md)
- [castId](./core/functions/castId.md)
- [checkPermission](./core/functions/checkPermission.md)
- [connectRedis](./core/functions/connectRedis.md)
- [createModel](./core/functions/createModel.md)
- [createSchema](./core/functions/createSchema.md)
- [describeEvent](./core/functions/describeEvent.md)
- [enforceRBAC](./core/functions/enforceRBAC.md)
- [ensureModelNameSafe](./core/functions/ensureModelNameSafe.md)
- [foldersAndFiles](./core/functions/foldersAndFiles.md)
- [formatDuration](./core/functions/formatDuration.md)
- [GCSettings](./core/functions/GCSettings.md)
- [generateProject](./core/functions/generateProject.md)
- [generateProjectWithConfig](./core/functions/generateProjectWithConfig.md)
- [getCachedData](./core/functions/getCachedData.md)
- [getEventOptions](./core/functions/getEventOptions.md)
- [getEventType](./core/functions/getEventType.md)
- [getModelFilesFromPath](./core/functions/getModelFilesFromPath.md)
- [getOriginalResolver](./core/functions/getOriginalResolver.md)
- [getRBACAction](./core/functions/getRBACAction.md)
- [getTenantDB](./core/functions/getTenantDB.md)
- [getTenantModel](./core/functions/getTenantModel.md)
- [initializeGraphQL](./core/functions/initializeGraphQL.md)
- [initializeRedis](./core/functions/initializeRedis.md)
- [initMultiTenancy](./core/functions/initMultiTenancy.md)
- [invalidateTenantCache](./core/functions/invalidateTenantCache.md)
- [isObjectId](./core/functions/isObjectId.md)
- [isValidDuration](./core/functions/isValidDuration.md)
- [isValidObjectId](./core/functions/isValidObjectId.md)
- [loadAbimongoConfig](./core/functions/loadAbimongoConfig.md)
- [loadModelsFromPath](./core/functions/loadModelsFromPath.md)
- [logDefaultEvent](./core/functions/logDefaultEvent.md)
- [logEvent](./core/functions/logEvent.md)
<!-- - [normalizeLoggerConfig](./core/functions/normalizeLoggerConfig.md) -->
- [parseDuration](./core/functions/parseDuration.md)
- [setCachedData](./core/functions/setCachedData.md)
<!-- - [setLogger](./core/functions/setLogger.md) -->
