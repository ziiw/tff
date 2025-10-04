import { Worker } from '@temporalio/worker';
import { JsonObject, LlmAdapter, Thread, Tool, ToolOutcome, PrefetchProvider } from '../types';

export interface CreateAgentWorkerOptions {
  taskQueue: string;
  workflowsPath?: string; // defaults to this package's compiled workflow
  tools: Tool[];
  prefetch?: PrefetchProvider[];
  llm: LlmAdapter;
  log?: (level: 'debug' | 'info' | 'warn' | 'error', message: string, meta?: JsonObject) => void;
}

export async function createAgentWorker(opts: CreateAgentWorkerOptions) {
  const activities = {
    async completeLlm(req: { systemPrompt?: string; prompt: string; contextXml: string }) {
      const res = await opts.llm.complete({ model: 'auto', messages: [
        req.systemPrompt ? { role: 'system' as const, content: req.systemPrompt } : undefined,
        { role: 'user' as const, content: req.prompt },
      ].filter(Boolean) as any, responseFormat: 'json' });
      if (res.type === 'json') return res.data as any;
      try { return JSON.parse(res.text) as any; } catch { return { intent: 'done_for_now', message: res.text } as any; }
    },
    async executeTool(intent: string, args: JsonObject, thread: Thread): Promise<ToolOutcome> {
      const tool = opts.tools.find(t => t.intent === intent);
      if (!tool) return { ok: false, error: { name: 'UnknownTool', message: `No tool for intent ${intent}` } };
      try {
        const validatedArgs = (tool as any).validate ? (tool as any).validate(args) : args;
        return await tool.execute(validatedArgs as any, { thread });
      } catch (e: any) {
        return { ok: false, error: { name: e?.name || 'Error', message: e?.message || String(e), stack: e?.stack } };
      }
    },
    async prefetch(thread: Thread): Promise<JsonObject> {
      const out: JsonObject = {};
      if (!opts.prefetch) return out;
      for (const p of opts.prefetch) {
        if (!p.shouldRun || p.shouldRun(thread)) {
          out[p.name] = await p.run(thread);
        }
      }
      return out;
    },
    async log(level: 'debug' | 'info' | 'warn' | 'error', message: string, meta?: JsonObject) {
      opts.log?.(level, message, meta);
    },
  };

  const worker = await Worker.create({
    workflowsPath: opts.workflowsPath ?? require.resolve('./workflow'),
    activities,
    taskQueue: opts.taskQueue,
  });

  return worker;
}



