import { Thread } from './types';

export function xmlEvent(type: string, payload: string): string {
  return `<${type}>\n${payload}\n</${type}>`;
}

export function stringifyValue(value: unknown): string {
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function threadToXml(thread: Thread): string {
  return thread.events
    .map(e => xmlEvent(e.type, stringifyValue(e.data)))
    .join('\n\n');
}



