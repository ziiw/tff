TFF (Twelve Factor Framework) for Agents

Opinionated TypeScript framework implementing the 12-factor agent principles (plus pre-fetch) to build small, reliable, production-ready agents. Adaptable to Temporal for durable execution.

Install

```bash
cd packages/tff
npm i
```

Quick Start

```ts
import { createAgent, createThread, appendEvent, execute, OpenAiJsonAdapter, createXmlPromptTemplate } from '@tff/core';

const echoTool = {
  intent: 'echo',
  async execute(args: { message: string }) {
    return { ok: true, result: { echoed: args.message } };
  },
};

const runtime = {
  llm: new OpenAiJsonAdapter(process.env.OPENAI_API_KEY!, 'gpt-4o-mini'),
  now: () => new Date(),
  id: () => crypto.randomUUID(),
};

const agent = createAgent({
  name: 'echo-agent',
  prompt: createXmlPromptTemplate('Choose the appropriate intent.'),
  tools: [echoTool],
}, runtime);

let thread = createThread('demo');
thread = appendEvent(thread, { type: 'user_message', data: { text: 'echo hello' } });
const result = await execute(agent, thread);
```

Temporal Integration

- Use `TemporalAdapter.createAgentWorker({ taskQueue, tools, prefetch, llm })` to run LLM and tools as activities.
- Start workflow `runAgentWorkflow` with `initialThread` and config.
- Signal `resume` or `approve` to proceed past pauses.

Principles Mapping

- Natural Language to Tool Calls: LLM returns structured JSON with `intent`.
- Own your Prompts: You bring the prompt template; framework renders context.
- Own your Context Window: XML-like dense context via `threadToXml`.
- Tools are Structured Outputs: Tools keyed by `intent`.
- Unify State: `Thread` is single source of truth.
- Launch/Pause/Resume: simple run API; Temporal for durability.
- Contact Humans: built-in pause intents `request_human_input`, `request_approval`.
- Own Control Flow: executor loop handles sync/async boundaries.
- Compact Errors: errors appended as events; retries with threshold.
- Small Focused Agents: enforce limited tools, max steps.
- Trigger from Anywhere: append events from any channel; Temporal signals.
- Stateless Reducer: pure transformation over `Thread`.
- Pre-Fetch: pluggable `PrefetchProvider`s.

Production Notes

- Idempotent tools; side-effects guarded by approvals.
- Structured logging hooks.
- Strict TS types, minimal shared mutable state.
- LLM response validation recommended via zod on top of `NextStep`.



