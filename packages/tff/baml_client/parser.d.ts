/*************************************************************************************************

Welcome to Baml! To use this generated code, please run one of the following:

$ npm install @boundaryml/baml
$ yarn add @boundaryml/baml
$ pnpm add @boundaryml/baml

*************************************************************************************************/
import type { BamlRuntime, BamlCtxManager, ClientRegistry } from "@boundaryml/baml";
import type { partial_types } from "./partial_types";
import type * as types from "./types";
import type TypeBuilder from "./type_builder";
export declare class LlmResponseParser {
    private runtime;
    private ctxManager;
    constructor(runtime: BamlRuntime, ctxManager: BamlCtxManager);
    FinanceAgent(llmResponse: string, __baml_options__?: {
        tb?: TypeBuilder;
        clientRegistry?: ClientRegistry;
        env?: Record<string, string | undefined>;
    }): types.TrackExpense | types.GetBudgetSummary | types.GetInvestmentInfo | types.CalculateSavingsGoal | types.FinanceRespond | types.FinanceDone;
    MainCoordinator(llmResponse: string, __baml_options__?: {
        tb?: TypeBuilder;
        clientRegistry?: ClientRegistry;
        env?: Record<string, string | undefined>;
    }): types.InvokeTravelAgent | types.InvokeRecipeAgent | types.InvokeFinanceAgent | types.CoordinatorRespond | types.CoordinatorDone;
    RecipeAgent(llmResponse: string, __baml_options__?: {
        tb?: TypeBuilder;
        clientRegistry?: ClientRegistry;
        env?: Record<string, string | undefined>;
    }): types.SearchRecipes | types.GetNutrition | types.PlanMeal | types.CreateShoppingList | types.RecipeRespond | types.RecipeDone;
    TravelAgent(llmResponse: string, __baml_options__?: {
        tb?: TypeBuilder;
        clientRegistry?: ClientRegistry;
        env?: Record<string, string | undefined>;
    }): types.GetWeather | types.SearchFlights | types.SearchHotels | types.BookTrip | types.RespondToUser | types.Done;
}
export declare class LlmStreamParser {
    private runtime;
    private ctxManager;
    constructor(runtime: BamlRuntime, ctxManager: BamlCtxManager);
    FinanceAgent(llmResponse: string, __baml_options__?: {
        tb?: TypeBuilder;
        clientRegistry?: ClientRegistry;
        env?: Record<string, string | undefined>;
    }): partial_types.TrackExpense | partial_types.GetBudgetSummary | partial_types.GetInvestmentInfo | partial_types.CalculateSavingsGoal | partial_types.FinanceRespond | partial_types.FinanceDone;
    MainCoordinator(llmResponse: string, __baml_options__?: {
        tb?: TypeBuilder;
        clientRegistry?: ClientRegistry;
        env?: Record<string, string | undefined>;
    }): partial_types.InvokeTravelAgent | partial_types.InvokeRecipeAgent | partial_types.InvokeFinanceAgent | partial_types.CoordinatorRespond | partial_types.CoordinatorDone;
    RecipeAgent(llmResponse: string, __baml_options__?: {
        tb?: TypeBuilder;
        clientRegistry?: ClientRegistry;
        env?: Record<string, string | undefined>;
    }): partial_types.SearchRecipes | partial_types.GetNutrition | partial_types.PlanMeal | partial_types.CreateShoppingList | partial_types.RecipeRespond | partial_types.RecipeDone;
    TravelAgent(llmResponse: string, __baml_options__?: {
        tb?: TypeBuilder;
        clientRegistry?: ClientRegistry;
        env?: Record<string, string | undefined>;
    }): partial_types.GetWeather | partial_types.SearchFlights | partial_types.SearchHotels | partial_types.BookTrip | partial_types.RespondToUser | partial_types.Done;
}
