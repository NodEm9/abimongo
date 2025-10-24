# Class: Logger

Defined in: logger/setupLogger.ts:31

Logger class that provides a singleton instance of the logger.
It can be initialized with a configuration object.
Usage:

```typescript
import { Logger } from 'abimongo-logger';
Logger.initialize(YourLoggerConfig);

## Constructors

### Constructor

> **new Logger**(): `Logger`

Defined in: logger/setupLogger.ts:35

#### Returns

`Logger`

## Properties

### instance

> `static` **instance**: [`ILogger`](../interfaces/ILogger.md)

Defined in: logger/setupLogger.ts:33

## Methods

### initialize()

> `static` **initialize**(`config`): [`ILogger`](../interfaces/ILogger.md)

Defined in: logger/setupLogger.ts:43

#### Parameters

##### config

[`LoggerConfig`](../interfaces/LoggerConfig.md)

#### Returns

[`ILogger`](../interfaces/ILogger.md)
