"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface InvestorProfile {
  id?: string
  fundSize?: number | null
  targetStage?: string[]
  targetOwnership?: number | null
  maxCheck?: number | null
  minCheck?: number | null
  concentrationLimit?: number | null
}

export default function InvestorProfileForm({
  initialData,
}: {
  initialData: InvestorProfile | null
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fundSize: initialData?.fundSize || "",
    targetStage: initialData?.targetStage || [],
    targetOwnership: initialData?.targetOwnership || "",
    maxCheck: initialData?.maxCheck || "",
    minCheck: initialData?.minCheck || "",
    concentrationLimit: initialData?.concentrationLimit || "",
  })

  const stages = ["pre-seed", "seed", "series-a", "series-b", "series-c"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/profile", {
        method: initialData ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fundSize: formData.fundSize ? parseFloat(formData.fundSize as any) : null,
          targetStage: formData.targetStage,
          targetOwnership: formData.targetOwnership ? parseFloat(formData.targetOwnership as any) / 100 : null,
          maxCheck: formData.maxCheck ? parseFloat(formData.maxCheck as any) : null,
          minCheck: formData.minCheck ? parseFloat(formData.minCheck as any) : null,
          concentrationLimit: formData.concentrationLimit ? parseFloat(formData.concentrationLimit as any) / 100 : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save profile")
      }

      alert("Profile saved successfully!")
      router.refresh()
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Failed to save profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleStage = (stage: string) => {
    setFormData({
      ...formData,
      targetStage: formData.targetStage.includes(stage)
        ? formData.targetStage.filter((s) => s !== stage)
        : [...formData.targetStage, stage],
    })
  }

  return (
    <div className="max-w-2xl bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fund Size ($)
          </label>
          <input
            type="number"
            value={formData.fundSize}
            onChange={(e) => setFormData({ ...formData, fundSize: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="10000000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Stages
          </label>
          <div className="flex flex-wrap gap-2">
            {stages.map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => toggleStage(stage)}
                className={`px-3 py-1 rounded-full text-sm ${
                  formData.targetStage.includes(stage)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Ownership (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.targetOwnership}
              onChange={(e) => setFormData({ ...formData, targetOwnership: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Concentration Limit (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.concentrationLimit}
              onChange={(e) => setFormData({ ...formData, concentrationLimit: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="10"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Check Size ($)
            </label>
            <input
              type="number"
              value={formData.minCheck}
              onChange={(e) => setFormData({ ...formData, minCheck: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="25000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Check Size ($)
            </label>
            <input
              type="number"
              value={formData.maxCheck}
              onChange={(e) => setFormData({ ...formData, maxCheck: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="500000"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  )
}

