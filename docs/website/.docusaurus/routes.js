import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/abimongo/markdown-page',
    component: ComponentCreator('/abimongo/markdown-page', 'aa6'),
    exact: true
  },
  {
    path: '/abimongo/cli',
    component: ComponentCreator('/abimongo/cli', '221'),
    routes: [
      {
        path: '/abimongo/cli',
        component: ComponentCreator('/abimongo/cli', 'dc0'),
        routes: [
          {
            path: '/abimongo/cli',
            component: ComponentCreator('/abimongo/cli', '679'),
            routes: [
              {
                path: '/abimongo/cli/intro',
                component: ComponentCreator('/abimongo/cli/intro', '2c1'),
                exact: true,
                sidebar: "cli"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/abimongo/core',
    component: ComponentCreator('/abimongo/core', '236'),
    routes: [
      {
        path: '/abimongo/core',
        component: ComponentCreator('/abimongo/core', '9f5'),
        routes: [
          {
            path: '/abimongo/core',
            component: ComponentCreator('/abimongo/core', '98d'),
            routes: [
              {
                path: '/abimongo/core/abimongo-bootstrap',
                component: ComponentCreator('/abimongo/core/abimongo-bootstrap', '624'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/abimongo-bootstrap/AbimongoBootstrap',
                component: ComponentCreator('/abimongo/core/abimongo-bootstrap/AbimongoBootstrap', 'fea'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api',
                component: ComponentCreator('/abimongo/core/api', '4cd'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/Abimongo',
                component: ComponentCreator('/abimongo/core/api/classes/Abimongo', '30d'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/AbimongoBootstrap',
                component: ComponentCreator('/abimongo/core/api/classes/AbimongoBootstrap', 'fa2'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/AbimongoClient',
                component: ComponentCreator('/abimongo/core/api/classes/AbimongoClient', 'f3d'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/AbimongoGC',
                component: ComponentCreator('/abimongo/core/api/classes/AbimongoGC', '430'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/AbimongoGraphQL',
                component: ComponentCreator('/abimongo/core/api/classes/AbimongoGraphQL', '54f'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/AbimongoModel',
                component: ComponentCreator('/abimongo/core/api/classes/AbimongoModel', 'd55'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/AbimongoSchema',
                component: ComponentCreator('/abimongo/core/api/classes/AbimongoSchema', '8fd'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/AuthService',
                component: ComponentCreator('/abimongo/core/api/classes/AuthService', '77f'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/initAbimongo',
                component: ComponentCreator('/abimongo/core/api/classes/initAbimongo', 'f91'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/MultiTenantManager',
                component: ComponentCreator('/abimongo/core/api/classes/MultiTenantManager', '8aa'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/RedisService',
                component: ComponentCreator('/abimongo/core/api/classes/RedisService', '355'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/Schema',
                component: ComponentCreator('/abimongo/core/api/classes/Schema', '252'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/TenantContext',
                component: ComponentCreator('/abimongo/core/api/classes/TenantContext', '7dd'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/enumerations/ErrorType',
                component: ComponentCreator('/abimongo/core/api/enumerations/ErrorType', 'db9'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/AbiMongoError',
                component: ComponentCreator('/abimongo/core/api/functions/AbiMongoError', 'f09'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/applyMultiTenancy',
                component: ComponentCreator('/abimongo/core/api/functions/applyMultiTenancy', 'c57'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/authorize',
                component: ComponentCreator('/abimongo/core/api/functions/authorize', '361'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/cacheWithRedis',
                component: ComponentCreator('/abimongo/core/api/functions/cacheWithRedis', '37f'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/castId',
                component: ComponentCreator('/abimongo/core/api/functions/castId', '530'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/checkPermission',
                component: ComponentCreator('/abimongo/core/api/functions/checkPermission', '64e'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/colourize',
                component: ComponentCreator('/abimongo/core/api/functions/colourize', '1d1'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/connectRedis',
                component: ComponentCreator('/abimongo/core/api/functions/connectRedis', 'a94'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/createModel',
                component: ComponentCreator('/abimongo/core/api/functions/createModel', '004'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/createSchema',
                component: ComponentCreator('/abimongo/core/api/functions/createSchema', 'f91'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/describeEvent',
                component: ComponentCreator('/abimongo/core/api/functions/describeEvent', '410'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/enforceRBAC',
                component: ComponentCreator('/abimongo/core/api/functions/enforceRBAC', '07b'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/ensureModelNameSafe',
                component: ComponentCreator('/abimongo/core/api/functions/ensureModelNameSafe', '448'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/foldersAndFiles',
                component: ComponentCreator('/abimongo/core/api/functions/foldersAndFiles', '6e5'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/formatDuration',
                component: ComponentCreator('/abimongo/core/api/functions/formatDuration', 'd23'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/GCSettings',
                component: ComponentCreator('/abimongo/core/api/functions/GCSettings', 'a0f'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/generateProject',
                component: ComponentCreator('/abimongo/core/api/functions/generateProject', '409'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/generateProjectWithConfig',
                component: ComponentCreator('/abimongo/core/api/functions/generateProjectWithConfig', '0be'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/getCachedData',
                component: ComponentCreator('/abimongo/core/api/functions/getCachedData', 'ea9'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/getEventOptions',
                component: ComponentCreator('/abimongo/core/api/functions/getEventOptions', '69a'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/getEventType',
                component: ComponentCreator('/abimongo/core/api/functions/getEventType', 'd9f'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/getModelFilesFromPath',
                component: ComponentCreator('/abimongo/core/api/functions/getModelFilesFromPath', '5f2'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/getOriginalResolver',
                component: ComponentCreator('/abimongo/core/api/functions/getOriginalResolver', '219'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/getRBACAction',
                component: ComponentCreator('/abimongo/core/api/functions/getRBACAction', '677'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/getTenantDB',
                component: ComponentCreator('/abimongo/core/api/functions/getTenantDB', 'c6c'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/getTenantModel',
                component: ComponentCreator('/abimongo/core/api/functions/getTenantModel', 'b9e'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/initializeGraphQL',
                component: ComponentCreator('/abimongo/core/api/functions/initializeGraphQL', '922'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/initializeRedis',
                component: ComponentCreator('/abimongo/core/api/functions/initializeRedis', 'eb2'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/initMultiTenancy',
                component: ComponentCreator('/abimongo/core/api/functions/initMultiTenancy', '8fb'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/invalidateTenantCache',
                component: ComponentCreator('/abimongo/core/api/functions/invalidateTenantCache', '6c1'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/isObjectId',
                component: ComponentCreator('/abimongo/core/api/functions/isObjectId', '114'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/isValidDuration',
                component: ComponentCreator('/abimongo/core/api/functions/isValidDuration', '741'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/isValidObjectId',
                component: ComponentCreator('/abimongo/core/api/functions/isValidObjectId', '165'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/loadAbimongoConfig',
                component: ComponentCreator('/abimongo/core/api/functions/loadAbimongoConfig', '362'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/loadModelsFromPath',
                component: ComponentCreator('/abimongo/core/api/functions/loadModelsFromPath', 'c54'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/logDefaultEvent',
                component: ComponentCreator('/abimongo/core/api/functions/logDefaultEvent', 'e6e'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/logEvent',
                component: ComponentCreator('/abimongo/core/api/functions/logEvent', 'ad7'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/parseDuration',
                component: ComponentCreator('/abimongo/core/api/functions/parseDuration', 'ba9'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/setCachedData',
                component: ComponentCreator('/abimongo/core/api/functions/setCachedData', 'bf0'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/setLogger',
                component: ComponentCreator('/abimongo/core/api/functions/setLogger', '222'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/AbimongoClientConfig',
                component: ComponentCreator('/abimongo/core/api/interfaces/AbimongoClientConfig', 'a68'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/AbimongoClientOptions',
                component: ComponentCreator('/abimongo/core/api/interfaces/AbimongoClientOptions', 'c49'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/AbimongoClientType',
                component: ComponentCreator('/abimongo/core/api/interfaces/AbimongoClientType', '115'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/AbimongoConfig',
                component: ComponentCreator('/abimongo/core/api/interfaces/AbimongoConfig', 'abd'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/AbimongoConfigFile',
                component: ComponentCreator('/abimongo/core/api/interfaces/AbimongoConfigFile', '724'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/AbimongoGraphQLOptions',
                component: ComponentCreator('/abimongo/core/api/interfaces/AbimongoGraphQLOptions', '22c'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/AbimongoLoggerSettings',
                component: ComponentCreator('/abimongo/core/api/interfaces/AbimongoLoggerSettings', '979'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/AbimongoModelOptions',
                component: ComponentCreator('/abimongo/core/api/interfaces/AbimongoModelOptions', 'bd2'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/AbimongoPlugin',
                component: ComponentCreator('/abimongo/core/api/interfaces/AbimongoPlugin', '5b7'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/ILogger',
                component: ComponentCreator('/abimongo/core/api/interfaces/ILogger', '1ac'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/InitMultiTenancyOptions',
                component: ComponentCreator('/abimongo/core/api/interfaces/InitMultiTenancyOptions', '5e2'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/NoOpLogger',
                component: ComponentCreator('/abimongo/core/api/interfaces/NoOpLogger', 'c6c'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/ProjectOptions',
                component: ComponentCreator('/abimongo/core/api/interfaces/ProjectOptions', '987'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/Relationship',
                component: ComponentCreator('/abimongo/core/api/interfaces/Relationship', '671'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/type-aliases/Document',
                component: ComponentCreator('/abimongo/core/api/type-aliases/Document', '729'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/type-aliases/EventType',
                component: ComponentCreator('/abimongo/core/api/type-aliases/EventType', '70f'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/type-aliases/GCConfig',
                component: ComponentCreator('/abimongo/core/api/type-aliases/GCConfig', 'bf6'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/type-aliases/GetTanantModelParams',
                component: ComponentCreator('/abimongo/core/api/type-aliases/GetTanantModelParams', '146'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/type-aliases/HookFunction',
                component: ComponentCreator('/abimongo/core/api/type-aliases/HookFunction', '9a9'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/type-aliases/Permission',
                component: ComponentCreator('/abimongo/core/api/type-aliases/Permission', '6a8'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/type-aliases/Role',
                component: ComponentCreator('/abimongo/core/api/type-aliases/Role', 'b50'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/type-aliases/SchemaDefinition',
                component: ComponentCreator('/abimongo/core/api/type-aliases/SchemaDefinition', '99c'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/type-aliases/User',
                component: ComponentCreator('/abimongo/core/api/type-aliases/User', '0fe'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/abimongo',
                component: ComponentCreator('/abimongo/core/api/variables/abimongo', '731'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/AbimongoModelRegistry',
                component: ComponentCreator('/abimongo/core/api/variables/AbimongoModelRegistry', '116'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/abimongoSymbol',
                component: ComponentCreator('/abimongo/core/api/variables/abimongoSymbol', '83c'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/bufferedTransporter',
                component: ComponentCreator('/abimongo/core/api/variables/bufferedTransporter', '968'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/DB_CHANGE_EVENT',
                component: ComponentCreator('/abimongo/core/api/variables/DB_CHANGE_EVENT', '9d2'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/DOCUMENT_DELETED_EVENT',
                component: ComponentCreator('/abimongo/core/api/variables/DOCUMENT_DELETED_EVENT', '06e'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/DOCUMENT_INSERTED_EVENT',
                component: ComponentCreator('/abimongo/core/api/variables/DOCUMENT_INSERTED_EVENT', 'e79'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/DOCUMENT_UPDATED_EVENT',
                component: ComponentCreator('/abimongo/core/api/variables/DOCUMENT_UPDATED_EVENT', '98f'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/elasticTransport',
                component: ComponentCreator('/abimongo/core/api/variables/elasticTransport', '128'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/eventTypes',
                component: ComponentCreator('/abimongo/core/api/variables/eventTypes', '048'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/logger',
                component: ComponentCreator('/abimongo/core/api/variables/logger', '3b3'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/lokiTransport',
                component: ComponentCreator('/abimongo/core/api/variables/lokiTransport', '08f'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/now',
                component: ComponentCreator('/abimongo/core/api/variables/now', 'efc'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/objectIdSymbol',
                component: ComponentCreator('/abimongo/core/api/variables/objectIdSymbol', 'dcd'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/redis',
                component: ComponentCreator('/abimongo/core/api/variables/redis', '95b'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/rolePermissions',
                component: ComponentCreator('/abimongo/core/api/variables/rolePermissions', '1f2'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/SchemaType',
                component: ComponentCreator('/abimongo/core/api/variables/SchemaType', '42c'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/schemaTypeSymbol',
                component: ComponentCreator('/abimongo/core/api/variables/schemaTypeSymbol', '8de'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/core-concepts/AbimongoClient',
                component: ComponentCreator('/abimongo/core/core-concepts/AbimongoClient', '2b6'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/core-concepts/AbimongoModel',
                component: ComponentCreator('/abimongo/core/core-concepts/AbimongoModel', '776'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/core-concepts/AbimongoSchema',
                component: ComponentCreator('/abimongo/core/core-concepts/AbimongoSchema', '264'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/core-concepts/MultiTenancy',
                component: ComponentCreator('/abimongo/core/core-concepts/MultiTenancy', '285'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/core/log-changes',
                component: ComponentCreator('/abimongo/core/core/log-changes', '796'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/faq',
                component: ComponentCreator('/abimongo/core/faq', '6b6'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/features/AbimongoGraphQL',
                component: ComponentCreator('/abimongo/core/features/AbimongoGraphQL', '6e2'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/features/Caching',
                component: ComponentCreator('/abimongo/core/features/Caching', '453'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/features/rbac',
                component: ComponentCreator('/abimongo/core/features/rbac', 'c7e'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/features/redis',
                component: ComponentCreator('/abimongo/core/features/redis', '338'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/getting-started/gettting-started',
                component: ComponentCreator('/abimongo/core/getting-started/gettting-started', '1e3'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/getting-started/installation',
                component: ComponentCreator('/abimongo/core/getting-started/installation', '421'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/intro',
                component: ComponentCreator('/abimongo/core/intro', '598'),
                exact: true,
                sidebar: "core"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/abimongo/create',
    component: ComponentCreator('/abimongo/create', 'a9a'),
    routes: [
      {
        path: '/abimongo/create',
        component: ComponentCreator('/abimongo/create', 'da0'),
        routes: [
          {
            path: '/abimongo/create',
            component: ComponentCreator('/abimongo/create', 'd28'),
            routes: [
              {
                path: '/abimongo/create/abimongo-cli',
                component: ComponentCreator('/abimongo/create/abimongo-cli', '8fd'),
                exact: true,
                sidebar: "create"
              },
              {
                path: '/abimongo/create/intro',
                component: ComponentCreator('/abimongo/create/intro', 'd6e'),
                exact: true,
                sidebar: "create"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/abimongo/logger',
    component: ComponentCreator('/abimongo/logger', '0f3'),
    routes: [
      {
        path: '/abimongo/logger',
        component: ComponentCreator('/abimongo/logger', 'af8'),
        routes: [
          {
            path: '/abimongo/logger',
            component: ComponentCreator('/abimongo/logger', '9c1'),
            routes: [
              {
                path: '/abimongo/logger/api',
                component: ComponentCreator('/abimongo/logger/api', 'f56'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/classes/AbimongoLogger',
                component: ComponentCreator('/abimongo/logger/api/classes/AbimongoLogger', '2a4'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/classes/AdvancedRollingFileTransporter',
                component: ComponentCreator('/abimongo/logger/api/classes/AdvancedRollingFileTransporter', '7ef'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/classes/AsyncBatchTransporter',
                component: ComponentCreator('/abimongo/logger/api/classes/AsyncBatchTransporter', '52b'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/classes/BufferedTransporter',
                component: ComponentCreator('/abimongo/logger/api/classes/BufferedTransporter', 'aae'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/classes/FileTransporter',
                component: ComponentCreator('/abimongo/logger/api/classes/FileTransporter', 'f97'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/classes/Logger',
                component: ComponentCreator('/abimongo/logger/api/classes/Logger', 'b61'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/classes/MetricsTracker',
                component: ComponentCreator('/abimongo/logger/api/classes/MetricsTracker', '582'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/classes/NoOpLogger',
                component: ComponentCreator('/abimongo/logger/api/classes/NoOpLogger', '983'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/clearAllTimers',
                component: ComponentCreator('/abimongo/logger/api/functions/clearAllTimers', '2aa'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/colorByLevel',
                component: ComponentCreator('/abimongo/logger/api/functions/colorByLevel', '5be'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/consoleTransport',
                component: ComponentCreator('/abimongo/logger/api/functions/consoleTransport', '004'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/createCircuitBreaker',
                component: ComponentCreator('/abimongo/logger/api/functions/createCircuitBreaker', '4b0'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/createElasticTransport',
                component: ComponentCreator('/abimongo/logger/api/functions/createElasticTransport', '892'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/createFileTransporter',
                component: ComponentCreator('/abimongo/logger/api/functions/createFileTransporter', '254'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/createHttpTransport',
                component: ComponentCreator('/abimongo/logger/api/functions/createHttpTransport', 'da2'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/createLogger',
                component: ComponentCreator('/abimongo/logger/api/functions/createLogger', '160'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/createLokiTransport',
                component: ComponentCreator('/abimongo/logger/api/functions/createLokiTransport', '99a'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/createResilientTransporter',
                component: ComponentCreator('/abimongo/logger/api/functions/createResilientTransporter', 'b51'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/createRotatingFileTransporter',
                component: ComponentCreator('/abimongo/logger/api/functions/createRotatingFileTransporter', 'e7b'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/formatConsole',
                component: ComponentCreator('/abimongo/logger/api/functions/formatConsole', '027'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/formatError',
                component: ComponentCreator('/abimongo/logger/api/functions/formatError', '74f'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/formatJSON',
                component: ComponentCreator('/abimongo/logger/api/functions/formatJSON', '726'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/formatMsg',
                component: ComponentCreator('/abimongo/logger/api/functions/formatMsg', '481'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/getLogLevel',
                component: ComponentCreator('/abimongo/logger/api/functions/getLogLevel', '0ec'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/getLogLevelPriority',
                component: ComponentCreator('/abimongo/logger/api/functions/getLogLevelPriority', 'd8b'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/isLogLevel',
                component: ComponentCreator('/abimongo/logger/api/functions/isLogLevel', 'abf'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/now',
                component: ComponentCreator('/abimongo/logger/api/functions/now', 'c71'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/registerInterval',
                component: ComponentCreator('/abimongo/logger/api/functions/registerInterval', '4d4'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/registerTimeout',
                component: ComponentCreator('/abimongo/logger/api/functions/registerTimeout', '08a'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/retryWithBackoff',
                component: ComponentCreator('/abimongo/logger/api/functions/retryWithBackoff', '31a'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/setupLogger',
                component: ComponentCreator('/abimongo/logger/api/functions/setupLogger', '94c'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/shouldLog',
                component: ComponentCreator('/abimongo/logger/api/functions/shouldLog', '791'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/AsyncBatchTransporterOptions',
                component: ComponentCreator('/abimongo/logger/api/interfaces/AsyncBatchTransporterOptions', '5ed'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/FormatOptions',
                component: ComponentCreator('/abimongo/logger/api/interfaces/FormatOptions', '900'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/ILogger',
                component: ComponentCreator('/abimongo/logger/api/interfaces/ILogger', 'f60'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/LogEntry',
                component: ComponentCreator('/abimongo/logger/api/interfaces/LogEntry', 'b90'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/LoggerConfig',
                component: ComponentCreator('/abimongo/logger/api/interfaces/LoggerConfig', 'b7f'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/LoggerFormatOptions',
                component: ComponentCreator('/abimongo/logger/api/interfaces/LoggerFormatOptions', '857'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/LoggerHooks',
                component: ComponentCreator('/abimongo/logger/api/interfaces/LoggerHooks', 'b2e'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/LoggerTransporter',
                component: ComponentCreator('/abimongo/logger/api/interfaces/LoggerTransporter', '430'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/LogMeta',
                component: ComponentCreator('/abimongo/logger/api/interfaces/LogMeta', 'df1'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/LogTransport',
                component: ComponentCreator('/abimongo/logger/api/interfaces/LogTransport', '724'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/MetricsSnapshot',
                component: ComponentCreator('/abimongo/logger/api/interfaces/MetricsSnapshot', '4f8'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/RotatingFileTransporterOptions',
                component: ComponentCreator('/abimongo/logger/api/interfaces/RotatingFileTransporterOptions', 'ce1'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/Transporter',
                component: ComponentCreator('/abimongo/logger/api/interfaces/Transporter', '11c'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/type-aliases/AbimongoConfig',
                component: ComponentCreator('/abimongo/logger/api/type-aliases/AbimongoConfig', '064'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/type-aliases/LogLevel',
                component: ComponentCreator('/abimongo/logger/api/type-aliases/LogLevel', '144'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/type-aliases/RemoteTransporter',
                component: ComponentCreator('/abimongo/logger/api/type-aliases/RemoteTransporter', '36e'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/variables/DefaultLogger',
                component: ComponentCreator('/abimongo/logger/api/variables/DefaultLogger', 'aa6'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/variables/LOG_LEVELS',
                component: ComponentCreator('/abimongo/logger/api/variables/LOG_LEVELS', '443'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/variables/logger',
                component: ComponentCreator('/abimongo/logger/api/variables/logger', '5cf'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/faq',
                component: ComponentCreator('/abimongo/logger/faq', '6be'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/intro',
                component: ComponentCreator('/abimongo/logger/intro', '894'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/logger/consumption',
                component: ComponentCreator('/abimongo/logger/logger/consumption', 'ace'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/logger/getting-started',
                component: ComponentCreator('/abimongo/logger/logger/getting-started', '9bb'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/logger/logger-guides',
                component: ComponentCreator('/abimongo/logger/logger/logger-guides', 'd6f'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/logger/transports',
                component: ComponentCreator('/abimongo/logger/logger/transports', 'da7'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/metrics-tracer',
                component: ComponentCreator('/abimongo/logger/metrics-tracer', 'c93'),
                exact: true,
                sidebar: "logger"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/abimongo/tutorials',
    component: ComponentCreator('/abimongo/tutorials', '389'),
    routes: [
      {
        path: '/abimongo/tutorials',
        component: ComponentCreator('/abimongo/tutorials', '828'),
        routes: [
          {
            path: '/abimongo/tutorials',
            component: ComponentCreator('/abimongo/tutorials', '6d9'),
            routes: [
              {
                path: '/abimongo/tutorials/core_tutotrials/abimongo-express',
                component: ComponentCreator('/abimongo/tutorials/core_tutotrials/abimongo-express', '3b1'),
                exact: true,
                sidebar: "tutorials"
              },
              {
                path: '/abimongo/tutorials/core_tutotrials/abimongo-graphql',
                component: ComponentCreator('/abimongo/tutorials/core_tutotrials/abimongo-graphql', '083'),
                exact: true,
                sidebar: "tutorials"
              },
              {
                path: '/abimongo/tutorials/core_tutotrials/abimongo-multitenancy',
                component: ComponentCreator('/abimongo/tutorials/core_tutotrials/abimongo-multitenancy', '8d8'),
                exact: true,
                sidebar: "tutorials"
              },
              {
                path: '/abimongo/tutorials/core_tutotrials/core-tutorials',
                component: ComponentCreator('/abimongo/tutorials/core_tutotrials/core-tutorials', '821'),
                exact: true,
                sidebar: "tutorials"
              },
              {
                path: '/abimongo/tutorials/create-tutorials',
                component: ComponentCreator('/abimongo/tutorials/create-tutorials', '0d4'),
                exact: true,
                sidebar: "tutorials"
              },
              {
                path: '/abimongo/tutorials/intro',
                component: ComponentCreator('/abimongo/tutorials/intro', 'dde'),
                exact: true,
                sidebar: "tutorials"
              },
              {
                path: '/abimongo/tutorials/logger-tutorials',
                component: ComponentCreator('/abimongo/tutorials/logger-tutorials', 'c47'),
                exact: true,
                sidebar: "tutorials"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/abimongo/',
    component: ComponentCreator('/abimongo/', '3bc'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
