import { DealInputData, ScorecardResult } from "./types"

// Configurable weights (could be stored in DB)
const WEIGHTS = {
  market: 0.15,
  team: 0.20, // Placeholder - would need team data
  traction: 0.25,
  unitEconomics: 0.20,
  cashRunway: 0.15,
  dealTerms: 0.05,
}

export function calculateScorecard(data: DealInputData): ScorecardResult {
  const explanations: Record<string, string> = {}
  
  // Market score (simplified - would need market size, competition, etc.)
  const marketScore = calculateMarketScore(data)
  explanations.market = marketScore >= 70 
    ? "Strong market indicators" 
    : marketScore >= 50 
    ? "Moderate market opportunity" 
    : "Limited market visibility"
  
  // Team score (placeholder - would need team data)
  const teamScore = 50 // Default neutral score
  explanations.team = "Team data not provided"
  
  // Traction score
  const tractionScore = calculateTractionScore(data)
  explanations.traction = tractionScore >= 70
    ? "Strong traction metrics"
    : tractionScore >= 50
    ? "Moderate traction"
    : "Limited traction data"
  
  // Unit economics score
  const unitEconomicsScore = calculateUnitEconomicsScore(data)
  explanations.unitEconomics = unitEconomicsScore >= 70
    ? "Strong unit economics"
    : unitEconomicsScore >= 50
    ? "Moderate unit economics"
    : "Weak unit economics"
  
  // Cash/Runway score
  const cashRunwayScore = calculateCashRunwayScore(data)
  explanations.cashRunway = cashRunwayScore >= 70
    ? "Adequate runway and cash management"
    : cashRunwayScore >= 50
    ? "Moderate runway concerns"
    : "Critical runway situation"
  
  // Deal terms score
  const dealTermsScore = calculateDealTermsScore(data)
  explanations.dealTerms = dealTermsScore >= 70
    ? "Favorable deal terms"
    : dealTermsScore >= 50
    ? "Moderate deal terms"
    : "Unfavorable deal terms"
  
  const overall = Math.round(
    marketScore * WEIGHTS.market +
    teamScore * WEIGHTS.team +
    tractionScore * WEIGHTS.traction +
    unitEconomicsScore * WEIGHTS.unitEconomics +
    cashRunwayScore * WEIGHTS.cashRunway +
    dealTermsScore * WEIGHTS.dealTerms
  )
  
  return {
    overall,
    categories: {
      market: marketScore,
      team: teamScore,
      traction: tractionScore,
      unitEconomics: unitEconomicsScore,
      cashRunway: cashRunwayScore,
      dealTerms: dealTermsScore,
    },
    explanations,
  }
}

function calculateMarketScore(data: DealInputData): number {
  let score = 50 // Base score
  
  if (data.sector) score += 10
  if (data.geography) score += 10
  if (data.stage) {
    // Later stage = more market validation
    const stageScores: Record<string, number> = {
      "pre-seed": 0,
      "seed": 10,
      "series-a": 20,
      "series-b": 30,
    }
    score += stageScores[data.stage.toLowerCase()] || 0
  }
  
  return Math.min(100, score)
}

function calculateTractionScore(data: DealInputData): number {
  let score = 0
  
  // Revenue indicators
  if (data.arr) {
    if (data.arr > 1000000) score += 30
    else if (data.arr > 500000) score += 20
    else if (data.arr > 100000) score += 10
  } else if (data.mrr) {
    const arr = data.mrr * 12
    if (arr > 1000000) score += 30
    else if (arr > 500000) score += 20
    else if (arr > 100000) score += 10
  }
  
  // Growth rate
  if (data.growthRate) {
    if (data.growthRate > 20) score += 25 // MoM growth
    else if (data.growthRate > 10) score += 15
    else if (data.growthRate > 5) score += 10
  }
  
  // Retention
  if (data.retention) {
    if (data.retention > 90) score += 20
    else if (data.retention > 80) score += 15
    else if (data.retention > 70) score += 10
  } else if (data.churn !== undefined) {
    const retention = 100 - data.churn
    if (retention > 90) score += 20
    else if (retention > 80) score += 15
    else if (retention > 70) score += 10
  }
  
  // Active users
  if (data.activeUsers) {
    if (data.activeUsers > 100000) score += 15
    else if (data.activeUsers > 10000) score += 10
    else if (data.activeUsers > 1000) score += 5
  }
  
  return Math.min(100, score)
}

function calculateUnitEconomicsScore(data: DealInputData): number {
  let score = 50 // Base score
  
  // LTV:CAC ratio
  if (data.ltv !== undefined && data.cac !== undefined && data.cac > 0) {
    const ratio = data.ltv / data.cac
    if (ratio >= 5) score += 30
    else if (ratio >= 3) score += 20
    else if (ratio >= 2) score += 10
    else score -= 20
  }
  
  // Payback period
  if (data.payback !== undefined) {
    if (data.payback <= 6) score += 20
    else if (data.payback <= 12) score += 10
    else if (data.payback > 18) score -= 15
  }
  
  // Gross margin
  if (data.grossMargin !== undefined) {
    if (data.grossMargin >= 80) score += 20
    else if (data.grossMargin >= 60) score += 10
    else if (data.grossMargin < 40) score -= 15
  }
  
  return Math.min(100, Math.max(0, score))
}

function calculateCashRunwayScore(data: DealInputData): number {
  let score = 50 // Base score
  
  if (data.runway !== undefined) {
    if (data.runway >= 18) score += 30
    else if (data.runway >= 12) score += 20
    else if (data.runway >= 6) score += 10
    else if (data.runway < 3) score -= 30
  }
  
  // Burn efficiency (would need more context)
  if (data.burn !== undefined && data.arr !== undefined && data.arr > 0) {
    const burnMultiple = (data.burn * 12) / data.arr
    if (burnMultiple < 1) score += 20 // Efficient
    else if (burnMultiple < 2) score += 10
    else if (burnMultiple > 3) score -= 15
  }
  
  return Math.min(100, Math.max(0, score))
}

function calculateDealTermsScore(data: DealInputData): number {
  let score = 50 // Base score
  
  // Valuation reasonableness (simplified)
  if (data.currentValuation && data.arr && data.arr > 0) {
    const arrMultiple = data.currentValuation / data.arr
    if (arrMultiple <= 10) score += 20 // Reasonable
    else if (arrMultiple <= 20) score += 10
    else if (arrMultiple > 50) score -= 20 // Overvalued
  }
  
  // Option pool
  if (data.optionPool !== undefined) {
    if (data.optionPool >= 15 && data.optionPool <= 20) score += 10
    else if (data.optionPool < 10) score -= 10
  }
  
  return Math.min(100, Math.max(0, score))
}

