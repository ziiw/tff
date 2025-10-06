/*************************************************************************************************

Welcome to Baml! To use this generated code, please run one of the following:

$ npm install @boundaryml/baml
$ yarn add @boundaryml/baml
$ pnpm add @boundaryml/baml

*************************************************************************************************/
import { BamlRuntime, BamlCtxManager } from '@boundaryml/baml';
export declare const DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_RUNTIME: BamlRuntime;
export declare const DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX: BamlCtxManager;
/**
 * @deprecated resetBamlEnvVars is deprecated and is safe to remove, since environment variables are now lazily loaded on each function call
 */
export declare function resetBamlEnvVars(envVars: Record<string, string | undefined>): void;
