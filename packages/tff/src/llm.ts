import { LlmAdapter, LlmRequest, LlmResponse, LlmResponseJson, LlmStreamResponse, LlmStreamChunk } from './types';
import OpenAI from 'openai';

export class OpenAiJsonAdapter implements LlmAdapter {
  private client: OpenAI;
  private model: string;
  constructor(apiKey: string, model: string) {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }
  async complete(req: LlmRequest): Promise<LlmResponse> {
    const res = await this.client.chat.completions.create({
      model: req.model || this.model,
      messages: req.messages as any,
      response_format: req.responseFormat === 'json' ? { type: 'json_object' } : undefined
    });
    const choice = res.choices[0];
    const content = choice.message.content ?? '';
    if (req.responseFormat === 'json') {
      try {
        const data = JSON.parse(content || '{}');
        const out: LlmResponseJson = { type: 'json', data, raw: res };
        return out;
      } catch (e) {
        return { type: 'text', text: content, raw: res };
      }
    }
    return { type: 'text', text: content, raw: res };
  }

  async stream(req: LlmRequest): Promise<LlmStreamResponse> {
    const stream = await this.client.chat.completions.create({
      model: req.model || this.model,
      messages: req.messages as any,
      response_format: req.responseFormat === 'json' ? { type: 'json_object' } : undefined,
      stream: true,
    });

    let fullContent = '';
    let finalResponse: LlmResponse | null = null;

    const chunks = {
      async *[Symbol.asyncIterator]() {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content || '';
          if (delta) {
            fullContent += delta;
            yield {
              type: 'chunk' as const,
              content: delta,
              done: false,
              raw: chunk,
            };
          }
        }

        // Parse final response
        if (req.responseFormat === 'json') {
          try {
            const data = JSON.parse(fullContent || '{}');
            finalResponse = { type: 'json', data, raw: stream };
          } catch (e) {
            finalResponse = { type: 'text', text: fullContent, raw: stream };
          }
        } else {
          finalResponse = { type: 'text', text: fullContent, raw: stream };
        }

        yield {
          type: 'chunk' as const,
          content: '',
          done: true,
          raw: null,
        };
      },
    };

    return {
      type: 'stream',
      chunks,
      final: async () => {
        if (!finalResponse) {
          throw new Error('Stream not yet complete');
        }
        return finalResponse;
      },
    };
  }
}



