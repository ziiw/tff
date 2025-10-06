/*************************************************************************************************

Welcome to Baml! To use this generated code, please run one of the following:

$ npm install @boundaryml/baml
$ yarn add @boundaryml/baml
$ pnpm add @boundaryml/baml

*************************************************************************************************/
import { toBamlError } from "@boundaryml/baml";
export class LlmResponseParser {
    runtime;
    ctxManager;
    constructor(runtime, ctxManager) {
        this.runtime = runtime;
        this.ctxManager = ctxManager;
    }
    FinanceAgent(llmResponse, __baml_options__) {
        try {
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            return this.runtime.parseLlmResponse("FinanceAgent", llmResponse, false, this.ctxManager.cloneContext(), __baml_options__?.tb?.__tb(), __baml_options__?.clientRegistry, env);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
    MainCoordinator(llmResponse, __baml_options__) {
        try {
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            return this.runtime.parseLlmResponse("MainCoordinator", llmResponse, false, this.ctxManager.cloneContext(), __baml_options__?.tb?.__tb(), __baml_options__?.clientRegistry, env);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
    RecipeAgent(llmResponse, __baml_options__) {
        try {
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            return this.runtime.parseLlmResponse("RecipeAgent", llmResponse, false, this.ctxManager.cloneContext(), __baml_options__?.tb?.__tb(), __baml_options__?.clientRegistry, env);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
    TravelAgent(llmResponse, __baml_options__) {
        try {
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            return this.runtime.parseLlmResponse("TravelAgent", llmResponse, false, this.ctxManager.cloneContext(), __baml_options__?.tb?.__tb(), __baml_options__?.clientRegistry, env);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
}
export class LlmStreamParser {
    runtime;
    ctxManager;
    constructor(runtime, ctxManager) {
        this.runtime = runtime;
        this.ctxManager = ctxManager;
    }
    FinanceAgent(llmResponse, __baml_options__) {
        try {
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            return this.runtime.parseLlmResponse("FinanceAgent", llmResponse, true, this.ctxManager.cloneContext(), __baml_options__?.tb?.__tb(), __baml_options__?.clientRegistry, env);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
    MainCoordinator(llmResponse, __baml_options__) {
        try {
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            return this.runtime.parseLlmResponse("MainCoordinator", llmResponse, true, this.ctxManager.cloneContext(), __baml_options__?.tb?.__tb(), __baml_options__?.clientRegistry, env);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
    RecipeAgent(llmResponse, __baml_options__) {
        try {
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            return this.runtime.parseLlmResponse("RecipeAgent", llmResponse, true, this.ctxManager.cloneContext(), __baml_options__?.tb?.__tb(), __baml_options__?.clientRegistry, env);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
    TravelAgent(llmResponse, __baml_options__) {
        try {
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            return this.runtime.parseLlmResponse("TravelAgent", llmResponse, true, this.ctxManager.cloneContext(), __baml_options__?.tb?.__tb(), __baml_options__?.clientRegistry, env);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
}
