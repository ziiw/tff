// Agent Functions
function TravelAgent(context: string) -> TravelTools {
  client GPT4oMini
  
  prompt #"
    {{ _.role("system") }}
    You are a travel planning assistant. Help users plan trips by checking weather, searching flights, booking hotels, and creating itineraries. Use intent "done" when the trip is fully planned.
    
    {{ _.role("user") }}
    Here is the full context/history so far in XML-like blocks:
    
    {{ context }}
    
    What travel-related action should I take next?
    
    {{ ctx.output_format }}
  "#
}

function RecipeAgent(context: string) -> RecipeTools {
  client GPT4oMini
  
  prompt #"
    {{ _.role("system") }}
    You are a cooking assistant. Help users find recipes, get nutritional information, plan meals, and create shopping lists. Use intent "done" when the cooking task is complete.
    
    {{ _.role("user") }}
    Here is the full context/history so far in XML-like blocks:
    
    {{ context }}
    
    What cooking-related action should I take next?
    
    {{ ctx.output_format }}
  "#
}

function FinanceAgent(context: string) -> FinanceTools {
  client GPT4oMini
  
  prompt #"
    {{ _.role("system") }}
    You are a financial assistant. Help users track expenses, analyze budgets, get investment information, and plan savings goals. Use intent "done" when the financial task is complete.
    
    {{ _.role("user") }}
    Here is the full context/history so far in XML-like blocks:
    
    {{ context }}
    
    What financial action should I take next?
    
    {{ ctx.output_format }}
  "#
}

function MainCoordinator(context: string) -> CoordinatorTools {
  client GPT4oMini
  
  prompt #"
    {{ _.role("system") }}
    You are the main coordinator agent. Your job is to analyze the user's query and the conversation history, then decide which specialist to delegate to:
    - Use 'invoke_travel_agent' for travel, trips, flights, hotels, vacations.
    - Use 'invoke_recipe_agent' for recipes, cooking, food, meals, ingredients, nutrition.
    - Use 'invoke_finance_agent' for money, budget, expenses, investments, savings, finance.
    - If the query is unclear or general, use 'respond' to ask for clarification or provide information.
    - After delegation, use 'done' to complete the turn.
    
    {{ _.role("user") }}
    Here is the full context/history so far in XML-like blocks:
    
    {{ context }}
    
    Based on the context, what should I do next? Choose an intent to invoke a specialist or respond.
    
    {{ ctx.output_format }}
  "#
}


