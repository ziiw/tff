// Main Coordinator Tools
class InvokeTravelAgent {
  intent "invoke_travel_agent"
  query string? @description("Optional context about the travel query")
}

class InvokeRecipeAgent {
  intent "invoke_recipe_agent"
  query string? @description("Optional context about the recipe query")
}

class InvokeFinanceAgent {
  intent "invoke_finance_agent"
  query string? @description("Optional context about the finance query")
}

class CoordinatorRespond {
  intent "respond"
  message string
}

class CoordinatorDone {
  intent "done"
  message string? @description("Summary of what was accomplished")
}

type CoordinatorTools = InvokeTravelAgent | InvokeRecipeAgent | InvokeFinanceAgent | CoordinatorRespond | CoordinatorDone

