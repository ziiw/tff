import { Agent, AgentConfig, AgentRuntime, Event, Tool, ToolExecutionContext, PromptTemplate, ToolOutcome } from './types';
import { execute } from './executor';
import { createXmlPromptTemplate } from './prompts';
import { OpenAiJsonAdapter } from './llm';
import { consoleLogger, createAgentLogger, LoggingConfig } from './observability';

/**
 * Automatically generates a list of valid tool intents for inclusion in system prompts
 */
export function getToolIntentsList(tools: Tool[]): string {
  return tools.map(t => `"${t.intent}"`).join(', ');
}

/**
 * Enhances an agent's system prompt with automatic tool intents listing
 * This removes the need for developers to manually maintain tool intent lists
 */
export function enhanceSystemPrompt(systemPrompt: string | undefined, tools: Tool[]): string {
  if (!systemPrompt) return '';
  
  const toolIntents = getToolIntentsList(tools);
  const intentInstruction = `\n\nIMPORTANT: You MUST respond with a JSON object containing ONLY these valid intents: ${toolIntents}, or "done".`;
  
  // Check if the prompt already has an IMPORTANT section about intents
  if (systemPrompt.includes('IMPORTANT:') && systemPrompt.includes('valid intents')) {
    // Replace the existing intent list
    return systemPrompt.replace(
      /IMPORTANT:.*?valid intents:.*?(?:,\s*or\s*"done")?\.?/s,
      `IMPORTANT: You MUST respond with a JSON object containing ONLY these valid intents: ${toolIntents}, or "done".`
    );
  }
  
  // Otherwise append the instruction
  return systemPrompt + intentInstruction;
}

/**
 * Creates a generic respond tool that can be used by any agent
 * Handles various argument formats and normalizes them automatically
 */
export function createRespondTool(runtime: AgentRuntime, options?: {
  endTurn?: boolean;
  meta?: Record<string, any>;
}): Tool<{ message?: string; text?: string }, { responded: boolean }> {
  return {
    intent: 'respond',
    description: 'Send a response message to the user. Use format: {"intent": "respond", "arguments": {"message": "your message"}}',
    endTurn: options?.endTurn ?? true,
    // No normalizeArgs needed - executor handles extraction
    execute: async (args: { message?: string; text?: string }, ctx: ToolExecutionContext) => {
      // Handle both 'message' and 'text' fields for flexibility
      const text = args.message ?? args.text ?? '';
      
      if (!text) {
        console.warn('[respond] Received empty message, args:', JSON.stringify(args));
      }
      
      const event: Event = {
        type: 'assistant_message',
        data: { text },
        ts: runtime.now().toISOString(),
        id: runtime.id(),
        meta: options?.meta,
      };
      return {
        ok: true,
        result: { responded: true },
        events: [event],
      };
    },
  };
}

/**
 * Creates an invoke tool that delegates to a sub-agent
 * This abstracts away the complexity of sub-agent execution, event tagging, and thread management
 */
export function createInvokeTool(
  subAgent: Agent,
  runtime: AgentRuntime,
  options: {
    intent: string;
    description: string;
    agentName: string;
  }
): Tool<{ query?: string }, { delegatedTo: string; stepsTaken: number }> {
  return {
    intent: options.intent,
    description: options.description,
    endTurn: true, // Delegation always ends the turn
    execute: async (args: { query?: string }, ctx: ToolExecutionContext) => {
      // Create a sub-agent with a modified runtime that doesn't call onEvent
      // This prevents duplicate event processing - events will be processed once when returned to main agent
      const subRuntime: AgentRuntime = {
        ...runtime,
        onEvent: undefined, // Disable onEvent for sub-agent execution
      };
      const isolatedSubAgent: Agent = {
        ...subAgent,
        runtime: subRuntime,
      };
      
      // Create a copy of the current thread for sub-execution
      const subThread = {
        id: `${ctx.thread.id}-sub-${options.agentName}`,
        events: [...ctx.thread.events],
        cursor: ctx.thread.cursor,
      };
      
      const subResult = await execute(isolatedSubAgent, subThread);
      
      // Get new events added by sub-execution
      const newEvents = subResult.thread.events.slice(ctx.thread.events.length);
      
      // Tag them as sub-agent events
      const taggedEvents = newEvents.map((ev: Event) => ({
        ...ev,
        meta: { ...(ev.meta || {}), subAgent: options.agentName }
      }));
      
      return {
        ok: true,
        result: { delegatedTo: options.agentName, stepsTaken: newEvents.length },
        events: taggedEvents,
      };
    },
  };
}

/**
 * Enhanced createAgent that automatically handles system prompt enhancement
 */
export function createEnhancedAgent(config: AgentConfig, runtime: AgentRuntime): Agent {
  const enhancedConfig: AgentConfig = {
    ...config,
    systemPrompt: enhanceSystemPrompt(config.systemPrompt, config.tools),
  };
  
  return {
    config: enhancedConfig,
    runtime,
  };
}

// --- Simplified API layer to reduce boilerplate ---

function randomId(): string {
  try {
    // @ts-ignore
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Minimal tool helper to avoid repeating optional fields and generic plumbing
 */
export function defineTool<TArgs = any, TResult = any>(config: {
  intent: string;
  description?: string;
  endTurn?: boolean;
  normalizeArgs?: (next: any) => any;
  execute: (args: TArgs, ctx: ToolExecutionContext) => Promise<ToolOutcome<TResult>> | ToolOutcome<TResult>;
}): Tool<TArgs, TResult> {
  return {
    intent: config.intent,
    description: config.description,
    endTurn: config.endTurn,
    normalizeArgs: config.normalizeArgs,
    execute: config.execute as any,
  };
}

// Friendly alias for defineTool
export const createTool = defineTool;

/**
 * Provide an easy runtime factory with sensible defaults
 */
export function createDefaultRuntime(options?: {
  apiKey?: string;
  model?: string;
  onEvent?: AgentRuntime['onEvent'];
  logger?: AgentRuntime['log'];
}): AgentRuntime {
  const apiKey = options?.apiKey ?? process.env.OPENAI_API_KEY ?? '';
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set. Pass apiKey or set env var.');
  }
  const model = options?.model ?? 'gpt-5-mini';
  const llm = new OpenAiJsonAdapter(apiKey, model);

  return {
    llm,
    now: () => new Date(),
    id: () => randomId(),
    log: options?.logger ?? consoleLogger,
    onEvent: options?.onEvent,
  };
}

/**
 * Create a worker-style agent with smart defaults and auto-added respond tool
 */
export function agent(config: {
  name: string;
  systemPrompt?: string;
  tools: Tool[];
  prompt?: PromptTemplate;
  maxSteps?: number;
  retryLimitPerIntent?: number;
  prefetch?: AgentConfig['prefetch'];
  streaming?: boolean;
  includeRespondTool?: boolean; // default true
}, runtime: AgentRuntime): Agent {
  const includeRespond = config.includeRespondTool !== false;
  const respond = includeRespond ? createRespondTool(runtime) : undefined;
  const tools = includeRespond && respond ? [...config.tools, respond] : [...config.tools];

  return createEnhancedAgent({
    name: config.name,
    role: 'worker',
    systemPrompt: config.systemPrompt,
    prompt: config.prompt ?? createXmlPromptTemplate(),
    tools,
    maxSteps: config.maxSteps ?? 10,
    retryLimitPerIntent: config.retryLimitPerIntent ?? 3,
    prefetch: config.prefetch,
    streaming: config.streaming ?? true,
  }, runtime);
}

/**
 * Create a main coordinator agent from a map of sub-agents. Automatically wires invoke tools.
 */
export function createMainAgent(options: {
  name?: string;
  systemPrompt?: string;
  agents: Record<string, Agent>; // key used in intent: invoke_<key>_agent
  prompt?: PromptTemplate;
  maxSteps?: number;
  streaming?: boolean;
  includeRespondTool?: boolean; // default true
}, runtime: AgentRuntime): Agent {
  const entries = Object.entries(options.agents);
  const invokeTools = entries.map(([key, ag]) =>
    createInvokeTool(ag, runtime, {
      intent: `invoke_${key}_agent`,
      description: `Delegate to the ${key} specialist agent`,
      agentName: key,
    })
  );

  const includeRespond = options.includeRespondTool !== false;
  const respond = includeRespond ? createRespondTool(runtime, { meta: { source: 'main-router' } }) : undefined;
  const tools = includeRespond && respond ? [...invokeTools, respond] : invokeTools;

  // Auto-generate delegation logic based on agent capabilities
  const agentCapabilities = entries.map(([key, agent]) => {
    const tools = agent.config.tools;
    const toolDescriptions = tools
      .filter(t => t.intent !== 'respond') // Exclude respond tool
      .map(t => t.description || t.intent)
      .join(', ');
    return `${key}: ${toolDescriptions}`;
  }).join('\n');

  const defaultSystemPrompt = [
    'You are a coordinator that delegates to specialist agents based on user needs.',
    'Available specialists and their capabilities:',
    agentCapabilities,
    '',
    'Analyze the user\'s request and delegate to the most appropriate specialist.',
    'Use "respond" only if the request is unclear or doesn\'t match any specialist.',
    'After delegating, the specialist will handle the complete interaction.'
  ].join('\n');

  return createEnhancedAgent({
    name: options.name ?? 'main',
    role: 'coordinator',
    systemPrompt: options.systemPrompt ?? defaultSystemPrompt,
    prompt: options.prompt ?? createXmlPromptTemplate('Which specialist should handle this request?'),
    tools,
    maxSteps: options.maxSteps ?? 5,
    streaming: options.streaming ?? true,
  }, runtime);
}
