import { LlmAdapter, LlmRequest, LlmResponse, LlmResponseJson } from './types';
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
}



