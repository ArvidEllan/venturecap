import { DealInputData, ScenarioOutcome } from "./types"

export function generateScenarios(data: DealInputData, months: number = 24): ScenarioOutcome[] {
  const currentRevenue = data.arr ? data.arr / 12 : data.mrr || 0
  const currentBurn = data.burn || 0
  const currentRunway = data.runway || 0
  const growthRate = data.growthRate || 0 // MoM growth
  
  // Base scenario: current growth rate continues
  const base = generateScenario(
    "base",
    currentRevenue,
    currentBurn,
    currentRunway,
    growthRate,
    months,
    { growthRate, burnChange: 0 }
  )
  
  // Upside: 1.5x growth rate, 0.8x burn
  const upside = generateScenario(
    "upside",
    currentRevenue,
    currentBurn,
    currentRunway,
    growthRate * 1.5,
    months,
    { growthRate: growthRate * 1.5, burnChange: -0.2 }
  )
  
  // Downside: 0.5x growth rate, 1.2x burn
  const downside = generateScenario(
    "downside",
    currentRevenue,
    currentBurn,
    currentRunway,
    growthRate * 0.5,
    months,
    { growthRate: growthRate * 0.5, burnChange: 0.2 }
  )
  
  return [base, upside, downside]
}

function generateScenario(
  scenario: "base" | "upside" | "downside",
  startRevenue: number,
  startBurn: number,
  startRunway: number,
  growthRate: number,
  months: number,
  assumptions: Record<string, any>
): ScenarioOutcome {
  const revenue: number[] = []
  const burn: number[] = []
  const runway: number[] = []
  
  let currentRevenue = startRevenue
  let currentBurn = startBurn
  let cashBalance = startRunway * currentBurn // Approximate
  
  for (let i = 0; i < months; i++) {
    // Revenue growth (MoM)
    currentRevenue = currentRevenue * (1 + growthRate / 100)
    revenue.push(currentRevenue * 12) // Convert to ARR
    
    // Burn changes over time (simplified)
    if (i > 0) {
      currentBurn = currentBurn * (1 + assumptions.burnChange / 12) // Gradual change
    }
    burn.push(currentBurn)
    
    // Runway calculation
    if (currentBurn > 0) {
      const monthsRemaining = cashBalance / currentBurn
      runway.push(monthsRemaining)
      cashBalance = cashBalance - currentBurn
    } else {
      runway.push(Infinity)
    }
  }
  
  return {
    scenario,
    revenue,
    burn,
    runway,
    assumptions: {
      ...assumptions,
      startRevenue,
      startBurn,
      startRunway,
    },
  }
}

