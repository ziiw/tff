/*************************************************************************************************

Welcome to Baml! To use this generated code, please run one of the following:

$ npm install @boundaryml/baml
$ yarn add @boundaryml/baml
$ pnpm add @boundaryml/baml

*************************************************************************************************/
import { FieldType } from '@boundaryml/baml/native';
import { EnumBuilder, ClassBuilder, ClassViewer } from '@boundaryml/baml/type_builder';
export { FieldType, EnumBuilder, ClassBuilder };
export default class TypeBuilder {
    private tb;
    BookTrip: ClassViewer<'BookTrip', "intent" | "destination" | "startDate" | "endDate">;
    CalculateSavingsGoal: ClassViewer<'CalculateSavingsGoal', "intent" | "targetAmount" | "currentSavings" | "monthlyContribution">;
    CoordinatorDone: ClassViewer<'CoordinatorDone', "intent" | "message">;
    CoordinatorRespond: ClassViewer<'CoordinatorRespond', "intent" | "message">;
    CreateShoppingList: ClassViewer<'CreateShoppingList', "intent" | "recipes">;
    Done: ClassViewer<'Done', "intent" | "message">;
    FinanceDone: ClassViewer<'FinanceDone', "intent" | "message">;
    FinanceRespond: ClassViewer<'FinanceRespond', "intent" | "message">;
    GetBudgetSummary: ClassViewer<'GetBudgetSummary', "intent" | "period">;
    GetInvestmentInfo: ClassViewer<'GetInvestmentInfo', "intent" | "symbol">;
    GetNutrition: ClassViewer<'GetNutrition', "intent" | "ingredient">;
    GetWeather: ClassViewer<'GetWeather', "intent" | "city">;
    InvokeFinanceAgent: ClassViewer<'InvokeFinanceAgent', "intent" | "query">;
    InvokeRecipeAgent: ClassViewer<'InvokeRecipeAgent', "intent" | "query">;
    InvokeTravelAgent: ClassViewer<'InvokeTravelAgent', "intent" | "query">;
    PlanMeal: ClassViewer<'PlanMeal', "intent" | "mealType" | "preferences">;
    RecipeDone: ClassViewer<'RecipeDone', "intent" | "message">;
    RecipeRespond: ClassViewer<'RecipeRespond', "intent" | "message">;
    RespondToUser: ClassViewer<'RespondToUser', "intent" | "message">;
    SearchFlights: ClassViewer<'SearchFlights', "intent" | "from" | "to" | "date">;
    SearchHotels: ClassViewer<'SearchHotels', "intent" | "city" | "checkIn" | "checkOut">;
    SearchRecipes: ClassViewer<'SearchRecipes', "intent" | "ingredients" | "dietary">;
    TrackExpense: ClassViewer<'TrackExpense', "intent" | "category" | "amount" | "description">;
    constructor();
    reset(): void;
    __tb(): import("@boundaryml/baml/native").TypeBuilder;
    string(): FieldType;
    literalString(value: string): FieldType;
    literalInt(value: number): FieldType;
    literalBool(value: boolean): FieldType;
    int(): FieldType;
    float(): FieldType;
    bool(): FieldType;
    list(type: FieldType): FieldType;
    null(): FieldType;
    map(key: FieldType, value: FieldType): FieldType;
    union(types: FieldType[]): FieldType;
    addClass<Name extends string>(name: Name): ClassBuilder<Name>;
    addEnum<Name extends string>(name: Name): EnumBuilder<Name>;
    addBaml(baml: string): void;
}
