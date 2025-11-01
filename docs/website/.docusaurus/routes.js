import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/abimongo/__docusaurus/debug',
    component: ComponentCreator('/abimongo/__docusaurus/debug', '2a5'),
    exact: true
  },
  {
    path: '/abimongo/__docusaurus/debug/config',
    component: ComponentCreator('/abimongo/__docusaurus/debug/config', '9a5'),
    exact: true
  },
  {
    path: '/abimongo/__docusaurus/debug/content',
    component: ComponentCreator('/abimongo/__docusaurus/debug/content', 'fe1'),
    exact: true
  },
  {
    path: '/abimongo/__docusaurus/debug/globalData',
    component: ComponentCreator('/abimongo/__docusaurus/debug/globalData', 'd7a'),
    exact: true
  },
  {
    path: '/abimongo/__docusaurus/debug/metadata',
    component: ComponentCreator('/abimongo/__docusaurus/debug/metadata', 'f74'),
    exact: true
  },
  {
    path: '/abimongo/__docusaurus/debug/registry',
    component: ComponentCreator('/abimongo/__docusaurus/debug/registry', '658'),
    exact: true
  },
  {
    path: '/abimongo/__docusaurus/debug/routes',
    component: ComponentCreator('/abimongo/__docusaurus/debug/routes', '0b3'),
    exact: true
  },
  {
    path: '/abimongo/markdown-page',
    component: ComponentCreator('/abimongo/markdown-page', 'aa6'),
    exact: true
  },
  {
    path: '/abimongo/core',
    component: ComponentCreator('/abimongo/core', '715'),
    routes: [
      {
        path: '/abimongo/core',
        component: ComponentCreator('/abimongo/core', '0d2'),
        routes: [
          {
            path: '/abimongo/core',
            component: ComponentCreator('/abimongo/core', '233'),
            routes: [
              {
                path: '/abimongo/core/abimongo-bootstrap',
                component: ComponentCreator('/abimongo/core/abimongo-bootstrap', 'df9'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/abimongo-bootstrap/AbimongoBootstrap',
                component: ComponentCreator('/abimongo/core/abimongo-bootstrap/AbimongoBootstrap', '5eb'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api',
                component: ComponentCreator('/abimongo/core/api', 'cba'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/Abimongo',
                component: ComponentCreator('/abimongo/core/api/classes/Abimongo', '1a6'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/AbimongoBootstrap',
                component: ComponentCreator('/abimongo/core/api/classes/AbimongoBootstrap', 'bee'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/AbimongoClient',
                component: ComponentCreator('/abimongo/core/api/classes/AbimongoClient', '591'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/AbimongoGC',
                component: ComponentCreator('/abimongo/core/api/classes/AbimongoGC', '212'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/AbimongoGraphQL',
                component: ComponentCreator('/abimongo/core/api/classes/AbimongoGraphQL', '9ea'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/AbimongoModel',
                component: ComponentCreator('/abimongo/core/api/classes/AbimongoModel', '978'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/AbimongoSchema',
                component: ComponentCreator('/abimongo/core/api/classes/AbimongoSchema', '418'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/AuthService',
                component: ComponentCreator('/abimongo/core/api/classes/AuthService', '7a4'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/initAbimongo',
                component: ComponentCreator('/abimongo/core/api/classes/initAbimongo', 'a91'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/MultiTenantManager',
                component: ComponentCreator('/abimongo/core/api/classes/MultiTenantManager', '07c'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/RedisService',
                component: ComponentCreator('/abimongo/core/api/classes/RedisService', '98e'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/Schema',
                component: ComponentCreator('/abimongo/core/api/classes/Schema', 'ab6'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/classes/TenantContext',
                component: ComponentCreator('/abimongo/core/api/classes/TenantContext', '6ed'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/enumerations/ErrorType',
                component: ComponentCreator('/abimongo/core/api/enumerations/ErrorType', 'fc5'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/AbiMongoError',
                component: ComponentCreator('/abimongo/core/api/functions/AbiMongoError', '54c'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/applyMultiTenancy',
                component: ComponentCreator('/abimongo/core/api/functions/applyMultiTenancy', 'b51'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/authorize',
                component: ComponentCreator('/abimongo/core/api/functions/authorize', 'bed'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/cacheWithRedis',
                component: ComponentCreator('/abimongo/core/api/functions/cacheWithRedis', 'f85'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/castId',
                component: ComponentCreator('/abimongo/core/api/functions/castId', '4d9'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/checkPermission',
                component: ComponentCreator('/abimongo/core/api/functions/checkPermission', 'b76'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/colourize',
                component: ComponentCreator('/abimongo/core/api/functions/colourize', '88e'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/connectRedis',
                component: ComponentCreator('/abimongo/core/api/functions/connectRedis', '7fc'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/createModel',
                component: ComponentCreator('/abimongo/core/api/functions/createModel', '2e8'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/createSchema',
                component: ComponentCreator('/abimongo/core/api/functions/createSchema', '7ff'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/describeEvent',
                component: ComponentCreator('/abimongo/core/api/functions/describeEvent', '3cc'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/enforceRBAC',
                component: ComponentCreator('/abimongo/core/api/functions/enforceRBAC', '939'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/ensureModelNameSafe',
                component: ComponentCreator('/abimongo/core/api/functions/ensureModelNameSafe', '699'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/foldersAndFiles',
                component: ComponentCreator('/abimongo/core/api/functions/foldersAndFiles', 'c12'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/formatDuration',
                component: ComponentCreator('/abimongo/core/api/functions/formatDuration', 'e30'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/GCSettings',
                component: ComponentCreator('/abimongo/core/api/functions/GCSettings', 'b5d'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/generateProject',
                component: ComponentCreator('/abimongo/core/api/functions/generateProject', '59f'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/generateProjectWithConfig',
                component: ComponentCreator('/abimongo/core/api/functions/generateProjectWithConfig', '6ea'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/getCachedData',
                component: ComponentCreator('/abimongo/core/api/functions/getCachedData', 'bbb'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/getEventOptions',
                component: ComponentCreator('/abimongo/core/api/functions/getEventOptions', '479'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/getEventType',
                component: ComponentCreator('/abimongo/core/api/functions/getEventType', '0fa'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/getModelFilesFromPath',
                component: ComponentCreator('/abimongo/core/api/functions/getModelFilesFromPath', '07e'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/getOriginalResolver',
                component: ComponentCreator('/abimongo/core/api/functions/getOriginalResolver', '93d'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/getRBACAction',
                component: ComponentCreator('/abimongo/core/api/functions/getRBACAction', '6ce'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/getTenantDB',
                component: ComponentCreator('/abimongo/core/api/functions/getTenantDB', '94b'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/getTenantModel',
                component: ComponentCreator('/abimongo/core/api/functions/getTenantModel', '56c'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/initializeGraphQL',
                component: ComponentCreator('/abimongo/core/api/functions/initializeGraphQL', '193'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/initializeRedis',
                component: ComponentCreator('/abimongo/core/api/functions/initializeRedis', '3a0'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/initMultiTenancy',
                component: ComponentCreator('/abimongo/core/api/functions/initMultiTenancy', '9dd'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/invalidateTenantCache',
                component: ComponentCreator('/abimongo/core/api/functions/invalidateTenantCache', '560'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/isObjectId',
                component: ComponentCreator('/abimongo/core/api/functions/isObjectId', '6bf'),
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
                component: ComponentCreator('/abimongo/core/api/functions/isValidObjectId', '088'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/loadAbimongoConfig',
                component: ComponentCreator('/abimongo/core/api/functions/loadAbimongoConfig', 'f93'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/loadModelsFromPath',
                component: ComponentCreator('/abimongo/core/api/functions/loadModelsFromPath', 'c3f'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/logDefaultEvent',
                component: ComponentCreator('/abimongo/core/api/functions/logDefaultEvent', '8d2'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/logEvent',
                component: ComponentCreator('/abimongo/core/api/functions/logEvent', '169'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/parseDuration',
                component: ComponentCreator('/abimongo/core/api/functions/parseDuration', 'f4b'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/setCachedData',
                component: ComponentCreator('/abimongo/core/api/functions/setCachedData', '1db'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/functions/setLogger',
                component: ComponentCreator('/abimongo/core/api/functions/setLogger', 'a09'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/AbimongoClientConfig',
                component: ComponentCreator('/abimongo/core/api/interfaces/AbimongoClientConfig', '1d4'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/AbimongoClientOptions',
                component: ComponentCreator('/abimongo/core/api/interfaces/AbimongoClientOptions', '72d'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/AbimongoClientType',
                component: ComponentCreator('/abimongo/core/api/interfaces/AbimongoClientType', '3f9'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/AbimongoConfig',
                component: ComponentCreator('/abimongo/core/api/interfaces/AbimongoConfig', '253'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/AbimongoConfigFile',
                component: ComponentCreator('/abimongo/core/api/interfaces/AbimongoConfigFile', '0b2'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/AbimongoGraphQLOptions',
                component: ComponentCreator('/abimongo/core/api/interfaces/AbimongoGraphQLOptions', 'd46'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/AbimongoLoggerSettings',
                component: ComponentCreator('/abimongo/core/api/interfaces/AbimongoLoggerSettings', 'e96'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/AbimongoModelOptions',
                component: ComponentCreator('/abimongo/core/api/interfaces/AbimongoModelOptions', 'a64'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/AbimongoPlugin',
                component: ComponentCreator('/abimongo/core/api/interfaces/AbimongoPlugin', '827'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/ILogger',
                component: ComponentCreator('/abimongo/core/api/interfaces/ILogger', '15c'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/InitMultiTenancyOptions',
                component: ComponentCreator('/abimongo/core/api/interfaces/InitMultiTenancyOptions', '3d3'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/NoOpLogger',
                component: ComponentCreator('/abimongo/core/api/interfaces/NoOpLogger', 'b0a'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/ProjectOptions',
                component: ComponentCreator('/abimongo/core/api/interfaces/ProjectOptions', '2a6'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/interfaces/Relationship',
                component: ComponentCreator('/abimongo/core/api/interfaces/Relationship', '766'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/type-aliases/Document',
                component: ComponentCreator('/abimongo/core/api/type-aliases/Document', 'f7e'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/type-aliases/EventType',
                component: ComponentCreator('/abimongo/core/api/type-aliases/EventType', '3f3'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/type-aliases/GCConfig',
                component: ComponentCreator('/abimongo/core/api/type-aliases/GCConfig', '2ca'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/type-aliases/GetTanantModelParams',
                component: ComponentCreator('/abimongo/core/api/type-aliases/GetTanantModelParams', 'd05'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/type-aliases/HookFunction',
                component: ComponentCreator('/abimongo/core/api/type-aliases/HookFunction', '9a5'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/type-aliases/Permission',
                component: ComponentCreator('/abimongo/core/api/type-aliases/Permission', '85a'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/type-aliases/Role',
                component: ComponentCreator('/abimongo/core/api/type-aliases/Role', 'a76'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/type-aliases/SchemaDefinition',
                component: ComponentCreator('/abimongo/core/api/type-aliases/SchemaDefinition', '92a'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/type-aliases/User',
                component: ComponentCreator('/abimongo/core/api/type-aliases/User', '194'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/abimongo',
                component: ComponentCreator('/abimongo/core/api/variables/abimongo', '842'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/AbimongoModelRegistry',
                component: ComponentCreator('/abimongo/core/api/variables/AbimongoModelRegistry', 'fca'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/abimongoSymbol',
                component: ComponentCreator('/abimongo/core/api/variables/abimongoSymbol', '62e'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/bufferedTransporter',
                component: ComponentCreator('/abimongo/core/api/variables/bufferedTransporter', '93a'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/DB_CHANGE_EVENT',
                component: ComponentCreator('/abimongo/core/api/variables/DB_CHANGE_EVENT', '2e7'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/DOCUMENT_DELETED_EVENT',
                component: ComponentCreator('/abimongo/core/api/variables/DOCUMENT_DELETED_EVENT', 'a7d'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/DOCUMENT_INSERTED_EVENT',
                component: ComponentCreator('/abimongo/core/api/variables/DOCUMENT_INSERTED_EVENT', '230'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/DOCUMENT_UPDATED_EVENT',
                component: ComponentCreator('/abimongo/core/api/variables/DOCUMENT_UPDATED_EVENT', 'f76'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/elasticTransport',
                component: ComponentCreator('/abimongo/core/api/variables/elasticTransport', '1bc'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/eventTypes',
                component: ComponentCreator('/abimongo/core/api/variables/eventTypes', 'af0'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/logger',
                component: ComponentCreator('/abimongo/core/api/variables/logger', 'c44'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/lokiTransport',
                component: ComponentCreator('/abimongo/core/api/variables/lokiTransport', '2ed'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/now',
                component: ComponentCreator('/abimongo/core/api/variables/now', '412'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/objectIdSymbol',
                component: ComponentCreator('/abimongo/core/api/variables/objectIdSymbol', '672'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/redis',
                component: ComponentCreator('/abimongo/core/api/variables/redis', '530'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/rolePermissions',
                component: ComponentCreator('/abimongo/core/api/variables/rolePermissions', 'ac1'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/SchemaType',
                component: ComponentCreator('/abimongo/core/api/variables/SchemaType', 'e21'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/variables/schemaTypeSymbol',
                component: ComponentCreator('/abimongo/core/api/variables/schemaTypeSymbol', '9ca'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/core-concepts/AbimongoClient',
                component: ComponentCreator('/abimongo/core/core-concepts/AbimongoClient', '1c0'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/core-concepts/AbimongoModel',
                component: ComponentCreator('/abimongo/core/core-concepts/AbimongoModel', 'a61'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/core-concepts/AbimongoSchema',
                component: ComponentCreator('/abimongo/core/core-concepts/AbimongoSchema', 'eb9'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/core-concepts/MultiTenancy',
                component: ComponentCreator('/abimongo/core/core-concepts/MultiTenancy', '47b'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/core/log-changes',
                component: ComponentCreator('/abimongo/core/core/log-changes', '4ca'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/faq',
                component: ComponentCreator('/abimongo/core/faq', '14e'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/features/AbimongoGraphQL',
                component: ComponentCreator('/abimongo/core/features/AbimongoGraphQL', '5f9'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/features/Caching',
                component: ComponentCreator('/abimongo/core/features/Caching', '52e'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/features/rbac',
                component: ComponentCreator('/abimongo/core/features/rbac', '323'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/features/redis',
                component: ComponentCreator('/abimongo/core/features/redis', '8a1'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/getting-started/gettting-started',
                component: ComponentCreator('/abimongo/core/getting-started/gettting-started', '31f'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/getting-started/installation',
                component: ComponentCreator('/abimongo/core/getting-started/installation', '63a'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/intro',
                component: ComponentCreator('/abimongo/core/intro', '8cc'),
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
    component: ComponentCreator('/abimongo/create', '6f2'),
    routes: [
      {
        path: '/abimongo/create',
        component: ComponentCreator('/abimongo/create', 'abc'),
        routes: [
          {
            path: '/abimongo/create',
            component: ComponentCreator('/abimongo/create', 'b8f'),
            routes: [
              {
                path: '/abimongo/create/abimongo-cli',
                component: ComponentCreator('/abimongo/create/abimongo-cli', 'b84'),
                exact: true,
                sidebar: "create"
              },
              {
                path: '/abimongo/create/intro',
                component: ComponentCreator('/abimongo/create/intro', 'd5e'),
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
    component: ComponentCreator('/abimongo/logger', 'ce9'),
    routes: [
      {
        path: '/abimongo/logger',
        component: ComponentCreator('/abimongo/logger', '37c'),
        routes: [
          {
            path: '/abimongo/logger',
            component: ComponentCreator('/abimongo/logger', '513'),
            routes: [
              {
                path: '/abimongo/logger/api',
                component: ComponentCreator('/abimongo/logger/api', 'e6e'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/classes/AbimongoLogger',
                component: ComponentCreator('/abimongo/logger/api/classes/AbimongoLogger', 'f96'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/classes/AdvancedRollingFileTransporter',
                component: ComponentCreator('/abimongo/logger/api/classes/AdvancedRollingFileTransporter', 'eee'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/classes/AsyncBatchTransporter',
                component: ComponentCreator('/abimongo/logger/api/classes/AsyncBatchTransporter', '6fe'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/classes/BufferedTransporter',
                component: ComponentCreator('/abimongo/logger/api/classes/BufferedTransporter', '5fe'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/classes/FileTransporter',
                component: ComponentCreator('/abimongo/logger/api/classes/FileTransporter', '183'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/classes/Logger',
                component: ComponentCreator('/abimongo/logger/api/classes/Logger', '930'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/classes/MetricsTracker',
                component: ComponentCreator('/abimongo/logger/api/classes/MetricsTracker', '42e'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/classes/NoOpLogger',
                component: ComponentCreator('/abimongo/logger/api/classes/NoOpLogger', 'ec8'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/clearAllTimers',
                component: ComponentCreator('/abimongo/logger/api/functions/clearAllTimers', 'e92'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/colorByLevel',
                component: ComponentCreator('/abimongo/logger/api/functions/colorByLevel', 'ae3'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/consoleTransport',
                component: ComponentCreator('/abimongo/logger/api/functions/consoleTransport', '5f3'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/createCircuitBreaker',
                component: ComponentCreator('/abimongo/logger/api/functions/createCircuitBreaker', 'b4b'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/createElasticTransport',
                component: ComponentCreator('/abimongo/logger/api/functions/createElasticTransport', '43b'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/createFileTransporter',
                component: ComponentCreator('/abimongo/logger/api/functions/createFileTransporter', '5ea'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/createHttpTransport',
                component: ComponentCreator('/abimongo/logger/api/functions/createHttpTransport', 'f48'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/createLogger',
                component: ComponentCreator('/abimongo/logger/api/functions/createLogger', '60e'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/createLokiTransport',
                component: ComponentCreator('/abimongo/logger/api/functions/createLokiTransport', 'b6e'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/createResilientTransporter',
                component: ComponentCreator('/abimongo/logger/api/functions/createResilientTransporter', 'a08'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/createRotatingFileTransporter',
                component: ComponentCreator('/abimongo/logger/api/functions/createRotatingFileTransporter', 'd98'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/formatConsole',
                component: ComponentCreator('/abimongo/logger/api/functions/formatConsole', '690'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/formatError',
                component: ComponentCreator('/abimongo/logger/api/functions/formatError', '252'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/formatJSON',
                component: ComponentCreator('/abimongo/logger/api/functions/formatJSON', 'c83'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/formatMsg',
                component: ComponentCreator('/abimongo/logger/api/functions/formatMsg', '508'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/getLogLevel',
                component: ComponentCreator('/abimongo/logger/api/functions/getLogLevel', 'a61'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/getLogLevelPriority',
                component: ComponentCreator('/abimongo/logger/api/functions/getLogLevelPriority', 'bff'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/isLogLevel',
                component: ComponentCreator('/abimongo/logger/api/functions/isLogLevel', '8b8'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/now',
                component: ComponentCreator('/abimongo/logger/api/functions/now', '426'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/registerInterval',
                component: ComponentCreator('/abimongo/logger/api/functions/registerInterval', '1f4'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/registerTimeout',
                component: ComponentCreator('/abimongo/logger/api/functions/registerTimeout', '368'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/retryWithBackoff',
                component: ComponentCreator('/abimongo/logger/api/functions/retryWithBackoff', 'ee9'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/setupLogger',
                component: ComponentCreator('/abimongo/logger/api/functions/setupLogger', '0bd'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/functions/shouldLog',
                component: ComponentCreator('/abimongo/logger/api/functions/shouldLog', 'ba5'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/AsyncBatchTransporterOptions',
                component: ComponentCreator('/abimongo/logger/api/interfaces/AsyncBatchTransporterOptions', '7ef'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/FormatOptions',
                component: ComponentCreator('/abimongo/logger/api/interfaces/FormatOptions', '827'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/ILogger',
                component: ComponentCreator('/abimongo/logger/api/interfaces/ILogger', 'ad2'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/LogEntry',
                component: ComponentCreator('/abimongo/logger/api/interfaces/LogEntry', '5a3'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/LoggerConfig',
                component: ComponentCreator('/abimongo/logger/api/interfaces/LoggerConfig', '67d'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/LoggerFormatOptions',
                component: ComponentCreator('/abimongo/logger/api/interfaces/LoggerFormatOptions', 'e51'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/LoggerHooks',
                component: ComponentCreator('/abimongo/logger/api/interfaces/LoggerHooks', '492'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/LoggerTransporter',
                component: ComponentCreator('/abimongo/logger/api/interfaces/LoggerTransporter', 'f32'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/LogMeta',
                component: ComponentCreator('/abimongo/logger/api/interfaces/LogMeta', '7bc'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/LogTransport',
                component: ComponentCreator('/abimongo/logger/api/interfaces/LogTransport', '08d'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/MetricsSnapshot',
                component: ComponentCreator('/abimongo/logger/api/interfaces/MetricsSnapshot', '365'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/RotatingFileTransporterOptions',
                component: ComponentCreator('/abimongo/logger/api/interfaces/RotatingFileTransporterOptions', 'caa'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/interfaces/Transporter',
                component: ComponentCreator('/abimongo/logger/api/interfaces/Transporter', '622'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/type-aliases/AbimongoConfig',
                component: ComponentCreator('/abimongo/logger/api/type-aliases/AbimongoConfig', 'afc'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/type-aliases/LogLevel',
                component: ComponentCreator('/abimongo/logger/api/type-aliases/LogLevel', '4ce'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/type-aliases/RemoteTransporter',
                component: ComponentCreator('/abimongo/logger/api/type-aliases/RemoteTransporter', 'ecf'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/variables/DefaultLogger',
                component: ComponentCreator('/abimongo/logger/api/variables/DefaultLogger', 'b16'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/variables/LOG_LEVELS',
                component: ComponentCreator('/abimongo/logger/api/variables/LOG_LEVELS', '910'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/variables/logger',
                component: ComponentCreator('/abimongo/logger/api/variables/logger', 'ded'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/faq',
                component: ComponentCreator('/abimongo/logger/faq', 'ba6'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/intro',
                component: ComponentCreator('/abimongo/logger/intro', '915'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/logger/consumption',
                component: ComponentCreator('/abimongo/logger/logger/consumption', '660'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/logger/getting-started',
                component: ComponentCreator('/abimongo/logger/logger/getting-started', '2f5'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/logger/logger-guides',
                component: ComponentCreator('/abimongo/logger/logger/logger-guides', '220'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/logger/transports',
                component: ComponentCreator('/abimongo/logger/logger/transports', '714'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/metrics-tracer',
                component: ComponentCreator('/abimongo/logger/metrics-tracer', '0f2'),
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
    component: ComponentCreator('/abimongo/tutorials', '097'),
    routes: [
      {
        path: '/abimongo/tutorials',
        component: ComponentCreator('/abimongo/tutorials', '1cc'),
        routes: [
          {
            path: '/abimongo/tutorials',
            component: ComponentCreator('/abimongo/tutorials', '5a7'),
            routes: [
              {
                path: '/abimongo/tutorials/core_tutotrials/abimongo-express',
                component: ComponentCreator('/abimongo/tutorials/core_tutotrials/abimongo-express', '6db'),
                exact: true,
                sidebar: "tutorials"
              },
              {
                path: '/abimongo/tutorials/core_tutotrials/abimongo-graphql',
                component: ComponentCreator('/abimongo/tutorials/core_tutotrials/abimongo-graphql', 'a14'),
                exact: true,
                sidebar: "tutorials"
              },
              {
                path: '/abimongo/tutorials/core_tutotrials/abimongo-multitenancy',
                component: ComponentCreator('/abimongo/tutorials/core_tutotrials/abimongo-multitenancy', '33e'),
                exact: true,
                sidebar: "tutorials"
              },
              {
                path: '/abimongo/tutorials/core_tutotrials/core-tutorials',
                component: ComponentCreator('/abimongo/tutorials/core_tutotrials/core-tutorials', '77a'),
                exact: true,
                sidebar: "tutorials"
              },
              {
                path: '/abimongo/tutorials/intro',
                component: ComponentCreator('/abimongo/tutorials/intro', '3dd'),
                exact: true,
                sidebar: "tutorials"
              },
              {
                path: '/abimongo/tutorials/logger-tutorials',
                component: ComponentCreator('/abimongo/tutorials/logger-tutorials', '6e5'),
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
