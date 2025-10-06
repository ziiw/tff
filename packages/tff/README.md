# TFF (Twelve Factor Framework) for Agents

Opinionated TypeScript framework implementing the 12-factor agent principles (plus pre-fetch) to build small, reliable, production-ready agents. Adaptable to Temporal for durable execution.

## Install

```bash
npm install @tff/core
```

## Quick Start

### Simple Agent

```ts
import { createTool, agent, createDefaultRuntime, createThread, appendEvent, execute } from '@tff/core';

const echoTool = createTool<{ message: string }, { echoed: string }>({
  intent: 'echo',
  description: 'Echo back a message',
  execute: async (args) => {
    return { ok: true, result: { echoed: args.message } };
  },
});

const runtime = createDefaultRuntime({
  llm: new OpenAiJsonAdapter(process.env.OPENAI_API_KEY!, 'gpt-4o-mini'),
});

const myAgent = agent({
  name: 'echo-agent',
  systemPrompt: `You are a helpful echo assistant. Use the echo tool to respond to messages.

When you respond, use this exact format: {"intent": "echo", "arguments": {"message": "your echoed message"}}`,
  tools: [echoTool],
}, runtime);

let thread = createThread('demo');
thread = appendEvent(thread, { type: 'user_message', data: { text: 'hello world' } });
const result = await execute(myAgent, thread);
```

### Multi-Agent System (Recommended)

```ts
import {
  createEnhancedAgent,
  createRespondTool,
  createInvokeTool,
  createDefaultRuntime,
  createMainAgent
} from '@tff/core';

// Create runtime with logging
const runtime = createDefaultRuntime({
  llm: new OpenAiJsonAdapter(process.env.OPENAI_API_KEY!, 'gpt-4o-mini'),
});

// Create a standardized respond tool
const respondTool = createRespondTool(runtime);

// Create specialist agents with auto-injected tool intents
const travelAgent = createEnhancedAgent({
  name: 'travel-agent',
  systemPrompt: `You are a travel planning assistant. Be proactive and use your tools to help users plan trips.`,
  tools: [weatherTool, flightTool, hotelTool, respondTool],
}, runtime);

const recipeAgent = createEnhancedAgent({
  name: 'recipe-agent',
  systemPrompt: `You are a cooking assistant. Help users with recipes and meal planning.`,
  tools: [searchRecipesTool, nutritionTool, respondTool],
}, runtime);

// Create delegation tools (handles sub-agent isolation automatically)
const invokeTravel = createInvokeTool(travelAgent, runtime, {
  intent: 'invoke_travel_agent',
  description: 'Delegate to travel specialist',
  agentName: 'travel',
});

const invokeRecipe = createInvokeTool(recipeAgent, runtime, {
  intent: 'invoke_recipe_agent',
  description: 'Delegate to recipe specialist',
  agentName: 'recipe',
});

// Create main coordinator (auto-generates delegation logic)
const coordinator = createMainAgent({
  name: 'coordinator',
  agents: { travel: travelAgent, recipe: recipeAgent },
  maxSteps: 5,
}, runtime);

// Execute conversation
let thread = createThread('conversation');
thread = appendEvent(thread, { type: 'user_message', data: { text: 'Help me plan a trip to Paris' } });
const result = await execute(coordinator, thread);
```

## Try the Live Example

Run the interactive multi-agent demo:

```bash
git clone https://github.com/your-repo/tff.git
cd tff/packages/tff
npm install
npm run example
```

The example includes:
- **Travel Agent**: Weather, flights, hotels, trip booking
- **Recipe Agent**: Recipe search, nutrition info, meal planning
- **Finance Agent**: Expense tracking, budget summaries, investment info
- **Coordinator**: Automatically routes requests to specialists

## Key Features

### Helper Functions (New!)
The framework now includes powerful helpers that reduce boilerplate by 80%:

- **`createEnhancedAgent`**: Automatically injects tool intent lists into prompts
- **`createRespondTool`**: Standardized response tool with argument normalization
- **`createInvokeTool`**: Handles sub-agent delegation with proper isolation
- **`createMainAgent`**: Auto-generates coordinator logic for multi-agent systems
- **`createDefaultRuntime`**: Pre-configured runtime with OpenAI integration

### Simplified Argument Handling
- **Centralized extraction**: Executor handles all argument formats in one place
- **Standard format**: `{"intent": "tool_name", "arguments": {...}}`
- **Fallback support**: Handles various LLM output formats automatically
- **No more duplicate logic**: Removed complex `normalizeArgs` from individual tools

### Multi-Agent Coordination
- **Automatic delegation**: Coordinator agents route to specialists
- **Event isolation**: Sub-agent events are properly tagged and isolated
- **No duplicate processing**: Framework prevents event duplication bugs
- **Streaming support**: Real-time updates across agent boundaries

## Temporal Integration

- Use `TemporalAdapter.createAgentWorker({ taskQueue, tools, prefetch, llm })` to run LLM and tools as activities
- Start workflow `runAgentWorkflow` with `initialThread` and config
- Signal `resume` or `approve` to proceed past pauses

## 12-Factor Agent Principles

- **Natural Language to Tool Calls**: LLM returns structured JSON with `intent`
- **Own your Prompts**: You bring the prompt template; framework renders context
- **Own your Context Window**: XML-like dense context via `threadToXml`
- **Tools are Structured Outputs**: Tools keyed by `intent`
- **Unify State**: `Thread` is single source of truth
- **Launch/Pause/Resume**: simple run API; Temporal for durability
- **Contact Humans**: built-in pause intents `request_human_input`, `request_approval`
- **Own Control Flow**: executor loop handles sync/async boundaries
- **Compact Errors**: errors appended as events; retries with threshold
- **Small Focused Agents**: enforce limited tools, max steps
- **Trigger from Anywhere**: append events from any channel; Temporal signals
- **Stateless Reducer**: pure transformation over `Thread`
- **Pre-Fetch**: pluggable `PrefetchProvider`s

## Production Notes

- **Idempotent tools**: Side-effects guarded by approvals
- **Structured logging**: Built-in observability with custom formatters
- **TypeScript strict**: Full type safety with minimal shared mutable state
- **LLM validation**: Use zod schemas on top of `NextStep` for additional safety
- **Error resilience**: Automatic retries with configurable thresholds
- **Context efficiency**: XML-dense context packing for optimal token usage