import { DealInputData, ScorecardResult } from "./types"

export interface InvestorProfile {
  fundSize?: number
  targetStage?: string[]
  targetOwnership?: number
  maxCheck?: number
  minCheck?: number
  concentrationLimit?: number
}

export interface CheckSizeRecommendation {
  min: number
  max: number
  recommended: number
  rationale: string
}

export function recommendCheckSize(
  data: DealInputData,
  scorecard: ScorecardResult,
  investorProfile: InvestorProfile
): CheckSizeRecommendation {
  const {
    fundSize = 10000000, // Default $10M fund
    targetOwnership = 0.05, // Default 5%
    maxCheck = 500000, // Default $500k max
    minCheck = 25000, // Default $25k min
    concentrationLimit = 0.10, // Default 10% of fund
  } = investorProfile
  
  // Base recommendation from target ownership
  const currentValuation = data.currentValuation || estimateValuation(data)
  let recommended = currentValuation * targetOwnership
  
  // Adjust based on scorecard
  const scoreMultiplier = scorecard.overall / 100
  recommended = recommended * scoreMultiplier
  
  // Adjust based on stage
  if (data.stage) {
    const stageMultipliers: Record<string, number> = {
      "pre-seed": 0.5,
      "seed": 0.75,
      "series-a": 1.0,
      "series-b": 1.25,
    }
    recommended = recommended * (stageMultipliers[data.stage.toLowerCase()] || 1.0)
  }
  
  // Clamp to investor constraints
  const maxFromFund = fundSize * concentrationLimit
  const maxCheckSize = Math.min(maxCheck, maxFromFund)
  
  recommended = Math.max(minCheck, Math.min(maxCheckSize, recommended))
  
  // Calculate range (±20% of recommended)
  const min = Math.max(minCheck, recommended * 0.8)
  const max = Math.min(maxCheckSize, recommended * 1.2)
  
  // Generate rationale
  const rationale = generateRationale(
    recommended,
    min,
    max,
    scorecard,
    investorProfile,
    currentValuation
  )
  
  return {
    min: Math.round(min),
    max: Math.round(max),
    recommended: Math.round(recommended),
    rationale,
  }
}

function estimateValuation(data: DealInputData): number {
  // Simple heuristic: ARR multiple based on stage
  const arr = data.arr || (data.mrr ? data.mrr * 12 : 0)
  
  if (arr === 0) return 5000000 // Default $5M for pre-revenue
  
  const stage = data.stage?.toLowerCase() || "seed"
  const multiples: Record<string, number> = {
    "pre-seed": 5,
    "seed": 10,
    "series-a": 15,
    "series-b": 20,
  }
  
  const multiple = multiples[stage] || 10
  return arr * multiple
}

function generateRationale(
  recommended: number,
  min: number,
  max: number,
  scorecard: ScorecardResult,
  investorProfile: InvestorProfile,
  valuation: number
): string {
  const parts: string[] = []
  
  parts.push(`Recommended check size: $${recommended.toLocaleString()}`)
  
  if (investorProfile.targetOwnership) {
    const ownership = (recommended / valuation) * 100
    parts.push(`This would represent approximately ${ownership.toFixed(1)}% ownership.`)
  }
  
  if (scorecard.overall >= 70) {
    parts.push("Strong overall scorecard supports this investment size.")
  } else if (scorecard.overall < 50) {
    parts.push("Lower scorecard suggests a more conservative approach.")
  }
  
  if (investorProfile.concentrationLimit) {
    const fundPercent = (recommended / (investorProfile.fundSize || 1)) * 100
    parts.push(`This represents ${fundPercent.toFixed(1)}% of your fund size.`)
  }
  
  parts.push(`Recommended range: $${min.toLocaleString()} - $${max.toLocaleString()}`)
  
  return parts.join(" ")
}

