/*************************************************************************************************

Welcome to Baml! To use this generated code, please run one of the following:

$ npm install @boundaryml/baml
$ yarn add @boundaryml/baml
$ pnpm add @boundaryml/baml

*************************************************************************************************/
/**
 * Recursively partial type that can be null.
 *
 * @deprecated Use types from the `partial_types` namespace instead, which provides type-safe partial implementations
 * @template T The type to make recursively partial.
 */
export type RecursivePartialNull<T> = T extends object ? {
    [P in keyof T]?: RecursivePartialNull<T[P]>;
} : T | null;
export interface Checked<T, CheckName extends string = string> {
    value: T;
    checks: Record<CheckName, Check>;
}
export interface Check {
    name: string;
    expr: string;
    status: "succeeded" | "failed";
}
export declare function all_succeeded<CheckName extends string>(checks: Record<CheckName, Check>): boolean;
export declare function get_checks<CheckName extends string>(checks: Record<CheckName, Check>): Check[];
export interface BookTrip {
    intent: "book_trip";
    destination: string;
    startDate: string;
    endDate: string;
}
export interface CalculateSavingsGoal {
    intent: "calculate_savings_goal";
    targetAmount: number;
    currentSavings: number;
    monthlyContribution: number;
}
export interface CoordinatorDone {
    intent: "done";
    message?: string | null;
}
export interface CoordinatorRespond {
    intent: "respond";
    message: string;
}
export interface CreateShoppingList {
    intent: "create_shopping_list";
    recipes: string[];
}
export interface Done {
    intent: "done";
    message: string;
}
export interface FinanceDone {
    intent: "done";
    message: string;
}
export interface FinanceRespond {
    intent: "respond";
    message: string;
}
export interface GetBudgetSummary {
    intent: "get_budget_summary";
    period: string;
}
export interface GetInvestmentInfo {
    intent: "get_investment_info";
    symbol: string;
}
export interface GetNutrition {
    intent: "get_nutrition";
    ingredient: string;
}
export interface GetWeather {
    intent: "get_weather";
    city: string;
}
export interface InvokeFinanceAgent {
    intent: "invoke_finance_agent";
    query?: string | null;
}
export interface InvokeRecipeAgent {
    intent: "invoke_recipe_agent";
    query?: string | null;
}
export interface InvokeTravelAgent {
    intent: "invoke_travel_agent";
    query?: string | null;
}
export interface PlanMeal {
    intent: "plan_meal";
    mealType: string;
    preferences: string[];
}
export interface RecipeDone {
    intent: "done";
    message: string;
}
export interface RecipeRespond {
    intent: "respond";
    message: string;
}
export interface RespondToUser {
    intent: "respond";
    message: string;
}
export interface SearchFlights {
    intent: "search_flights";
    from: string;
    to: string;
    date: string;
}
export interface SearchHotels {
    intent: "search_hotels";
    city: string;
    checkIn: string;
    checkOut: string;
}
export interface SearchRecipes {
    intent: "search_recipes";
    ingredients: string[];
    dietary?: string | null;
}
export interface TrackExpense {
    intent: "track_expense";
    category: string;
    amount: number;
    description: string;
}
export type CoordinatorTools = InvokeTravelAgent | InvokeRecipeAgent | InvokeFinanceAgent | CoordinatorRespond | CoordinatorDone;
export type FinanceTools = TrackExpense | GetBudgetSummary | GetInvestmentInfo | CalculateSavingsGoal | FinanceRespond | FinanceDone;
export type RecipeTools = SearchRecipes | GetNutrition | PlanMeal | CreateShoppingList | RecipeRespond | RecipeDone;
export type TravelTools = GetWeather | SearchFlights | SearchHotels | BookTrip | RespondToUser | Done;
