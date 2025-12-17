import { DealInputData, AnalysisResult } from "./types"
import { validateDealInput } from "./validate"
import { calculateScorecard } from "./scorecard"
import { generateScenarios } from "./scenarios"
import { recommendCheckSize, InvestorProfile } from "./recommendCheckSize"

export async function analyzeDeal(
  dealId: string,
  data: DealInputData,
  investorProfile: InvestorProfile
): Promise<AnalysisResult> {
  // Validate inputs
  const validation = validateDealInput(data)
  
  // Calculate scorecard
  const scorecard = calculateScorecard(data)
  
  // Generate scenarios
  const scenarios = generateScenarios(data, 24)
  
  // Recommend check size
  const recommendedCheckSize = recommendCheckSize(data, scorecard, investorProfile)
  
  // Compile assumptions
  const assumptions = {
    validationWeights: "standard",
    scenarioMonths: 24,
    growthRate: data.growthRate || 0,
    investorProfile,
  }
  
  return {
    dealId,
    version: 1,
    score: scorecard.overall,
    validation,
    scorecard,
    scenarios,
    recommendedCheckSize,
    assumptions,
    createdAt: new Date(),
  }
}

export * from "./types"
export * from "./validate"
export * from "./scorecard"
export * from "./scenarios"
export * from "./recommendCheckSize"

