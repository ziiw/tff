/*************************************************************************************************

Welcome to Baml! To use this generated code, please run one of the following:

$ npm install @boundaryml/baml
$ yarn add @boundaryml/baml
$ pnpm add @boundaryml/baml

*************************************************************************************************/
import { toBamlError } from "@boundaryml/baml";
export class AsyncHttpRequest {
    runtime;
    ctxManager;
    constructor(runtime, ctxManager) {
        this.runtime = runtime;
        this.ctxManager = ctxManager;
    }
    async FinanceAgent(context, __baml_options__) {
        try {
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            return await this.runtime.buildRequest("FinanceAgent", {
                "context": context
            }, this.ctxManager.cloneContext(), __baml_options__?.tb?.__tb(), __baml_options__?.clientRegistry, false, env);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
    async MainCoordinator(context, __baml_options__) {
        try {
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            return await this.runtime.buildRequest("MainCoordinator", {
                "context": context
            }, this.ctxManager.cloneContext(), __baml_options__?.tb?.__tb(), __baml_options__?.clientRegistry, false, env);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
    async RecipeAgent(context, __baml_options__) {
        try {
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            return await this.runtime.buildRequest("RecipeAgent", {
                "context": context
            }, this.ctxManager.cloneContext(), __baml_options__?.tb?.__tb(), __baml_options__?.clientRegistry, false, env);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
    async TravelAgent(context, __baml_options__) {
        try {
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            return await this.runtime.buildRequest("TravelAgent", {
                "context": context
            }, this.ctxManager.cloneContext(), __baml_options__?.tb?.__tb(), __baml_options__?.clientRegistry, false, env);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
}
export class AsyncHttpStreamRequest {
    runtime;
    ctxManager;
    constructor(runtime, ctxManager) {
        this.runtime = runtime;
        this.ctxManager = ctxManager;
    }
    async FinanceAgent(context, __baml_options__) {
        try {
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            return await this.runtime.buildRequest("FinanceAgent", {
                "context": context
            }, this.ctxManager.cloneContext(), __baml_options__?.tb?.__tb(), __baml_options__?.clientRegistry, true, env);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
    async MainCoordinator(context, __baml_options__) {
        try {
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            return await this.runtime.buildRequest("MainCoordinator", {
                "context": context
            }, this.ctxManager.cloneContext(), __baml_options__?.tb?.__tb(), __baml_options__?.clientRegistry, true, env);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
    async RecipeAgent(context, __baml_options__) {
        try {
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            return await this.runtime.buildRequest("RecipeAgent", {
                "context": context
            }, this.ctxManager.cloneContext(), __baml_options__?.tb?.__tb(), __baml_options__?.clientRegistry, true, env);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
    async TravelAgent(context, __baml_options__) {
        try {
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            return await this.runtime.buildRequest("TravelAgent", {
                "context": context
            }, this.ctxManager.cloneContext(), __baml_options__?.tb?.__tb(), __baml_options__?.clientRegistry, true, env);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
}
