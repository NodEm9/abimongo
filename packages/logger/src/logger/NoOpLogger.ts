// logger/NoOpLogger.ts
import { ILogger } from '../types';

export class NoOpLogger implements ILogger {
  debug() { }
  info() { }
  warn() { }
  error() { }
  trace() { }
}
