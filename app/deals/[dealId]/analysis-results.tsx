"use client"

import { AnalysisResult } from "@/lib/analysis/types"

export default function AnalysisResults({
  analysis,
  dealId,
}: {
  analysis: AnalysisResult | null
  dealId: string
}) {
  if (!analysis) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No analysis results yet. Run an analysis first.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> This is a decision-support tool, not financial advice.
          All outputs are scenario-based estimates with assumptions clearly stated.
        </p>
      </div>

      {/* Overall Score */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Overall Score</h2>
        <div className="text-5xl font-bold text-blue-600 mb-2">{analysis.score}/100</div>
        <p className="text-gray-600">
          {analysis.score >= 70
            ? "Strong investment opportunity"
            : analysis.score >= 50
            ? "Moderate investment opportunity"
            : "Consider with caution"}
        </p>
      </div>

      {/* Scorecard */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Scorecard Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(analysis.scorecard.categories).map(([key, value]) => (
            <div key={key} className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 capitalize mb-1">{key.replace(/([A-Z])/g, " $1").trim()}</div>
              <div className="text-2xl font-bold">{value}/100</div>
              <div className="text-xs text-gray-500 mt-1">{analysis.scorecard.explanations[key]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Validation */}
      {analysis.validation && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Data Validation</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="mb-2">
              <span className="text-sm text-gray-600">Completeness: </span>
              <span className="font-semibold">{analysis.validation.completeness}%</span>
            </div>
            {analysis.validation.issues.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium text-red-600 mb-2">Issues:</div>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.validation.issues.map((issue, i) => (
                    <li key={i} className="text-sm text-red-700">{issue.message}</li>
                  ))}
                </ul>
              </div>
            )}
            {analysis.validation.warnings.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium text-yellow-600 mb-2">Warnings:</div>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.validation.warnings.map((warning, i) => (
                    <li key={i} className="text-sm text-yellow-700">{warning.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Check Size Recommendation */}
      {analysis.recommendedCheckSize && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recommended Check Size</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${analysis.recommendedCheckSize.recommended.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Range: ${analysis.recommendedCheckSize.min.toLocaleString()} - ${analysis.recommendedCheckSize.max.toLocaleString()}
            </div>
            <p className="text-sm text-gray-700">{analysis.recommendedCheckSize.rationale}</p>
          </div>
        </div>
      )}

      {/* Scenarios */}
      {analysis.scenarios && analysis.scenarios.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Scenario Projections (24 months)</h2>
          <div className="space-y-4">
            {analysis.scenarios.map((scenario) => (
              <div key={scenario.scenario} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold capitalize mb-2">{scenario.scenario} Scenario</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Year 1 ARR</div>
                    <div className="font-semibold">${scenario.revenue[11]?.toLocaleString() || "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Year 2 ARR</div>
                    <div className="font-semibold">${scenario.revenue[23]?.toLocaleString() || "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Runway (months)</div>
                    <div className="font-semibold">
                      {scenario.runway[23] === Infinity ? "∞" : scenario.runway[23]?.toFixed(1) || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

