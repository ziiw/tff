import { Agent, AgentConfig, AgentRuntime, JsonObject, PrefetchProvider, Thread, Tool } from './types';

export function createAgent(config: AgentConfig, runtime: AgentRuntime): Agent {
  validateConfig(config);
  return { config, runtime };
}

function validateConfig(config: AgentConfig) {
  if (!config.name) throw new Error('AgentConfig.name is required');
  if (!config.prompt) throw new Error('AgentConfig.prompt is required');
  if (!config.tools || config.tools.length === 0) throw new Error('AgentConfig.tools must include at least one tool');
}

export function toolByIntent(tools: Tool[], intent: string): Tool | undefined {
  return tools.find(t => t.intent === intent);
}

export async function runPrefetch(providers: PrefetchProvider[] | undefined, thread: Thread): Promise<JsonObject> {
  const result: JsonObject = {};
  if (!providers || providers.length === 0) return result;
  for (const p of providers) {
    if (!p.shouldRun || p.shouldRun(thread)) {
      const data = await p.run(thread);
      result[p.name] = data;
    }
  }
  return result;
}



