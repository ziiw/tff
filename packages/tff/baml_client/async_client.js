/*************************************************************************************************

Welcome to Baml! To use this generated code, please run one of the following:

$ npm install @boundaryml/baml
$ yarn add @boundaryml/baml
$ pnpm add @boundaryml/baml

*************************************************************************************************/
import { toBamlError, BamlStream, BamlAbortError, Collector } from "@boundaryml/baml";
import { AsyncHttpRequest, AsyncHttpStreamRequest } from "./async_request";
import { LlmResponseParser, LlmStreamParser } from "./parser";
import { DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX, DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_RUNTIME } from "./globals";
export class BamlAsyncClient {
    runtime;
    ctxManager;
    streamClient;
    httpRequest;
    httpStreamRequest;
    llmResponseParser;
    llmStreamParser;
    bamlOptions;
    constructor(runtime, ctxManager, bamlOptions) {
        this.runtime = runtime;
        this.ctxManager = ctxManager;
        this.streamClient = new BamlStreamClient(runtime, ctxManager, bamlOptions);
        this.httpRequest = new AsyncHttpRequest(runtime, ctxManager);
        this.httpStreamRequest = new AsyncHttpStreamRequest(runtime, ctxManager);
        this.llmResponseParser = new LlmResponseParser(runtime, ctxManager);
        this.llmStreamParser = new LlmStreamParser(runtime, ctxManager);
        this.bamlOptions = bamlOptions || {};
    }
    withOptions(bamlOptions) {
        return new BamlAsyncClient(this.runtime, this.ctxManager, bamlOptions);
    }
    get stream() {
        return this.streamClient;
    }
    get request() {
        return this.httpRequest;
    }
    get streamRequest() {
        return this.httpStreamRequest;
    }
    get parse() {
        return this.llmResponseParser;
    }
    get parseStream() {
        return this.llmStreamParser;
    }
    async FinanceAgent(context, __baml_options__) {
        try {
            const options = { ...this.bamlOptions, ...(__baml_options__ || {}) };
            const signal = options.signal;
            if (signal?.aborted) {
                throw new BamlAbortError('Operation was aborted', signal.reason);
            }
            // Check if onTick is provided - route through streaming if so
            if (options.onTick) {
                const stream = this.stream.FinanceAgent(context, __baml_options__);
                return await stream.getFinalResponse();
            }
            const collector = options.collector ? (Array.isArray(options.collector) ? options.collector :
                [options.collector]) : [];
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            const raw = await this.runtime.callFunction("FinanceAgent", {
                "context": context
            }, this.ctxManager.cloneContext(), options.tb?.__tb(), options.clientRegistry, collector, options.tags || {}, env, signal);
            return raw.parsed(false);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
    async MainCoordinator(context, __baml_options__) {
        try {
            const options = { ...this.bamlOptions, ...(__baml_options__ || {}) };
            const signal = options.signal;
            if (signal?.aborted) {
                throw new BamlAbortError('Operation was aborted', signal.reason);
            }
            // Check if onTick is provided - route through streaming if so
            if (options.onTick) {
                const stream = this.stream.MainCoordinator(context, __baml_options__);
                return await stream.getFinalResponse();
            }
            const collector = options.collector ? (Array.isArray(options.collector) ? options.collector :
                [options.collector]) : [];
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            const raw = await this.runtime.callFunction("MainCoordinator", {
                "context": context
            }, this.ctxManager.cloneContext(), options.tb?.__tb(), options.clientRegistry, collector, options.tags || {}, env, signal);
            return raw.parsed(false);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
    async RecipeAgent(context, __baml_options__) {
        try {
            const options = { ...this.bamlOptions, ...(__baml_options__ || {}) };
            const signal = options.signal;
            if (signal?.aborted) {
                throw new BamlAbortError('Operation was aborted', signal.reason);
            }
            // Check if onTick is provided - route through streaming if so
            if (options.onTick) {
                const stream = this.stream.RecipeAgent(context, __baml_options__);
                return await stream.getFinalResponse();
            }
            const collector = options.collector ? (Array.isArray(options.collector) ? options.collector :
                [options.collector]) : [];
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            const raw = await this.runtime.callFunction("RecipeAgent", {
                "context": context
            }, this.ctxManager.cloneContext(), options.tb?.__tb(), options.clientRegistry, collector, options.tags || {}, env, signal);
            return raw.parsed(false);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
    async TravelAgent(context, __baml_options__) {
        try {
            const options = { ...this.bamlOptions, ...(__baml_options__ || {}) };
            const signal = options.signal;
            if (signal?.aborted) {
                throw new BamlAbortError('Operation was aborted', signal.reason);
            }
            // Check if onTick is provided - route through streaming if so
            if (options.onTick) {
                const stream = this.stream.TravelAgent(context, __baml_options__);
                return await stream.getFinalResponse();
            }
            const collector = options.collector ? (Array.isArray(options.collector) ? options.collector :
                [options.collector]) : [];
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            const raw = await this.runtime.callFunction("TravelAgent", {
                "context": context
            }, this.ctxManager.cloneContext(), options.tb?.__tb(), options.clientRegistry, collector, options.tags || {}, env, signal);
            return raw.parsed(false);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
}
class BamlStreamClient {
    runtime;
    ctxManager;
    bamlOptions;
    constructor(runtime, ctxManager, bamlOptions) {
        this.runtime = runtime;
        this.ctxManager = ctxManager;
        this.bamlOptions = bamlOptions || {};
    }
    FinanceAgent(context, __baml_options__) {
        try {
            const options = { ...this.bamlOptions, ...(__baml_options__ || {}) };
            const signal = options.signal;
            if (signal?.aborted) {
                throw new BamlAbortError('Operation was aborted', signal.reason);
            }
            let collector = options.collector ? (Array.isArray(options.collector) ? options.collector :
                [options.collector]) : [];
            let onTickWrapper;
            // Create collector and wrap onTick if provided
            if (options.onTick) {
                const tickCollector = new Collector("on-tick-collector");
                collector = [...collector, tickCollector];
                onTickWrapper = () => {
                    const log = tickCollector.last;
                    if (log) {
                        try {
                            options.onTick("Unknown", log);
                        }
                        catch (error) {
                            console.error("Error in onTick callback for FinanceAgent", error);
                        }
                    }
                };
            }
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            const raw = this.runtime.streamFunction("FinanceAgent", {
                "context": context
            }, undefined, this.ctxManager.cloneContext(), options.tb?.__tb(), options.clientRegistry, collector, options.tags || {}, env, signal, onTickWrapper);
            return new BamlStream(raw, (a) => a, (a) => a, this.ctxManager.cloneContext(), options.signal);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
    MainCoordinator(context, __baml_options__) {
        try {
            const options = { ...this.bamlOptions, ...(__baml_options__ || {}) };
            const signal = options.signal;
            if (signal?.aborted) {
                throw new BamlAbortError('Operation was aborted', signal.reason);
            }
            let collector = options.collector ? (Array.isArray(options.collector) ? options.collector :
                [options.collector]) : [];
            let onTickWrapper;
            // Create collector and wrap onTick if provided
            if (options.onTick) {
                const tickCollector = new Collector("on-tick-collector");
                collector = [...collector, tickCollector];
                onTickWrapper = () => {
                    const log = tickCollector.last;
                    if (log) {
                        try {
                            options.onTick("Unknown", log);
                        }
                        catch (error) {
                            console.error("Error in onTick callback for MainCoordinator", error);
                        }
                    }
                };
            }
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            const raw = this.runtime.streamFunction("MainCoordinator", {
                "context": context
            }, undefined, this.ctxManager.cloneContext(), options.tb?.__tb(), options.clientRegistry, collector, options.tags || {}, env, signal, onTickWrapper);
            return new BamlStream(raw, (a) => a, (a) => a, this.ctxManager.cloneContext(), options.signal);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
    RecipeAgent(context, __baml_options__) {
        try {
            const options = { ...this.bamlOptions, ...(__baml_options__ || {}) };
            const signal = options.signal;
            if (signal?.aborted) {
                throw new BamlAbortError('Operation was aborted', signal.reason);
            }
            let collector = options.collector ? (Array.isArray(options.collector) ? options.collector :
                [options.collector]) : [];
            let onTickWrapper;
            // Create collector and wrap onTick if provided
            if (options.onTick) {
                const tickCollector = new Collector("on-tick-collector");
                collector = [...collector, tickCollector];
                onTickWrapper = () => {
                    const log = tickCollector.last;
                    if (log) {
                        try {
                            options.onTick("Unknown", log);
                        }
                        catch (error) {
                            console.error("Error in onTick callback for RecipeAgent", error);
                        }
                    }
                };
            }
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            const raw = this.runtime.streamFunction("RecipeAgent", {
                "context": context
            }, undefined, this.ctxManager.cloneContext(), options.tb?.__tb(), options.clientRegistry, collector, options.tags || {}, env, signal, onTickWrapper);
            return new BamlStream(raw, (a) => a, (a) => a, this.ctxManager.cloneContext(), options.signal);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
    TravelAgent(context, __baml_options__) {
        try {
            const options = { ...this.bamlOptions, ...(__baml_options__ || {}) };
            const signal = options.signal;
            if (signal?.aborted) {
                throw new BamlAbortError('Operation was aborted', signal.reason);
            }
            let collector = options.collector ? (Array.isArray(options.collector) ? options.collector :
                [options.collector]) : [];
            let onTickWrapper;
            // Create collector and wrap onTick if provided
            if (options.onTick) {
                const tickCollector = new Collector("on-tick-collector");
                collector = [...collector, tickCollector];
                onTickWrapper = () => {
                    const log = tickCollector.last;
                    if (log) {
                        try {
                            options.onTick("Unknown", log);
                        }
                        catch (error) {
                            console.error("Error in onTick callback for TravelAgent", error);
                        }
                    }
                };
            }
            const rawEnv = __baml_options__?.env ? { ...process.env, ...__baml_options__.env } : { ...process.env };
            const env = Object.fromEntries(Object.entries(rawEnv).filter(([_, value]) => value !== undefined));
            const raw = this.runtime.streamFunction("TravelAgent", {
                "context": context
            }, undefined, this.ctxManager.cloneContext(), options.tb?.__tb(), options.clientRegistry, collector, options.tags || {}, env, signal, onTickWrapper);
            return new BamlStream(raw, (a) => a, (a) => a, this.ctxManager.cloneContext(), options.signal);
        }
        catch (error) {
            throw toBamlError(error);
        }
    }
}
export const b = new BamlAsyncClient(DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_RUNTIME, DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX);
