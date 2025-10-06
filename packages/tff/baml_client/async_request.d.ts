/*************************************************************************************************

Welcome to Baml! To use this generated code, please run one of the following:

$ npm install @boundaryml/baml
$ yarn add @boundaryml/baml
$ pnpm add @boundaryml/baml

*************************************************************************************************/
import type { BamlRuntime, BamlCtxManager, ClientRegistry, FunctionLog } from "@boundaryml/baml";
import { HTTPRequest } from "@boundaryml/baml";
import type TypeBuilder from "./type_builder";
type TickReason = "Unknown";
type BamlCallOptions = {
    tb?: TypeBuilder;
    clientRegistry?: ClientRegistry;
    env?: Record<string, string | undefined>;
    onTick?: (reason: TickReason, log: FunctionLog | null) => void;
};
export declare class AsyncHttpRequest {
    private runtime;
    private ctxManager;
    constructor(runtime: BamlRuntime, ctxManager: BamlCtxManager);
    FinanceAgent(context: string, __baml_options__?: BamlCallOptions): Promise<HTTPRequest>;
    MainCoordinator(context: string, __baml_options__?: BamlCallOptions): Promise<HTTPRequest>;
    RecipeAgent(context: string, __baml_options__?: BamlCallOptions): Promise<HTTPRequest>;
    TravelAgent(context: string, __baml_options__?: BamlCallOptions): Promise<HTTPRequest>;
}
export declare class AsyncHttpStreamRequest {
    private runtime;
    private ctxManager;
    constructor(runtime: BamlRuntime, ctxManager: BamlCtxManager);
    FinanceAgent(context: string, __baml_options__?: BamlCallOptions): Promise<HTTPRequest>;
    MainCoordinator(context: string, __baml_options__?: BamlCallOptions): Promise<HTTPRequest>;
    RecipeAgent(context: string, __baml_options__?: BamlCallOptions): Promise<HTTPRequest>;
    TravelAgent(context: string, __baml_options__?: BamlCallOptions): Promise<HTTPRequest>;
}
export {};
