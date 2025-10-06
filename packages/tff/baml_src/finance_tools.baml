// Finance Agent Tools
class TrackExpense {
  intent "track_expense"
  category string
  amount float
  description string
}

class GetBudgetSummary {
  intent "get_budget_summary"
  period string
}

class GetInvestmentInfo {
  intent "get_investment_info"
  symbol string
}

class CalculateSavingsGoal {
  intent "calculate_savings_goal"
  targetAmount float
  currentSavings float
  monthlyContribution float
}

class FinanceRespond {
  intent "respond"
  message string
}

class FinanceDone {
  intent "done"
  message string @description("Summary of what was accomplished")
}

type FinanceTools = TrackExpense | GetBudgetSummary | GetInvestmentInfo | CalculateSavingsGoal | FinanceRespond | FinanceDone


