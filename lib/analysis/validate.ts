import { DealInputData, ValidationResult, ValidationIssue } from "./types"

export function validateDealInput(data: DealInputData): ValidationResult {
  const issues: ValidationIssue[] = []
  const warnings: ValidationIssue[] = []
  
  // Required fields check
  if (!data.companyName) {
    issues.push({
      field: "companyName",
      severity: "error",
      message: "Company name is required",
    })
  }
  
  // Revenue validation
  if (data.mrr !== undefined && data.mrr < 0) {
    issues.push({
      field: "mrr",
      severity: "error",
      message: "MRR cannot be negative",
    })
  }
  
  if (data.arr !== undefined && data.arr < 0) {
    issues.push({
      field: "arr",
      severity: "error",
      message: "ARR cannot be negative",
    })
  }
  
  // Gross margin validation
  if (data.grossMargin !== undefined) {
    if (data.grossMargin < 0 || data.grossMargin > 100) {
      issues.push({
        field: "grossMargin",
        severity: "error",
        message: "Gross margin must be between 0 and 100",
      })
    } else if (data.grossMargin < 20) {
      warnings.push({
        field: "grossMargin",
        severity: "warning",
        message: "Gross margin is below 20%, which may indicate pricing or cost issues",
      })
    }
  }
  
  // Churn validation
  if (data.churn !== undefined) {
    if (data.churn < 0 || data.churn > 100) {
      issues.push({
        field: "churn",
        severity: "error",
        message: "Churn rate must be between 0 and 100",
      })
    } else if (data.churn > 10) {
      warnings.push({
        field: "churn",
        severity: "warning",
        message: "Churn rate is high (>10%), indicating potential retention issues",
      })
    }
  }
  
  // Retention validation
  if (data.retention !== undefined) {
    if (data.retention < 0 || data.retention > 100) {
      issues.push({
        field: "retention",
        severity: "error",
        message: "Retention rate must be between 0 and 100",
      })
    }
  }
  
  // Unit economics validation
  if (data.cac !== undefined && data.cac < 0) {
    issues.push({
      field: "cac",
      severity: "error",
      message: "CAC cannot be negative",
    })
  }
  
  if (data.ltv !== undefined && data.ltv < 0) {
    issues.push({
      field: "ltv",
      severity: "error",
      message: "LTV cannot be negative",
    })
  }
  
  // LTV:CAC ratio check
  if (data.ltv !== undefined && data.cac !== undefined && data.cac > 0) {
    const ratio = data.ltv / data.cac
    if (ratio < 3) {
      warnings.push({
        field: "ltvCacRatio",
        severity: "warning",
        message: `LTV:CAC ratio is ${ratio.toFixed(2)}, below the recommended 3:1 minimum`,
      })
    }
  }
  
  // Payback period validation
  if (data.payback !== undefined) {
    if (data.payback < 0) {
      issues.push({
        field: "payback",
        severity: "error",
        message: "Payback period cannot be negative",
      })
    } else if (data.payback > 24) {
      warnings.push({
        field: "payback",
        severity: "warning",
        message: "Payback period exceeds 24 months, which may indicate inefficient customer acquisition",
      })
    }
  }
  
  // Burn and runway validation
  if (data.burn !== undefined && data.burn < 0) {
    issues.push({
      field: "burn",
      severity: "error",
      message: "Monthly burn cannot be negative",
    })
  }
  
  if (data.runway !== undefined) {
    if (data.runway < 0) {
      issues.push({
        field: "runway",
        severity: "error",
        message: "Runway cannot be negative",
      })
    } else if (data.runway < 6) {
      warnings.push({
        field: "runway",
        severity: "warning",
        message: "Runway is less than 6 months, indicating urgent need for funding",
      })
    }
  }
  
  // Calculate completeness
  const requiredFields = ["companyName"]
  const optionalFields = [
    "stage", "sector", "geography", "jurisdiction",
    "revenueModel", "pricing", "grossMargin",
    "mrr", "arr", "growthRate", "churn", "retention", "activeUsers",
    "cac", "payback", "ltv", "contributionMargin",
    "burn", "runway", "cashBalance",
    "currentValuation", "safeTerms", "optionPool",
    "targetRaise", "useOfFunds", "intendedRunwayExtension",
  ]
  
  const totalFields = requiredFields.length + optionalFields.length
  let filledFields = requiredFields.filter(f => data[f as keyof DealInputData] !== undefined && data[f as keyof DealInputData] !== null).length
  filledFields += optionalFields.filter(f => data[f as keyof DealInputData] !== undefined && data[f as keyof DealInputData] !== null).length
  
  const completeness = Math.round((filledFields / totalFields) * 100)
  
  return {
    isValid: issues.length === 0,
    completeness,
    issues,
    warnings,
  }
}

