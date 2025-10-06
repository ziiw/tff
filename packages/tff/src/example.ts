import { createDefaultRuntime, createTool, agent, createMainAgent, createThread, appendEvent, execute, Event, AgentRuntime, AgentLogger } from './index';
import * as readline from 'readline';

// Mock data for various tools
const mockWeatherData = {
  'New York': { temp: 72, condition: 'Sunny', humidity: 65 },
  'London': { temp: 15, condition: 'Cloudy', humidity: 80 },
  'Tokyo': { temp: 25, condition: 'Rainy', humidity: 75 },
  'Paris': { temp: 20, condition: 'Partly Cloudy', humidity: 60 },
};

const mockFlightData = {
  'NYC-LHR': { price: 850, airline: 'British Airways', duration: '7h 30m' },
  'NYC-NRT': { price: 1200, airline: 'ANA', duration: '14h 15m' },
  'LHR-CDG': { price: 150, airline: 'Eurostar', duration: '2h 15m' },
};

const mockHotelData = {
  'New York': [
    { name: 'The Plaza', price: 450, rating: 4.5 },
    { name: 'Hilton Midtown', price: 280, rating: 4.2 },
  ],
  'London': [
    { name: 'The Savoy', price: 380, rating: 4.7 },
    { name: 'Premier Inn', price: 120, rating: 4.0 },
  ],
};

const mockRecipes = [
  { name: 'Spaghetti Carbonara', ingredients: ['pasta', 'eggs', 'bacon', 'parmesan'], calories: 650 },
  { name: 'Chicken Stir Fry', ingredients: ['chicken', 'vegetables', 'soy sauce', 'rice'], calories: 450 },
  { name: 'Vegetable Curry', ingredients: ['vegetables', 'coconut milk', 'curry paste', 'rice'], calories: 380 },
];

const mockIngredients = {
  'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  'pasta': { calories: 157, protein: 5.8, carbs: 31, fat: 0.9 },
};

const mockExpenses: Array<{ category: string; amount: number; date: string }> = [
  { category: 'food', amount: 150, date: '2024-01-15' },
  { category: 'transport', amount: 75, date: '2024-01-16' },
  { category: 'entertainment', amount: 200, date: '2024-01-17' },
];

const mockInvestments = {
  'AAPL': { price: 175.50, change: '+2.3%', sector: 'Technology' },
  'GOOGL': { price: 142.80, change: '-1.2%', sector: 'Technology' },
  'TSLA': { price: 248.90, change: '+5.7%', sector: 'Automotive' },
};

// Travel Agent Tools
const weatherTool = createTool<{ city: string }, { city: string; temp: number; condition: string; humidity: number }>({
  intent: 'get_weather',
  description: 'Get current weather for a city',
  execute: async (args) => {
    const data = mockWeatherData[args.city as keyof typeof mockWeatherData];
    if (!data) {
      return { ok: false, error: { name: 'NotFoundError', message: `Weather data not available for ${args.city}` } };
    }
    return { ok: true, result: { city: args.city, ...data } };
  },
});

const flightSearchTool = createTool<{ from: string; to: string; date: string }, { route: string; price: number; airline: string; duration: string }>({
  intent: 'search_flights',
  description: 'Search for flights between cities',
  execute: async (args) => {
    const route = `${args.from}-${args.to}`;
    const data = mockFlightData[route as keyof typeof mockFlightData];
    if (!data) {
      return { ok: false, error: { name: 'NotFoundError', message: `No flights found for route ${route}` } };
    }
    return { ok: true, result: { route, ...data } };
  },
});

const hotelSearchTool = createTool<{ city: string; checkIn: string; checkOut: string }, { city: string; hotels: Array<{ name: string; price: number; rating: number }> }>({
  intent: 'search_hotels',
  description: 'Search for hotels in a city',
  execute: async (args) => {
    const hotels = mockHotelData[args.city as keyof typeof mockHotelData];
    if (!hotels) {
      return { ok: false, error: { name: 'NotFoundError', message: `No hotels found in ${args.city}` } };
    }
    return { ok: true, result: { city: args.city, hotels } };
  },
});

const bookTripTool = createTool<{ destination: string; startDate: string; endDate: string }, { bookingId: string; status: string; totalCost: number }>({
  intent: 'book_trip',
  description: 'Book a complete trip package',
  execute: async (_args) => {
    const bookingId = 'BK' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const baseCost = 800;
    const totalCost = baseCost + Math.floor(Math.random() * 400);
    return { ok: true, result: { bookingId, status: 'confirmed', totalCost } };
  },
});

// Recipe Agent Tools
const searchRecipesTool = createTool<{ ingredients: string[]; dietary?: string }, { recipes: Array<{ name: string; ingredients: string[]; calories: number }> }>({
  intent: 'search_recipes',
  description: 'Search recipes by ingredients',
  execute: async (args) => {
    const matchingRecipes = mockRecipes.filter(recipe =>
      args.ingredients.some((ing: string) => recipe.ingredients.includes(ing))
    );
    return { ok: true, result: { recipes: matchingRecipes } };
  },
});

const getNutritionTool = createTool<{ ingredient: string }, { ingredient: string; nutrition: { calories: number; protein: number; carbs: number; fat: number } }>({
  intent: 'get_nutrition',
  description: 'Get nutritional information for an ingredient',
  execute: async (args) => {
    const nutrition = mockIngredients[args.ingredient as keyof typeof mockIngredients];
    if (!nutrition) {
      return { ok: false, error: { name: 'NotFoundError', message: `Nutrition data not available for ${args.ingredient}` } };
    }
    return { ok: true, result: { ingredient: args.ingredient, nutrition } };
  },
});

const planMealTool = createTool<{ mealType: string; preferences: string[] }, { mealPlan: { type: string; suggestions: string[]; totalCalories: number } }>({
  intent: 'plan_meal',
  description: 'Create a meal plan for the day',
  execute: async (args) => {
    const suggestions = mockRecipes
      .filter(recipe => recipe.ingredients.some((ing: string) => args.preferences.includes(ing)))
      .slice(0, 3)
      .map(r => r.name);

    const totalCalories = suggestions.length * 400;
    return { ok: true, result: { mealPlan: { type: args.mealType, suggestions, totalCalories } } };
  },
});

const createShoppingListTool = createTool<{ recipes: string[] }, { shoppingList: string[]; estimatedCost: number }>({
  intent: 'create_shopping_list',
  description: 'Create a shopping list from selected recipes',
  execute: async (args) => {
    const ingredients = new Set<string>();
    args.recipes.forEach((recipeName: string) => {
      const recipe = mockRecipes.find(r => r.name === recipeName);
      if (recipe) {
        recipe.ingredients.forEach((ing: string) => ingredients.add(ing));
      }
    });

    const shoppingList = Array.from(ingredients);
    const estimatedCost = shoppingList.length * 3.50; // Mock cost per item

    return { ok: true, result: { shoppingList, estimatedCost } };
  },
});

// Finance Agent Tools
const trackExpenseTool = createTool<{ category: string; amount: number; description: string }, { expenseId: string; status: string }>({
  intent: 'track_expense',
  description: 'Track a new expense',
  execute: async (args) => {
    const expenseId = 'EXP' + Math.random().toString(36).substr(2, 6).toUpperCase();
    mockExpenses.push({ category: args.category, amount: args.amount, date: new Date().toISOString().split('T')[0] });
    return { ok: true, result: { expenseId, status: 'recorded' } };
  },
});

const getBudgetSummaryTool = createTool<{ period: string }, { summary: { totalSpent: number; categories: Record<string, number>; averageDaily: number } }>({
  intent: 'get_budget_summary',
  description: 'Get budget summary for a period',
  execute: async (_args) => {
    const totalSpent = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categories: Record<string, number> = {};
    mockExpenses.forEach(exp => {
      categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
    });
    const averageDaily = totalSpent / 30; // Mock 30-day period

    return { ok: true, result: { summary: { totalSpent, categories, averageDaily } } };
  },
});

const getInvestmentInfoTool = createTool<{ symbol: string }, { symbol: string; price: number; change: string; sector: string }>({
  intent: 'get_investment_info',
  description: 'Get current investment information',
  execute: async (args) => {
    const data = mockInvestments[args.symbol as keyof typeof mockInvestments];
    if (!data) {
      return { ok: false, error: { name: 'NotFoundError', message: `Investment data not available for ${args.symbol}` } };
    }
    return { ok: true, result: { symbol: args.symbol, ...data } };
  },
});

const calculateSavingsGoalTool = createTool<{ targetAmount: number; currentSavings: number; monthlyContribution: number }, { projection: { monthsToGoal: number; totalContributions: number; interestEarned: number } }>({
  intent: 'calculate_savings_goal',
  description: 'Calculate time to reach savings goal',
  execute: async (args) => {
    const remaining = args.targetAmount - args.currentSavings;
    const monthsToGoal = Math.ceil(remaining / args.monthlyContribution);
    const totalContributions = monthsToGoal * args.monthlyContribution;
    const interestEarned = Math.floor(totalContributions * 0.02); // Mock 2% interest

    return { ok: true, result: { projection: { monthsToGoal, totalContributions, interestEarned } } };
  },
});

// Example-specific logger with travel/recipe/finance formatters
class ExampleLogger extends AgentLogger {
  constructor(config = {}) {
    super(config);
  }
  protected formatEvent(event: Event): string | null {
    // Check for example-specific events first
    switch (event.type) {
      case 'get_weather':
        const city = (event.data as any)?.city ?? 'unknown';
        return `🌤️  Getting weather for ${city}...`;

      case 'get_weather_result':
        const weatherResult = event.data as any;
        return `   → Weather: ${weatherResult.temp}°F, ${weatherResult.condition}, ${weatherResult.humidity}% humidity`;

      case 'search_flights':
        const flightData = event.data as any;
        return `✈️  Searching flights: ${flightData.from} → ${flightData.to} on ${flightData.date}...`;

      case 'search_flights_result':
        const flightResult = event.data as any;
        return `   → Found: ${flightResult.airline} - $${flightResult.price} (${flightResult.duration})`;

      case 'search_hotels':
        const hotelData = event.data as any;
        return `🏨 Searching hotels in ${hotelData.city}...`;

      case 'search_hotels_result':
        const hotelResult = event.data as any;
        const hotels = hotelResult.hotels || [];
        let output = `   → Found ${hotels.length} hotels`;
        hotels.slice(0, 2).forEach((h: any) => {
          output += `\n      • ${h.name}: $${h.price}/night (${h.rating}⭐)`;
        });
        return output;

      case 'invoke_travel_agent':
      case 'invoke_recipe_agent':
      case 'invoke_finance_agent':
        const agent = event.type.replace('invoke_', '').replace('_agent', '');
        return `\n🔀 Delegating to ${agent.toUpperCase()} specialist...`;

      case 'invoke_travel_agent_result':
      case 'invoke_recipe_agent_result':
      case 'invoke_finance_agent_result':
        const agentName = event.type.replace('invoke_', '').replace('_agent_result', '');
        const steps = (event.data as any)?.stepsTaken ?? 0;
        return `✅ ${agentName.toUpperCase()} specialist completed (${steps} steps)\n`;

      case 'assistant_message':
        // Override base class to show sub-agent messages properly
        const text = (event.data as any)?.text ?? '';
        const subAgent = event.meta?.subAgent;
        if (subAgent) {
          return `💬 ${String(subAgent).toUpperCase()}: ${text}\n`;
        }
        return `\n🤖 Response: ${text}\n`;

      default:
        // Fall back to base class formatting
        return super.formatEvent(event);
    }
  }
}

// Convenience function to create the example logger
function createExampleLogger(config = {}) {
  return new ExampleLogger(config);
}

// Agent creation helpers (auto-includes a respond tool)
function createTravelAgent(runtime: AgentRuntime) {
  return agent({
    name: 'travel-agent',
    systemPrompt: `You are a proactive travel planning assistant. Use your tools to help the user, then respond with your answer.
    
When you respond, use this exact format: {"intent": "respond", "arguments": {"message": "your helpful message here"}}`,
    tools: [weatherTool, flightSearchTool, hotelSearchTool, bookTripTool],
    maxSteps: 10,
    streaming: true,
  }, runtime);
}

function createRecipeAgent(runtime: AgentRuntime) {
  return agent({
    name: 'recipe-agent',
    systemPrompt: `You are a proactive cooking assistant. Use your tools to help the user, then respond with your answer.
    
When you respond, use this exact format: {"intent": "respond", "arguments": {"message": "your helpful message here"}}`,
    tools: [searchRecipesTool, getNutritionTool, planMealTool, createShoppingListTool],
    maxSteps: 10,
    streaming: true,
  }, runtime);
}

function createFinanceAgent(runtime: AgentRuntime) {
  return agent({
    name: 'finance-agent',
    systemPrompt: `You are a proactive financial assistant. Use your tools to help the user, then respond with your answer.
    
When you respond, use this exact format: {"intent": "respond", "arguments": {"message": "your helpful message here"}}`,
    tools: [trackExpenseTool, getBudgetSummaryTool, getInvestmentInfoTool, calculateSavingsGoalTool],
    maxSteps: 10,
    streaming: true,
  }, runtime);
}

// Main agent tools - now simplified with helpers (will be created in main())

async function main() {
  const runtime = createDefaultRuntime({
    onEvent: (event) => createExampleLogger({
      suppressStreaming: true,
      suppressSubAgentEvents: false,
    }).log(event),
  });

  // Create specialist agents
  const travelAgent = createTravelAgent(runtime);
  const recipeAgent = createRecipeAgent(runtime);
  const financeAgent = createFinanceAgent(runtime);

  // Create main coordinator agent - delegation logic is auto-generated
  const mainAgent = createMainAgent({
    name: 'main-router',
    agents: { travel: travelAgent, recipe: recipeAgent, finance: financeAgent },
    maxSteps: 5,
    streaming: true,
  }, runtime);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let mainThread = createThread('main-conversation');

  console.log('🤖 Multi-Agent CLI Assistant');
  console.log('Available specialists: Travel ✈️ | Recipes 🍳 | Finance 💰');
  console.log('Type your message or "quit" to exit\n');

  function askQuestion() {
    rl.question('You: ', async (input) => {
      if (input.toLowerCase() === 'quit') {
        console.log('Goodbye! 👋');
        rl.close();
        return;
      }

      // Append user message to main thread with full Event
      const userEvent: Event = {
        type: 'user_message',
        data: { text: input },
        ts: runtime.now().toISOString(),
        id: runtime.id(),
      };
      mainThread = appendEvent(mainThread, userEvent);

      try {
        const result = await execute(mainAgent, mainThread);
        mainThread = result.thread; // Update with new events

        if (result.status === 'failed') {
          console.log(`\n❌ Failed: ${result.lastError}\n`);
        }

      } catch (error) {
        console.error('❌ Error:', error);
      }

      askQuestion();
    });
  }

  askQuestion();
}

main().catch(err => { console.error('Fatal error:', err); process.exit(1); });



