import { JsonObject } from './types';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export function consoleLogger(level: LogLevel, message: string, meta?: JsonObject) {
  const line = `[TFF] ${new Date().toISOString()} ${level.toUpperCase()} ${message}`;
  if (level === 'error') {
    console.error(line, meta ?? '');
  } else if (level === 'warn') {
    console.warn(line, meta ?? '');
  } else if (level === 'info') {
    console.info(line, meta ?? '');
  } else {
    console.debug(line, meta ?? '');
  }
}



