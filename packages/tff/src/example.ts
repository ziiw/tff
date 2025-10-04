import { createAgent } from './agent';
import { createXmlPromptTemplate } from './prompts';
import { OpenAiJsonAdapter } from './llm';
import { createThread, appendEvent } from './thread';
import { execute } from './executor';
import { AgentRuntime, Tool } from './types';
import { consoleLogger } from './observability';

const echoTool: Tool<{ message: string }, { echoed: string }> = {
  intent: 'echo',
  description: 'Echo a message',
  execute: async (args) => {
    return { ok: true, result: { echoed: args.message } };
  },
};

async function main() {
  const apiKey = process.env.OPENAI_API_KEY || '';
  const llm = new OpenAiJsonAdapter(apiKey, 'gpt-4o-mini');
  const runtime: AgentRuntime = {
    llm,
    now: () => new Date(),
    id: () => 'id-' + Math.random().toString(36).slice(2),
    log: consoleLogger,
    onEvent: async (event) => {
      // Real-time event callback - display events to user
      if (event.type === 'llm_stream_chunk') {
        // Streaming chunks from LLM
        const data = event.data as { content: string; accumulated: string };
        process.stdout.write(data.content);
      } else {
        // Other events
        console.log(`\n[EVENT] ${event.type}:`, JSON.stringify(event.data, null, 2));
      }
    },
  };

  const agent = createAgent({
    name: 'echo-agent',
    systemPrompt: 'You are a helpful assistant that returns JSON tool calls only. Use intent "done" when there are no more steps needed.',
    prompt: createXmlPromptTemplate('Choose the appropriate intent.'),
    tools: [echoTool],
    maxSteps: 3,
    streaming: true, // Enable streaming
  }, runtime);

  let thread = createThread('demo');
  thread = appendEvent(thread, { type: 'user_message', data: { text: 'Please echo: hello world' } });

  console.log('\n--- Starting execution ---');
  const res = await execute(agent, thread);
  console.log('\n--- Execution complete ---');
  console.log('Status:', res.status, res.pauseReason ? `(${res.pauseReason})` : '');
  console.log('Final thread events:', res.thread.events.length);
}

main().catch(err => { console.error(err); process.exit(1); });



