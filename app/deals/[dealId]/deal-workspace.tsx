"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DealInputForm from "./deal-input-form"
import AnalysisResults from "./analysis-results"

interface Deal {
  id: string
  companyName: string
  stage: string | null
  sector: string | null
  status: string
  inputs: Array<{
    id: string
    version: number
    data: any
  }>
  analyses: Array<{
    id: string
    score: number | null
    resultsJson: any
  }>
}

export default function DealWorkspace({ deal }: { deal: Deal }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"input" | "results">("input")
  const [analysis, setAnalysis] = useState<any>(deal.analyses[0]?.resultsJson || null)

  const handleAnalyze = async () => {
    try {
      const response = await fetch(`/api/deals/${deal.id}/analyze`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const { analysis: newAnalysis } = await response.json()
      setAnalysis(newAnalysis)
      setActiveTab("results")
      router.refresh()
    } catch (error) {
      console.error("Error running analysis:", error)
      alert("Failed to run analysis. Please try again.")
    }
  }

  useEffect(() => {
    if (deal.analyses[0]) {
      setAnalysis(deal.analyses[0].resultsJson)
    }
  }, [deal])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{deal.companyName}</h1>
          {deal.stage && (
            <p className="text-gray-600 mt-1">
              {deal.stage} • {deal.sector || "No sector"}
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("input")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "input"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Input Data
              </button>
              <button
                onClick={() => setActiveTab("results")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "results"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                disabled={!analysis}
              >
                Analysis Results
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "input" ? (
              <div>
                <DealInputForm dealId={deal.id} initialData={deal.inputs[0]?.data} />
                {deal.inputs[0] && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleAnalyze}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Run Analysis
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <AnalysisResults analysis={analysis} dealId={deal.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

