import { Agent, ExecutionResult, JsonObject, LlmRequest, NextStep, PauseReason, Tool, ToolError, ToolOutcome, LlmStreamResponse, LlmResponseOrStream } from './types';
import { appendEvent, formatError } from './thread';
import { threadToXml } from './context';
import { runPrefetch, toolByIntent } from './agent';

function shouldPauseForIntent(intent: string, tool: Tool | undefined): PauseReason | undefined {
  if (intent === 'request_human_input' || intent === 'request_approval') return 'await_human';
  if (intent === 'done_for_now' || intent === 'done') return 'done_for_now';
  return undefined;
}

export async function execute(agent: Agent, initialThread: Agent['runtime'] extends never ? never : any): Promise<ExecutionResult> {
  const { runtime, config } = agent;
  const retryLimit = config.retryLimitPerIntent ?? 3;
  const maxSteps = config.maxSteps ?? 20;

  let thread = initialThread;
  let consecutiveErrors = 0;

  const prefetch: JsonObject = await runPrefetch(config.prefetch, thread);

  for (let step = 0; step < maxSteps; step++) {
    const contextXml = threadToXml(thread);
    const userContent = [
      'Here is the full context/history so far in XML-like blocks:',
      contextXml,
      '',
      'What is the next step? Respond with a JSON object using this format:',
      '{"intent": "tool_name", "arguments": {your args here}}',
      '',
      'Examples:',
      '- {"intent": "respond", "arguments": {"message": "Hello!"}}',
      '- {"intent": "search_recipes", "arguments": {"ingredients": ["chicken", "rice"]}}',
    ].join('\n');

    const messages: LlmRequest['messages'] = [];
    if (config.systemPrompt) messages.push({ role: 'system', content: config.systemPrompt });
    messages.push({ role: 'user', content: config.prompt.render({ thread, prefetch }) });
    messages.push({ role: 'user', content: userContent });

    let llmRes: LlmResponseOrStream;
    let nextStep: NextStep;

    if (config.streaming && runtime.llm.stream) {
      // Use streaming
      const streamRes = await runtime.llm.stream({ messages, responseFormat: 'json' });
      let streamingContent = '';

      for await (const chunk of streamRes.chunks) {
        if (!chunk.done) {
          streamingContent += chunk.content;
          // Emit streaming event if callback is provided
          if (runtime.onEvent) {
            await runtime.onEvent({
              type: 'llm_stream_chunk',
              data: { content: chunk.content, accumulated: streamingContent },
              ts: runtime.now().toISOString(),
              id: runtime.id(),
            });
          }
        }
      }

      const finalRes = await streamRes.final();
      llmRes = finalRes;
    } else {
      // Use regular completion
      llmRes = await runtime.llm.complete({ messages, responseFormat: 'json' });
    }

    if (llmRes.type !== 'json') {
      runtime.log?.('warn', 'Non-JSON response from LLM; treating as done', { text: llmRes.text ?? '' as any });
      return { thread, status: 'completed' };
    }

    nextStep = llmRes.data as NextStep;
    const tool = toolByIntent(config.tools, nextStep.intent);

    const pauseReason = shouldPauseForIntent(nextStep.intent, tool);
    if (pauseReason) {
      thread = appendEvent(thread, { type: nextStep.intent, data: nextStep });
      if (runtime.onEvent) {
        await runtime.onEvent(thread.events[thread.events.length - 1]);
      }
      return { thread, status: 'paused', pauseReason };
    }

    if (!tool) {
      runtime.log?.('warn', 'Unknown intent from model; pausing', { intent: nextStep.intent as any });
      thread = appendEvent(thread, { type: 'unknown_intent', data: nextStep });
      if (runtime.onEvent) {
        await runtime.onEvent(thread.events[thread.events.length - 1]);
      }
      return { thread, status: 'paused', pauseReason: 'await_external' };
    }

    // record requested action
    thread = appendEvent(thread, { type: nextStep.intent, data: nextStep });
    if (runtime.onEvent) {
      await runtime.onEvent(thread.events[thread.events.length - 1]);
    }

    let outcome: ToolOutcome;
    try {
      // Extract arguments from the LLM response in a standardized way
      // Priority: arguments > args > top-level fields
      let extractedArgs: any;
      
      if (tool.normalizeArgs) {
        // Tool has custom normalization logic
        extractedArgs = tool.normalizeArgs(nextStep);
      } else {
        // Standard extraction: look for arguments/args object first
        const argsObj = (nextStep as any).arguments ?? (nextStep as any).args;
        if (argsObj && typeof argsObj === 'object') {
          extractedArgs = argsObj;
        } else {
          // Fallback: use top-level fields (excluding 'intent')
          const { intent, ...rest } = nextStep as any;
          extractedArgs = Object.keys(rest).length > 0 ? rest : nextStep;
        }
      }
      
      outcome = await tool.execute(extractedArgs as any, { thread });
    } catch (e) {
      const err = formatError(e);
      const stackVal = typeof err.stack === 'string' ? err.stack : undefined;
      outcome = { ok: false, error: { name: String(err.name), message: String(err.message), stack: stackVal } };
    }

    if (outcome.ok) {
      consecutiveErrors = 0;
      if (outcome.events && outcome.events.length) {
        for (const ev of outcome.events) {
          thread = appendEvent(thread, ev);
          if (runtime.onEvent) {
            await runtime.onEvent(thread.events[thread.events.length - 1]);
          }
        }
      }
      thread = appendEvent(thread, { type: `${nextStep.intent}_result`, data: outcome.result as any });
      if (runtime.onEvent) {
        await runtime.onEvent(thread.events[thread.events.length - 1]);
      }

      // If tool is marked to end the turn, or coordinator responded, finish this execution
      const coordinatorResponded = config.role === 'coordinator' && nextStep.intent === 'respond';
      if (tool.endTurn || coordinatorResponded) {
        return { thread, status: 'paused', pauseReason: 'done_for_now' };
      }
      // continue loop to ask model what to do next
      continue;
    } else {
      consecutiveErrors += 1;
      thread = appendEvent(thread, { type: 'error', data: outcome.error as any });
      if (runtime.onEvent) {
        await runtime.onEvent(thread.events[thread.events.length - 1]);
      }
      if (consecutiveErrors >= retryLimit) {
        return { thread, status: 'failed', lastError: outcome.error.message };
      }
      // let model try to recover; continue loop
      continue;
    }
  }

  return { thread, status: 'paused', pauseReason: 'rate_limited' };
}



