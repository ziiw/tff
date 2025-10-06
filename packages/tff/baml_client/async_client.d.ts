/*************************************************************************************************

Welcome to Baml! To use this generated code, please run one of the following:

$ npm install @boundaryml/baml
$ yarn add @boundaryml/baml
$ pnpm add @boundaryml/baml

*************************************************************************************************/
import type { BamlRuntime, BamlCtxManager, ClientRegistry, FunctionLog } from "@boundaryml/baml";
import { BamlStream, Collector } from "@boundaryml/baml";
import type { RecursivePartialNull as MovedRecursivePartialNull } from "./types";
import type { partial_types } from "./partial_types";
import type * as types from "./types";
import type TypeBuilder from "./type_builder";
import { AsyncHttpRequest, AsyncHttpStreamRequest } from "./async_request";
import { LlmResponseParser, LlmStreamParser } from "./parser";
/**
* @deprecated Use RecursivePartialNull from 'baml_client/types' instead.
*/
export type RecursivePartialNull<T> = MovedRecursivePartialNull<T>;
type TickReason = "Unknown";
type BamlCallOptions = {
    tb?: TypeBuilder;
    clientRegistry?: ClientRegistry;
    collector?: Collector | Collector[];
    env?: Record<string, string | undefined>;
    tags?: Record<string, string>;
    signal?: AbortSignal;
    onTick?: (reason: TickReason, log: FunctionLog | null) => void;
};
export declare class BamlAsyncClient {
    private runtime;
    private ctxManager;
    private streamClient;
    private httpRequest;
    private httpStreamRequest;
    private llmResponseParser;
    private llmStreamParser;
    private bamlOptions;
    constructor(runtime: BamlRuntime, ctxManager: BamlCtxManager, bamlOptions?: BamlCallOptions);
    withOptions(bamlOptions: BamlCallOptions): BamlAsyncClient;
    get stream(): BamlStreamClient;
    get request(): AsyncHttpRequest;
    get streamRequest(): AsyncHttpStreamRequest;
    get parse(): LlmResponseParser;
    get parseStream(): LlmStreamParser;
    FinanceAgent(context: string, __baml_options__?: BamlCallOptions): Promise<types.TrackExpense | types.GetBudgetSummary | types.GetInvestmentInfo | types.CalculateSavingsGoal | types.FinanceRespond | types.FinanceDone>;
    MainCoordinator(context: string, __baml_options__?: BamlCallOptions): Promise<types.InvokeTravelAgent | types.InvokeRecipeAgent | types.InvokeFinanceAgent | types.CoordinatorRespond | types.CoordinatorDone>;
    RecipeAgent(context: string, __baml_options__?: BamlCallOptions): Promise<types.SearchRecipes | types.GetNutrition | types.PlanMeal | types.CreateShoppingList | types.RecipeRespond | types.RecipeDone>;
    TravelAgent(context: string, __baml_options__?: BamlCallOptions): Promise<types.GetWeather | types.SearchFlights | types.SearchHotels | types.BookTrip | types.RespondToUser | types.Done>;
}
declare class BamlStreamClient {
    private runtime;
    private ctxManager;
    private bamlOptions;
    constructor(runtime: BamlRuntime, ctxManager: BamlCtxManager, bamlOptions?: BamlCallOptions);
    FinanceAgent(context: string, __baml_options__?: BamlCallOptions): BamlStream<partial_types.TrackExpense | partial_types.GetBudgetSummary | partial_types.GetInvestmentInfo | partial_types.CalculateSavingsGoal | partial_types.FinanceRespond | partial_types.FinanceDone, types.TrackExpense | types.GetBudgetSummary | types.GetInvestmentInfo | types.CalculateSavingsGoal | types.FinanceRespond | types.FinanceDone>;
    MainCoordinator(context: string, __baml_options__?: BamlCallOptions): BamlStream<partial_types.InvokeTravelAgent | partial_types.InvokeRecipeAgent | partial_types.InvokeFinanceAgent | partial_types.CoordinatorRespond | partial_types.CoordinatorDone, types.InvokeTravelAgent | types.InvokeRecipeAgent | types.InvokeFinanceAgent | types.CoordinatorRespond | types.CoordinatorDone>;
    RecipeAgent(context: string, __baml_options__?: BamlCallOptions): BamlStream<partial_types.SearchRecipes | partial_types.GetNutrition | partial_types.PlanMeal | partial_types.CreateShoppingList | partial_types.RecipeRespond | partial_types.RecipeDone, types.SearchRecipes | types.GetNutrition | types.PlanMeal | types.CreateShoppingList | types.RecipeRespond | types.RecipeDone>;
    TravelAgent(context: string, __baml_options__?: BamlCallOptions): BamlStream<partial_types.GetWeather | partial_types.SearchFlights | partial_types.SearchHotels | partial_types.BookTrip | partial_types.RespondToUser | partial_types.Done, types.GetWeather | types.SearchFlights | types.SearchHotels | types.BookTrip | types.RespondToUser | types.Done>;
}
export declare const b: BamlAsyncClient;
export {};
