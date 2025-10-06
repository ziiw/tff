import { JsonObject, Event } from './types';

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

// Enhanced logging system for multi-agent events
export interface LoggingConfig {
  level?: LogLevel;
  suppressStreaming?: boolean;
  suppressSubAgentEvents?: boolean;
  customFormatters?: Record<string, (event: Event) => string | null>;
}

export class AgentLogger {
  private config: LoggingConfig;

  constructor(config: LoggingConfig = {}) {
    this.config = {
      level: 'info',
      suppressStreaming: true,
      suppressSubAgentEvents: false,
      customFormatters: {},
      ...config,
    };
  }

  log(event: Event): void {
    // Suppress streaming chunks if configured
    if (this.config.suppressStreaming && event.type === 'llm_stream_chunk') {
      return;
    }

    // Suppress sub-agent events if configured
    if (this.config.suppressSubAgentEvents && event.meta?.subAgent) {
      return;
    }

    // Check custom formatters first
    if (this.config.customFormatters?.[event.type]) {
      const formatted = this.config.customFormatters[event.type](event);
      if (formatted) {
        console.log(formatted);
        return;
      }
    }

    // Default formatting based on event type
    const formatted = this.formatEvent(event);
    if (formatted) {
      console.log(formatted);
    }
  }

  protected formatEvent(event: Event): string | null {
    switch (event.type) {
      case 'assistant_message':
        const text = (event.data as any)?.text ?? '';
        return `\n🤖 Response: ${text}\n`;

      case 'unknown_intent':
        const intent = (event.data as any)?.intent ?? 'unknown';
        if (event.meta?.subAgent) {
          const subAgentName = event.meta.subAgent as string;
          return `⚠️  ${subAgentName.toUpperCase()} Agent: Unknown intent '${intent}' - pausing`;
        }
        return `⚠️  Main Agent: Unknown intent '${intent}' - pausing`;

      case 'error':
        const error = event.data as any;
        return `❌ Error: ${error.message}`;

      default:
        // Suppress unknown events by default
        return null;
    }
  }
}

// Convenience function to create a logger with common configurations
export function createAgentLogger(config: LoggingConfig = {}): AgentLogger {
  return new AgentLogger(config);
}



