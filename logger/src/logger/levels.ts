import { LogLevel } from "../types";

export const LOG_LEVELS: Record<LogLevel, number> = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5
};


export function shouldLog(level: keyof typeof LOG_LEVELS, configLevel: keyof typeof LOG_LEVELS): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[configLevel];
}

export const getLogLevel = (level: LogLevel): LogLevel => {
  return level;
};

export const isLogLevel = (level: string): level is LogLevel => {
  return level in LOG_LEVELS;
};

export const getLogLevelPriority = (level: LogLevel): number => {
  return LOG_LEVELS[level];
};