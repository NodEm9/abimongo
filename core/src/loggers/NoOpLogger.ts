import { ILogger } from "./ILogger";

export class NoOpLogger implements ILogger {
  debug() {}
  info() {}
  warn() {}
  error() {}
  trace() {}
}
