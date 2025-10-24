**@abimongo/logger**

***

# @abimongo/logger

## Classes

- [AdvancedRollingFileTransporter](./logger/classes/AdvancedRollingFileTransporter.md)
- [AsyncBatchTransporter](./logger/classes/AsyncBatchTransporter.md)
- [BufferedTransporter](./logger/classes/BufferedTransporter.md)
- [FileTransporter](./logger/classes/FileTransporter.md)
- [Logger](./logger/classes/Logger.md)
- [MetricsTracker](./logger/classes/MetricsTracker.md)
- [NoOpLogger](./logger/classes/NoOpLogger.md)

## Interfaces

- [AsyncBatchTransporterOptions](./logger/interfaces/AsyncBatchTransporterOptions.md)
- [FormatOptions](./logger/interfaces/FormatOptions.md)
- [ILogger](./logger/interfaces/ILogger.md)
- [LogEntry](./logger/interfaces/LogEntry.md)
- [LoggerConfig](./logger/interfaces/LoggerConfig.md)
- [LoggerFormatOptions](./logger/interfaces/LoggerFormatOptions.md)
- [LoggerHooks](./logger/interfaces/LoggerHooks.md)
- [LoggerTransporter](./logger/interfaces/LoggerTransporter.md)
- [LogMeta](./logger/interfaces/LogMeta.md)
- [LogTransport](./logger/interfaces/LogTransport.md)
- [MetricsSnapshot](./logger/interfaces/MetricsSnapshot.md)
- [RotatingFileTransporterOptions](./logger/interfaces/RotatingFileTransporterOptions.md)
- [Transporter](./logger/interfaces/Transporter.md)

## Type Aliases

- [AbimongoConfig](./logger/type-aliases/AbimongoConfig.md)
- [LogLevel](./logger/type-aliases/LogLevel.md)
- [RemoteTransporter](./logger/type-aliases/RemoteTransporter.md)

## Variables

- [DefaultLogger](./logger/variables/DefaultLogger.md)
- [LOG\_LEVELS](./logger/variables/LOG_LEVELS.md)
- [logger](./logger/variables/logger.md)

## Functions

- [clearAllTimers](./logger/functions/clearAllTimers.md)
- [colorByLevel](./logger/functions/colorByLevel.md)
- [consoleTransport](./logger/functions/consoleTransport.md)
- [createCircuitBreaker](./logger/functions/createCircuitBreaker.md)
- [createElasticTransport](./logger/functions/createElasticTransport.md)
- [createFileTransporter](./logger/functions/createFileTransporter.md)
- [createHttpTransport](./logger/functions/createHttpTransport.md)
- [createLogger](./logger/functions/createLogger.md)
- [createLokiTransport](./logger/functions/createLokiTransport.md)
- [createResilientTransporter](./logger/functions/createResilientTransporter.md)
- [createRotatingFileTransporter](./logger/functions/createRotatingFileTransporter.md)
- [formatConsole](./logger/functions/formatConsole.md)
- [formatError](./logger/functions/formatError.md)
- [formatJSON](./logger/functions/formatJSON.md)
- [formatMsg](./logger/functions/formatMsg.md)
- [getLogLevel](./logger/functions/getLogLevel.md)
- [getLogLevelPriority](./logger/functions/getLogLevelPriority.md)
- [isLogLevel](./logger/functions/isLogLevel.md)
- [now](./logger/functions/now.md)
- [registerInterval](./logger/functions/registerInterval.md)
- [registerTimeout](./logger/functions/registerTimeout.md)
- [retryWithBackoff](./logger/functions/retryWithBackoff.md)
- [setupLogger](./logger/functions/setupLogger.md)
- [shouldLog](./logger/functions/shouldLog.md)

## References

### shutdownLogger

Renames and re-exports [clearAllTimers](./logger/functions/clearAllTimers.md)
