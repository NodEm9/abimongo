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
    component: ComponentCreator('/abimongo/core', '4c9'),
    routes: [
      {
        path: '/abimongo/core',
        component: ComponentCreator('/abimongo/core', '990'),
        routes: [
          {
            path: '/abimongo/core',
            component: ComponentCreator('/abimongo/core', 'c53'),
            routes: [
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
                path: '/abimongo/core/api/core',
                component: ComponentCreator('/abimongo/core/api/core', '922'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/classes/Abimongo',
                component: ComponentCreator('/abimongo/core/api/core/classes/Abimongo', 'd32'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/classes/AbimongoBootstrap',
                component: ComponentCreator('/abimongo/core/api/core/classes/AbimongoBootstrap', '380'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/classes/AbimongoBootstrapFactory',
                component: ComponentCreator('/abimongo/core/api/core/classes/AbimongoBootstrapFactory', '336'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/classes/AbimongoClient',
                component: ComponentCreator('/abimongo/core/api/core/classes/AbimongoClient', 'b15'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/classes/AbimongoGC',
                component: ComponentCreator('/abimongo/core/api/core/classes/AbimongoGC', 'fab'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/classes/AbimongoGraphQL',
                component: ComponentCreator('/abimongo/core/api/core/classes/AbimongoGraphQL', '70e'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/classes/AbimongoModel',
                component: ComponentCreator('/abimongo/core/api/core/classes/AbimongoModel', '928'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/classes/AbimongoSchema',
                component: ComponentCreator('/abimongo/core/api/core/classes/AbimongoSchema', '21b'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/classes/AuthService',
                component: ComponentCreator('/abimongo/core/api/core/classes/AuthService', '368'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/classes/MultiTenantManager',
                component: ComponentCreator('/abimongo/core/api/core/classes/MultiTenantManager', '9bf'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/classes/RedisService',
                component: ComponentCreator('/abimongo/core/api/core/classes/RedisService', '722'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/classes/Schema',
                component: ComponentCreator('/abimongo/core/api/core/classes/Schema', '6b5'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/classes/TenantContext',
                component: ComponentCreator('/abimongo/core/api/core/classes/TenantContext', '380'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/enumerations/ErrorType',
                component: ComponentCreator('/abimongo/core/api/core/enumerations/ErrorType', 'fb0'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/AbiMongoError',
                component: ComponentCreator('/abimongo/core/api/core/functions/AbiMongoError', 'c7f'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/applyMultiTenancy',
                component: ComponentCreator('/abimongo/core/api/core/functions/applyMultiTenancy', '726'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/authorize',
                component: ComponentCreator('/abimongo/core/api/core/functions/authorize', '3eb'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/cacheWithRedis',
                component: ComponentCreator('/abimongo/core/api/core/functions/cacheWithRedis', 'e5f'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/castId',
                component: ComponentCreator('/abimongo/core/api/core/functions/castId', 'ed9'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/checkPermission',
                component: ComponentCreator('/abimongo/core/api/core/functions/checkPermission', '36e'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/connectRedis',
                component: ComponentCreator('/abimongo/core/api/core/functions/connectRedis', 'fd1'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/createModel',
                component: ComponentCreator('/abimongo/core/api/core/functions/createModel', 'eff'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/createSchema',
                component: ComponentCreator('/abimongo/core/api/core/functions/createSchema', '53f'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/describeEvent',
                component: ComponentCreator('/abimongo/core/api/core/functions/describeEvent', '9ff'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/enforceRBAC',
                component: ComponentCreator('/abimongo/core/api/core/functions/enforceRBAC', 'e30'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/ensureModelNameSafe',
                component: ComponentCreator('/abimongo/core/api/core/functions/ensureModelNameSafe', '178'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/foldersAndFiles',
                component: ComponentCreator('/abimongo/core/api/core/functions/foldersAndFiles', 'dbb'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/formatDuration',
                component: ComponentCreator('/abimongo/core/api/core/functions/formatDuration', 'deb'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/GCSettings',
                component: ComponentCreator('/abimongo/core/api/core/functions/GCSettings', 'fd0'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/generateProject',
                component: ComponentCreator('/abimongo/core/api/core/functions/generateProject', '515'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/generateProjectWithConfig',
                component: ComponentCreator('/abimongo/core/api/core/functions/generateProjectWithConfig', 'b39'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/getCachedData',
                component: ComponentCreator('/abimongo/core/api/core/functions/getCachedData', 'ba7'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/getEventOptions',
                component: ComponentCreator('/abimongo/core/api/core/functions/getEventOptions', '85b'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/getEventType',
                component: ComponentCreator('/abimongo/core/api/core/functions/getEventType', '70f'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/getModelFilesFromPath',
                component: ComponentCreator('/abimongo/core/api/core/functions/getModelFilesFromPath', 'f48'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/getOriginalResolver',
                component: ComponentCreator('/abimongo/core/api/core/functions/getOriginalResolver', '03c'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/getRBACAction',
                component: ComponentCreator('/abimongo/core/api/core/functions/getRBACAction', 'e7c'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/getTenantDB',
                component: ComponentCreator('/abimongo/core/api/core/functions/getTenantDB', '09c'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/getTenantModel',
                component: ComponentCreator('/abimongo/core/api/core/functions/getTenantModel', '729'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/initializeGraphQL',
                component: ComponentCreator('/abimongo/core/api/core/functions/initializeGraphQL', 'ca9'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/initializeRedis',
                component: ComponentCreator('/abimongo/core/api/core/functions/initializeRedis', 'ba0'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/initMultiTenancy',
                component: ComponentCreator('/abimongo/core/api/core/functions/initMultiTenancy', '5ec'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/invalidateTenantCache',
                component: ComponentCreator('/abimongo/core/api/core/functions/invalidateTenantCache', '86b'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/isObjectId',
                component: ComponentCreator('/abimongo/core/api/core/functions/isObjectId', 'd50'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/isValidDuration',
                component: ComponentCreator('/abimongo/core/api/core/functions/isValidDuration', '29e'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/isValidObjectId',
                component: ComponentCreator('/abimongo/core/api/core/functions/isValidObjectId', 'd25'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/loadAbimongoConfig',
                component: ComponentCreator('/abimongo/core/api/core/functions/loadAbimongoConfig', '750'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/loadModelsFromPath',
                component: ComponentCreator('/abimongo/core/api/core/functions/loadModelsFromPath', 'ad0'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/logDefaultEvent',
                component: ComponentCreator('/abimongo/core/api/core/functions/logDefaultEvent', '953'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/logEvent',
                component: ComponentCreator('/abimongo/core/api/core/functions/logEvent', 'a34'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/parseDuration',
                component: ComponentCreator('/abimongo/core/api/core/functions/parseDuration', 'cec'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/functions/setCachedData',
                component: ComponentCreator('/abimongo/core/api/core/functions/setCachedData', '02d'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/interfaces/AbimongoClientConfig',
                component: ComponentCreator('/abimongo/core/api/core/interfaces/AbimongoClientConfig', '9e6'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/interfaces/AbimongoClientOptions',
                component: ComponentCreator('/abimongo/core/api/core/interfaces/AbimongoClientOptions', 'd0c'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/interfaces/AbimongoClientType',
                component: ComponentCreator('/abimongo/core/api/core/interfaces/AbimongoClientType', 'bdf'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/interfaces/AbimongoConfig',
                component: ComponentCreator('/abimongo/core/api/core/interfaces/AbimongoConfig', '178'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/interfaces/AbimongoConfigFile',
                component: ComponentCreator('/abimongo/core/api/core/interfaces/AbimongoConfigFile', 'c42'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/interfaces/AbimongoGraphQLOptions',
                component: ComponentCreator('/abimongo/core/api/core/interfaces/AbimongoGraphQLOptions', 'f93'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/interfaces/AbimongoModelOptions',
                component: ComponentCreator('/abimongo/core/api/core/interfaces/AbimongoModelOptions', 'adc'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/interfaces/AbimongoPlugin',
                component: ComponentCreator('/abimongo/core/api/core/interfaces/AbimongoPlugin', '54e'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/interfaces/ILogger',
                component: ComponentCreator('/abimongo/core/api/core/interfaces/ILogger', '370'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/interfaces/InitMultiTenancyOptions',
                component: ComponentCreator('/abimongo/core/api/core/interfaces/InitMultiTenancyOptions', '8dd'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/interfaces/NoOpLogger',
                component: ComponentCreator('/abimongo/core/api/core/interfaces/NoOpLogger', '123'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/interfaces/ProjectOptions',
                component: ComponentCreator('/abimongo/core/api/core/interfaces/ProjectOptions', '3f9'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/interfaces/Relationship',
                component: ComponentCreator('/abimongo/core/api/core/interfaces/Relationship', 'e52'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/type-aliases/Document',
                component: ComponentCreator('/abimongo/core/api/core/type-aliases/Document', 'a79'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/type-aliases/EventType',
                component: ComponentCreator('/abimongo/core/api/core/type-aliases/EventType', 'd0b'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/type-aliases/GCConfig',
                component: ComponentCreator('/abimongo/core/api/core/type-aliases/GCConfig', '47b'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/type-aliases/GetTanantModelParams',
                component: ComponentCreator('/abimongo/core/api/core/type-aliases/GetTanantModelParams', 'b49'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/type-aliases/HookFunction',
                component: ComponentCreator('/abimongo/core/api/core/type-aliases/HookFunction', 'f07'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/type-aliases/Permission',
                component: ComponentCreator('/abimongo/core/api/core/type-aliases/Permission', '943'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/type-aliases/Role',
                component: ComponentCreator('/abimongo/core/api/core/type-aliases/Role', '467'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/type-aliases/SchemaDefinition',
                component: ComponentCreator('/abimongo/core/api/core/type-aliases/SchemaDefinition', 'f35'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/type-aliases/User',
                component: ComponentCreator('/abimongo/core/api/core/type-aliases/User', '963'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/variables/abimongo',
                component: ComponentCreator('/abimongo/core/api/core/variables/abimongo', '222'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/variables/AbimongoModelRegistry',
                component: ComponentCreator('/abimongo/core/api/core/variables/AbimongoModelRegistry', '854'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/variables/abimongoSymbol',
                component: ComponentCreator('/abimongo/core/api/core/variables/abimongoSymbol', 'de5'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/variables/DB_CHANGE_EVENT',
                component: ComponentCreator('/abimongo/core/api/core/variables/DB_CHANGE_EVENT', '898'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/variables/DOCUMENT_DELETED_EVENT',
                component: ComponentCreator('/abimongo/core/api/core/variables/DOCUMENT_DELETED_EVENT', '89b'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/variables/DOCUMENT_INSERTED_EVENT',
                component: ComponentCreator('/abimongo/core/api/core/variables/DOCUMENT_INSERTED_EVENT', 'a64'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/variables/DOCUMENT_UPDATED_EVENT',
                component: ComponentCreator('/abimongo/core/api/core/variables/DOCUMENT_UPDATED_EVENT', '82c'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/variables/eventTypes',
                component: ComponentCreator('/abimongo/core/api/core/variables/eventTypes', 'afe'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/variables/now',
                component: ComponentCreator('/abimongo/core/api/core/variables/now', '083'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/variables/objectIdSymbol',
                component: ComponentCreator('/abimongo/core/api/core/variables/objectIdSymbol', 'c9c'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/variables/redis',
                component: ComponentCreator('/abimongo/core/api/core/variables/redis', 'efb'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/variables/rolePermissions',
                component: ComponentCreator('/abimongo/core/api/core/variables/rolePermissions', '0f7'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/variables/SchemaType',
                component: ComponentCreator('/abimongo/core/api/core/variables/SchemaType', 'fbb'),
                exact: true,
                sidebar: "core"
              },
              {
                path: '/abimongo/core/api/core/variables/schemaTypeSymbol',
                component: ComponentCreator('/abimongo/core/api/core/variables/schemaTypeSymbol', 'ca1'),
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
    component: ComponentCreator('/abimongo/create', '03a'),
    routes: [
      {
        path: '/abimongo/create',
        component: ComponentCreator('/abimongo/create', 'f6f'),
        routes: [
          {
            path: '/abimongo/create',
            component: ComponentCreator('/abimongo/create', 'd31'),
            routes: [
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
    component: ComponentCreator('/abimongo/logger', '314'),
    routes: [
      {
        path: '/abimongo/logger',
        component: ComponentCreator('/abimongo/logger', 'e3c'),
        routes: [
          {
            path: '/abimongo/logger',
            component: ComponentCreator('/abimongo/logger', 'c5a'),
            routes: [
              {
                path: '/abimongo/logger/api',
                component: ComponentCreator('/abimongo/logger/api', 'e6e'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger',
                component: ComponentCreator('/abimongo/logger/api/logger', 'ec6'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/classes/AdvancedRollingFileTransporter',
                component: ComponentCreator('/abimongo/logger/api/logger/classes/AdvancedRollingFileTransporter', '84f'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/classes/AsyncBatchTransporter',
                component: ComponentCreator('/abimongo/logger/api/logger/classes/AsyncBatchTransporter', 'dad'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/classes/BufferedTransporter',
                component: ComponentCreator('/abimongo/logger/api/logger/classes/BufferedTransporter', '41a'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/classes/FileTransporter',
                component: ComponentCreator('/abimongo/logger/api/logger/classes/FileTransporter', 'd7f'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/classes/Logger',
                component: ComponentCreator('/abimongo/logger/api/logger/classes/Logger', '4aa'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/classes/MetricsTracker',
                component: ComponentCreator('/abimongo/logger/api/logger/classes/MetricsTracker', 'd50'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/classes/NoOpLogger',
                component: ComponentCreator('/abimongo/logger/api/logger/classes/NoOpLogger', 'a0f'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/clearAllTimers',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/clearAllTimers', 'a41'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/colorByLevel',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/colorByLevel', '357'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/consoleTransport',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/consoleTransport', 'dcf'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/createCircuitBreaker',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/createCircuitBreaker', '72e'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/createElasticTransport',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/createElasticTransport', '957'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/createFileTransporter',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/createFileTransporter', '066'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/createHttpTransport',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/createHttpTransport', 'bb0'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/createLogger',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/createLogger', '3ac'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/createLokiTransport',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/createLokiTransport', 'ec4'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/createResilientTransporter',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/createResilientTransporter', 'c57'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/createRotatingFileTransporter',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/createRotatingFileTransporter', 'fe8'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/formatConsole',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/formatConsole', 'd5f'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/formatError',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/formatError', '747'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/formatJSON',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/formatJSON', '580'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/formatMsg',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/formatMsg', '628'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/getLogLevel',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/getLogLevel', '76d'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/getLogLevelPriority',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/getLogLevelPriority', '79d'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/isLogLevel',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/isLogLevel', '061'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/now',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/now', '7c1'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/registerInterval',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/registerInterval', '643'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/registerTimeout',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/registerTimeout', '093'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/retryWithBackoff',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/retryWithBackoff', '532'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/setupLogger',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/setupLogger', '6d7'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/functions/shouldLog',
                component: ComponentCreator('/abimongo/logger/api/logger/functions/shouldLog', '658'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/interfaces/AsyncBatchTransporterOptions',
                component: ComponentCreator('/abimongo/logger/api/logger/interfaces/AsyncBatchTransporterOptions', '3be'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/interfaces/FormatOptions',
                component: ComponentCreator('/abimongo/logger/api/logger/interfaces/FormatOptions', '9b0'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/interfaces/ILogger',
                component: ComponentCreator('/abimongo/logger/api/logger/interfaces/ILogger', 'a73'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/interfaces/LogEntry',
                component: ComponentCreator('/abimongo/logger/api/logger/interfaces/LogEntry', '8a9'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/interfaces/LoggerConfig',
                component: ComponentCreator('/abimongo/logger/api/logger/interfaces/LoggerConfig', '2f3'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/interfaces/LoggerFormatOptions',
                component: ComponentCreator('/abimongo/logger/api/logger/interfaces/LoggerFormatOptions', 'e45'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/interfaces/LoggerHooks',
                component: ComponentCreator('/abimongo/logger/api/logger/interfaces/LoggerHooks', '319'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/interfaces/LoggerTransporter',
                component: ComponentCreator('/abimongo/logger/api/logger/interfaces/LoggerTransporter', '127'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/interfaces/LogMeta',
                component: ComponentCreator('/abimongo/logger/api/logger/interfaces/LogMeta', '1cb'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/interfaces/LogTransport',
                component: ComponentCreator('/abimongo/logger/api/logger/interfaces/LogTransport', 'cbd'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/interfaces/MetricsSnapshot',
                component: ComponentCreator('/abimongo/logger/api/logger/interfaces/MetricsSnapshot', 'c00'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/interfaces/RotatingFileTransporterOptions',
                component: ComponentCreator('/abimongo/logger/api/logger/interfaces/RotatingFileTransporterOptions', '330'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/interfaces/Transporter',
                component: ComponentCreator('/abimongo/logger/api/logger/interfaces/Transporter', '2b7'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/type-aliases/AbimongoConfig',
                component: ComponentCreator('/abimongo/logger/api/logger/type-aliases/AbimongoConfig', '33a'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/type-aliases/LogLevel',
                component: ComponentCreator('/abimongo/logger/api/logger/type-aliases/LogLevel', 'b7c'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/type-aliases/RemoteTransporter',
                component: ComponentCreator('/abimongo/logger/api/logger/type-aliases/RemoteTransporter', '75d'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/variables/DefaultLogger',
                component: ComponentCreator('/abimongo/logger/api/logger/variables/DefaultLogger', '07c'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/variables/LOG_LEVELS',
                component: ComponentCreator('/abimongo/logger/api/logger/variables/LOG_LEVELS', 'f47'),
                exact: true,
                sidebar: "logger"
              },
              {
                path: '/abimongo/logger/api/logger/variables/logger',
                component: ComponentCreator('/abimongo/logger/api/logger/variables/logger', '03b'),
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
    path: '/abimongo/',
    component: ComponentCreator('/abimongo/', '3bc'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
