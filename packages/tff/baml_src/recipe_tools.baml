// Recipe Agent Tools
class SearchRecipes {
  intent "search_recipes"
  ingredients string[]
  dietary string? @description("Optional dietary restriction")
}

class GetNutrition {
  intent "get_nutrition"
  ingredient string
}

class PlanMeal {
  intent "plan_meal"
  mealType string
  preferences string[]
}

class CreateShoppingList {
  intent "create_shopping_list"
  recipes string[]
}

class RecipeRespond {
  intent "respond"
  message string
}

class RecipeDone {
  intent "done"
  message string @description("Summary of what was accomplished")
}

type RecipeTools = SearchRecipes | GetNutrition | PlanMeal | CreateShoppingList | RecipeRespond | RecipeDone

