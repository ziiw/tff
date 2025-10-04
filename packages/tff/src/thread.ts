import { Event, JsonObject, Thread } from './types';

export function createThread(id: string): Thread {
  return { id, events: [], cursor: 0 };
}

export function appendEvent(thread: Thread, event: Omit<Event, 'id' | 'ts'> & Partial<Pick<Event, 'id' | 'ts'>>): Thread {
  const e: Event = {
    id: event.id ?? cryptoRandomId(),
    ts: event.ts ?? new Date().toISOString(),
    type: event.type,
    data: event.data,
    meta: event.meta,
  };
  return {
    ...thread,
    events: [...thread.events, e],
    cursor: (thread.cursor ?? 0) + 1,
  };
}

export function formatError(err: unknown): JsonObject {
  if (err && typeof err === 'object') {
    const anyErr = err as any;
    return {
      name: anyErr.name ?? 'Error',
      message: anyErr.message ?? String(err),
      stack: anyErr.stack,
    };
  }
  return { name: 'Error', message: String(err) };
}

export function cryptoRandomId(): string {
  // Prefer crypto if available; fallback to Math.random-based UUID-ish
  try {
    // @ts-ignore
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}



