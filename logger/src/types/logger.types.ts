export interface ILogger {
  debug(message: string, ...meta: any[]): void;
  info(message: string, ...meta: any[]): void;
  warn(message: string, ...meta: any[]): void;
  error(message: string, ...meta: any[]): void;
  trace(message: string, ...meta: any[]): void;
}


export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'trace';

export interface Transporter {
  write(message: string, level?: LogLevel, meta?: any[]): Promise<void>;
  flush?(): Promise<void>;
  close?(): void;
}

export interface LoggerTransporter {
  write(message: string): Promise<void>;
}

export type RemoteTransporter =
  (formattedMessage: string, meta: LogEntry) => Promise<void>;

export interface LogMeta {
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta: LogMeta;
};

export interface LogTransport {
  log: (level: LogLevel, message: string, meta?: LogMeta) => void;
}

export interface LoggerFormatOptions {
  timestamp?: boolean | (() => string); // true = ISO, function = custom
  colorize?: boolean;
  source?: string;
  json?: boolean;
  prefix?: string;
}

export interface AsyncBatchTransporterOptions {
  batchSize?: number;
  flushInterval?: number;
  sendBatch: (entries: LogEntry[]) => Promise<void>;
}

export interface LoggerHooks {
  onLog?: (entry: LogEntry) => void;
  onFlush?: (batch: LogEntry[]) => void;
  onError?: (error: any, entry?: LogEntry | LogEntry[]) => void;
}

export interface FormatOptions {
  colorize?: boolean;
  format?: 'json' | 'text';
}
