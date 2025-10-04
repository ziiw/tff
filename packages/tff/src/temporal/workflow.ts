/*
  Temporal Workflow adapter for TFF
  - Workflows must be deterministic and cannot perform network I/O
  - LLM calls and Tool execution are delegated to activities
*/

import { proxyActivities, defineSignal, defineQuery, condition, setHandler } from '@temporalio/workflow';
import { Thread, NextStep, JsonObject, ToolOutcome } from '../types';
import { threadToXml } from '../context';

export interface AgentWorkflowInput {
  name: string;
  systemPrompt?: string;
  maxSteps?: number;
  retryLimitPerIntent?: number;
  initialThread: Thread;
}

export interface Activities {
  completeLlm: (req: { systemPrompt?: string; prompt: string; contextXml: string }) => Promise<NextStep>;
  executeTool: (intent: string, args: JsonObject, thread: Thread) => Promise<ToolOutcome>;
  prefetch: (thread: Thread) => Promise<JsonObject>;
  log: (level: 'debug' | 'info' | 'warn' | 'error', message: string, meta?: JsonObject) => Promise<void>;
}

const a = proxyActivities<Activities>({ startToCloseTimeout: '2 minute' });

export const resumeSignal = defineSignal<[JsonObject]>('resume');
export const approveSignal = defineSignal<[]>('approve');
export const rejectSignal = defineSignal<[]>('reject');
export const getThreadQuery = defineQuery<Thread>('getThread');
export const getStatusQuery = defineQuery<'running' | 'paused' | 'completed' | 'failed'>('getStatus');

export async function runAgentWorkflow(input: AgentWorkflowInput): Promise<Thread> {
  let thread = input.initialThread;
  let status: 'running' | 'paused' | 'completed' | 'failed' = 'running';
  let paused = false;
  let consecutiveErrors = 0;

  let resumePayload: JsonObject | undefined;
  let approvalGranted: boolean | undefined;

  const setPaused = () => { paused = true; status = 'paused'; };

  // signals
  // resume with payload (e.g., human response)
  setHandler(resumeSignal, (payload: JsonObject) => {
    resumePayload = payload;
    paused = false;
    status = 'running';
  });
  setHandler(approveSignal, () => {
    approvalGranted = true;
    paused = false;
    status = 'running';
  });
  setHandler(rejectSignal, () => {
    approvalGranted = false;
    paused = false;
    status = 'running';
  });

  // queries
  setHandler(getThreadQuery, () => thread);
  setHandler(getStatusQuery, () => status);

  const prefetch = await a.prefetch(thread);

  const maxSteps = input.maxSteps ?? 30;
  const retryLimit = input.retryLimitPerIntent ?? 3;

  for (let i = 0; i < maxSteps; i++) {
    const contextXml = threadToXml(thread);
    const prompt = [
      input.systemPrompt ?? '',
      '<prefetch>',
      JSON.stringify(prefetch),
      '</prefetch>',
      contextXml,
      'Respond with JSON { intent: string, ... }',
    ].join('\n');

    const nextStep = await a.completeLlm({ systemPrompt: input.systemPrompt, prompt, contextXml });

    // record
    thread = { ...thread, events: [...thread.events, { id: `wf-${Date.now()}-${i}`, ts: new Date().toISOString(), type: nextStep.intent, data: nextStep }] };

    // pause points
    if (nextStep.intent === 'request_human_input') {
      setPaused();
      await a.log('info', 'Paused for human input', { nextStep });
      await condition(() => !paused, 'wait-resume');
      thread = { ...thread, events: [...thread.events, { id: `wf-human-${Date.now()}`, ts: new Date().toISOString(), type: 'human_response', data: (resumePayload ?? null) as any }] };
      continue;
    }
    if (nextStep.intent === 'request_approval') {
      setPaused();
      await a.log('info', 'Paused for approval', { nextStep });
      await condition(() => !paused, 'wait-approval');
      thread = { ...thread, events: [...thread.events, { id: `wf-approval-${Date.now()}`, ts: new Date().toISOString(), type: 'approval_result', data: { approved: !!approvalGranted } as any }] };
      continue;
    }
    if (nextStep.intent === 'done' || nextStep.intent === 'done_for_now') {
      status = 'completed';
      break;
    }

    // execute tool as activity
    const outcome = await a.executeTool(nextStep.intent, nextStep as any, thread);
    if (outcome.ok) {
      consecutiveErrors = 0;
      thread = { ...thread, events: [...thread.events, { id: `wf-${Date.now()}-res-${i}`, ts: new Date().toISOString(), type: `${nextStep.intent}_result`, data: outcome.result as any }] };
    } else {
      consecutiveErrors += 1;
      thread = { ...thread, events: [...thread.events, { id: `wf-${Date.now()}-err-${i}`, ts: new Date().toISOString(), type: 'error', data: outcome.error as any }] };
      if (consecutiveErrors >= retryLimit) {
        status = 'failed';
        break;
      }
    }
  }

  return thread;
}



