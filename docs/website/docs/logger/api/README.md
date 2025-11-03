**@abimongo/logger**

***

# @abimongo/logger

- The main entry point for the Logger package. 
Defines and exports the core Logger functionality, transports, and utilities.

## Classes

- [AbimongoLogger](classes/AbimongoLogger.md)
- [AdvancedRollingFileTransporter](classes/AdvancedRollingFileTransporter.md)
- [AsyncBatchTransporter](classes/AsyncBatchTransporter.md)
- [BufferedTransporter](classes/BufferedTransporter.md)
- [FileTransporter](classes/FileTransporter.md)
- [Logger](classes/Logger.md)
- [MetricsTracker](classes/MetricsTracker.md)
- [NoOpLogger](classes/NoOpLogger.md)

## Interfaces

- [AsyncBatchTransporterOptions](interfaces/AsyncBatchTransporterOptions.md)
- [FormatOptions](interfaces/FormatOptions.md)
- [ILogger](interfaces/ILogger.md)
- [LogEntry](interfaces/LogEntry.md)
- [LoggerConfig](interfaces/LoggerConfig.md)
- [LoggerFormatOptions](interfaces/LoggerFormatOptions.md)
- [LoggerHooks](interfaces/LoggerHooks.md)
- [LoggerTransporter](interfaces/LoggerTransporter.md)
- [LogMeta](interfaces/LogMeta.md)
- [LogTransport](interfaces/LogTransport.md)
- [MetricsSnapshot](interfaces/MetricsSnapshot.md)
- [RotatingFileTransporterOptions](interfaces/RotatingFileTransporterOptions.md)
- [Transporter](interfaces/Transporter.md)

## Type Aliases

- [AbimongoConfig](type-aliases/AbimongoConfig.md)
- [LogLevel](type-aliases/LogLevel.md)
- [RemoteTransporter](type-aliases/RemoteTransporter.md)

## Variables

- [DefaultLogger](variables/DefaultLogger.md)
- [LOG\_LEVELS](variables/LOG_LEVELS.md)
- [logger](variables/logger.md)

## Functions

- [clearAllTimers](functions/clearAllTimers.md)
- [colorByLevel](functions/colorByLevel.md)
- [colorize](functions/colorize.md)
- [consoleTransport](functions/consoleTransport.md)
- [createCircuitBreaker](functions/createCircuitBreaker.md)
- [createElasticTransport](functions/createElasticTransport.md)
- [createFileTransporter](functions/createFileTransporter.md)
- [createHttpTransport](functions/createHttpTransport.md)
- [createLogger](functions/createLogger.md)
- [createLokiTransport](functions/createLokiTransport.md)
- [createResilientTransporter](functions/createResilientTransporter.md)
- [createRotatingFileTransporter](functions/createRotatingFileTransporter.md)
- [formatConsole](functions/formatConsole.md)
- [formatError](functions/formatError.md)
- [formatJSON](functions/formatJSON.md)
- [formatMsg](functions/formatMsg.md)
- [getLogLevel](functions/getLogLevel.md)
- [getLogLevelPriority](functions/getLogLevelPriority.md)
- [isLogLevel](functions/isLogLevel.md)
- [now](functions/now.md)
- [registerInterval](functions/registerInterval.md)
- [registerTimeout](functions/registerTimeout.md)
- [retryWithBackoff](functions/retryWithBackoff.md)
- [setupLogger](functions/setupLogger.md)
- [shouldLog](functions/shouldLog.md)

## References

### loggerMetricsTracker

Renames and re-exports [MetricsTracker](classes/MetricsTracker.md)

***

### shutdownLogger

Renames and re-exports [clearAllTimers](functions/clearAllTimers.md)
