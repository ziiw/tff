/*************************************************************************************************

Welcome to Baml! To use this generated code, please run one of the following:

$ npm install @boundaryml/baml
$ yarn add @boundaryml/baml
$ pnpm add @boundaryml/baml

*************************************************************************************************/
/******************************************************************************
*
*  These types are used for streaming, for when an instance of a type
*  is still being built up and any of its fields is not yet fully available.
*
******************************************************************************/
export interface StreamState<T> {
    value: T;
    state: "Pending" | "Incomplete" | "Complete";
}
export declare namespace partial_types {
    interface BookTrip {
        intent?: "book_trip" | null;
        destination?: string | null;
        startDate?: string | null;
        endDate?: string | null;
    }
    interface CalculateSavingsGoal {
        intent?: "calculate_savings_goal" | null;
        targetAmount?: number | null;
        currentSavings?: number | null;
        monthlyContribution?: number | null;
    }
    interface CoordinatorDone {
        intent?: "done" | null;
        message?: string | null;
    }
    interface CoordinatorRespond {
        intent?: "respond" | null;
        message?: string | null;
    }
    interface CreateShoppingList {
        intent?: "create_shopping_list" | null;
        recipes: string[];
    }
    interface Done {
        intent?: "done" | null;
        message?: string | null;
    }
    interface FinanceDone {
        intent?: "done" | null;
        message?: string | null;
    }
    interface FinanceRespond {
        intent?: "respond" | null;
        message?: string | null;
    }
    interface GetBudgetSummary {
        intent?: "get_budget_summary" | null;
        period?: string | null;
    }
    interface GetInvestmentInfo {
        intent?: "get_investment_info" | null;
        symbol?: string | null;
    }
    interface GetNutrition {
        intent?: "get_nutrition" | null;
        ingredient?: string | null;
    }
    interface GetWeather {
        intent?: "get_weather" | null;
        city?: string | null;
    }
    interface InvokeFinanceAgent {
        intent?: "invoke_finance_agent" | null;
        query?: string | null;
    }
    interface InvokeRecipeAgent {
        intent?: "invoke_recipe_agent" | null;
        query?: string | null;
    }
    interface InvokeTravelAgent {
        intent?: "invoke_travel_agent" | null;
        query?: string | null;
    }
    interface PlanMeal {
        intent?: "plan_meal" | null;
        mealType?: string | null;
        preferences: string[];
    }
    interface RecipeDone {
        intent?: "done" | null;
        message?: string | null;
    }
    interface RecipeRespond {
        intent?: "respond" | null;
        message?: string | null;
    }
    interface RespondToUser {
        intent?: "respond" | null;
        message?: string | null;
    }
    interface SearchFlights {
        intent?: "search_flights" | null;
        from?: string | null;
        to?: string | null;
        date?: string | null;
    }
    interface SearchHotels {
        intent?: "search_hotels" | null;
        city?: string | null;
        checkIn?: string | null;
        checkOut?: string | null;
    }
    interface SearchRecipes {
        intent?: "search_recipes" | null;
        ingredients: string[];
        dietary?: string | null;
    }
    interface TrackExpense {
        intent?: "track_expense" | null;
        category?: string | null;
        amount?: number | null;
        description?: string | null;
    }
    type CoordinatorTools = InvokeTravelAgent | InvokeRecipeAgent | InvokeFinanceAgent | CoordinatorRespond | CoordinatorDone | null;
    type FinanceTools = TrackExpense | GetBudgetSummary | GetInvestmentInfo | CalculateSavingsGoal | FinanceRespond | FinanceDone | null;
    type RecipeTools = SearchRecipes | GetNutrition | PlanMeal | CreateShoppingList | RecipeRespond | RecipeDone | null;
    type TravelTools = GetWeather | SearchFlights | SearchHotels | BookTrip | RespondToUser | Done | null;
}
