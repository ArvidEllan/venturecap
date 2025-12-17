// Types for deal input data
export interface DealInputData {
  // Company info
  companyName: string
  stage?: string
  sector?: string
  geography?: string
  jurisdiction?: string
  
  // Revenue model
  revenueModel?: string
  pricing?: string
  grossMargin?: number
  
  // Traction
  mrr?: number
  arr?: number
  growthRate?: number // MoM or YoY
  churn?: number
  retention?: number
  activeUsers?: number
  
  // Unit economics
  cac?: number
  payback?: number // months
  ltv?: number
  contributionMargin?: number
  
  // Cash
  burn?: number // monthly burn
  runway?: number // months
  cashBalance?: number
  
  // Cap table
  currentValuation?: number
  safeTerms?: string
  existingInvestors?: string[]
  optionPool?: number // percentage
  
  // Round
  targetRaise?: number
  useOfFunds?: string
  intendedRunwayExtension?: number // months
}

export interface ValidationResult {
  isValid: boolean
  completeness: number // 0-100
  issues: ValidationIssue[]
  warnings: ValidationIssue[]
}

export interface ValidationIssue {
  field: string
  severity: "error" | "warning"
  message: string
}

export interface ScorecardResult {
  overall: number // 0-100
  categories: {
    market: number
    team: number // Placeholder - would need team data
    traction: number
    unitEconomics: number
    cashRunway: number
    dealTerms: number
  }
  explanations: Record<string, string>
}

export interface ScenarioOutcome {
  scenario: "base" | "upside" | "downside"
  revenue: number[]
  burn: number[]
  runway: number[]
  assumptions: Record<string, any>
}

export interface AnalysisResult {
  dealId: string
  version: number
  score: number
  validation: ValidationResult
  scorecard: ScorecardResult
  scenarios: ScenarioOutcome[]
  recommendedCheckSize: {
    min: number
    max: number
    recommended: number
    rationale: string
  }
  assumptions: Record<string, any>
  createdAt: Date
}

