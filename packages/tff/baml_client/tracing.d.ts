/*************************************************************************************************

Welcome to Baml! To use this generated code, please run one of the following:

$ npm install @boundaryml/baml
$ yarn add @boundaryml/baml
$ pnpm add @boundaryml/baml

*************************************************************************************************/
import type { BamlLogEvent } from '@boundaryml/baml';
declare const traceAsync: <ReturnType, F extends (...args: any[]) => Promise<ReturnType>>(name: string, func: F) => F;
declare const traceSync: <ReturnType, F extends (...args: any[]) => ReturnType>(name: string, func: F) => F;
declare const setTags: (tags: Record<string, string>) => void;
declare const flush: () => void;
declare const onLogEvent: (callback: undefined | ((event: BamlLogEvent) => void)) => void;
export { traceAsync, traceSync, setTags, flush, onLogEvent };
