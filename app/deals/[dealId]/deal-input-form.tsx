"use client"

import { useState, useEffect } from "react"
import { DealInputData } from "@/lib/analysis/types"

export default function DealInputForm({
  dealId,
  initialData,
}: {
  dealId: string
  initialData?: any
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<DealInputData>>(initialData || {})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/deals/${dealId}/inputs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: formData,
          source: "form",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save input data")
      }

      alert("Data saved successfully!")
    } catch (error) {
      console.error("Error saving input:", error)
      alert("Failed to save data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Revenue & Traction</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MRR ($)
            </label>
            <input
              type="number"
              value={formData.mrr || ""}
              onChange={(e) => setFormData({ ...formData, mrr: parseFloat(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ARR ($)
            </label>
            <input
              type="number"
              value={formData.arr || ""}
              onChange={(e) => setFormData({ ...formData, arr: parseFloat(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Growth Rate (% MoM)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.growthRate || ""}
              onChange={(e) => setFormData({ ...formData, growthRate: parseFloat(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Churn Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.churn || ""}
              onChange={(e) => setFormData({ ...formData, churn: parseFloat(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Unit Economics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CAC ($)
            </label>
            <input
              type="number"
              value={formData.cac || ""}
              onChange={(e) => setFormData({ ...formData, cac: parseFloat(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LTV ($)
            </label>
            <input
              type="number"
              value={formData.ltv || ""}
              onChange={(e) => setFormData({ ...formData, ltv: parseFloat(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payback Period (months)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.payback || ""}
              onChange={(e) => setFormData({ ...formData, payback: parseFloat(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gross Margin (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.grossMargin || ""}
              onChange={(e) => setFormData({ ...formData, grossMargin: parseFloat(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Cash & Runway</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Burn ($)
            </label>
            <input
              type="number"
              value={formData.burn || ""}
              onChange={(e) => setFormData({ ...formData, burn: parseFloat(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Runway (months)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.runway || ""}
              onChange={(e) => setFormData({ ...formData, runway: parseFloat(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cash Balance ($)
            </label>
            <input
              type="number"
              value={formData.cashBalance || ""}
              onChange={(e) => setFormData({ ...formData, cashBalance: parseFloat(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Deal Terms</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Valuation ($)
            </label>
            <input
              type="number"
              value={formData.currentValuation || ""}
              onChange={(e) => setFormData({ ...formData, currentValuation: parseFloat(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Raise ($)
            </label>
            <input
              type="number"
              value={formData.targetRaise || ""}
              onChange={(e) => setFormData({ ...formData, targetRaise: parseFloat(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Option Pool (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.optionPool || ""}
              onChange={(e) => setFormData({ ...formData, optionPool: parseFloat(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Data"}
        </button>
      </div>
    </form>
  )
}

