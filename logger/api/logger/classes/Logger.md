# Class: Logger

Defined in: [logger/setupLogger.ts:31](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/logger/src/logger/setupLogger.ts#L31)

Logger class that provides a singleton instance of the logger.
It can be initialized with a configuration object.
Usage:
```typescript
import { Logger } from 'abimongo-logger';
Logger.initialize(YourLoggerConfig);

## Constructors

### Constructor

> **new Logger**(): `Logger`

Defined in: [logger/setupLogger.ts:36](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/logger/src/logger/setupLogger.ts#L36)

#### Returns

`Logger`

## Properties

### instance

> `static` **instance**: [`ILogger`](../interfaces/ILogger.md)

Defined in: [logger/setupLogger.ts:33](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/logger/src/logger/setupLogger.ts#L33)

## Methods

### initialize()

> `static` **initialize**(`config`): [`ILogger`](../interfaces/ILogger.md)

Defined in: [logger/setupLogger.ts:44](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/logger/src/logger/setupLogger.ts#L44)

#### Parameters

##### config

[`LoggerConfig`](../interfaces/LoggerConfig.md)

#### Returns

[`ILogger`](../interfaces/ILogger.md)
