import { PromptTemplate, Thread } from './types';
import { threadToXml } from './context';

export function createXmlPromptTemplate(staticInstructions?: string): PromptTemplate {
  return {
    name: 'xml-default',
    render: ({ thread, prefetch }) => {
      const xml = threadToXml(thread);
      const pre = prefetch && Object.keys(prefetch).length > 0 ? `\n<pre_fetch>\n${JSON.stringify(prefetch, null, 2)}\n</pre_fetch>\n` : '';
      return [
        staticInstructions?.trim() ?? '',
        pre,
        xml,
        '\nRespond with a JSON object that includes an "intent" and any required arguments.',
      ].filter(Boolean).join('\n');
    },
  };
}



