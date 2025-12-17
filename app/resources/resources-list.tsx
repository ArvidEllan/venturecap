"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"

interface Resource {
  id: string
  title: string
  description: string | null
  category: string
  tags: string[]
  fileName: string
  jurisdiction: string | null
  updatedAt: Date
  downloadCount: number
}

export default function ResourcesList({
  resources,
  categories,
  tags,
  filters,
}: {
  resources: Resource[]
  categories: string[]
  tags: string[]
  filters: { category?: string; tag?: string; jurisdiction?: string }
}) {
  const [selectedCategory, setSelectedCategory] = useState(filters.category || "")
  const [selectedTag, setSelectedTag] = useState(filters.tag || "")

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (selectedCategory) params.set("category", selectedCategory)
    if (selectedTag) params.set("tag", selectedTag)
    window.location.href = `/resources?${params.toString()}`
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tag
            </label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Tags</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleFilter}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="mb-2">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {resource.category}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
            {resource.description && (
              <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
            )}
            <div className="flex flex-wrap gap-1 mb-4">
              {resource.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-500 mb-4">
              Updated: {format(new Date(resource.updatedAt), "MMM d, yyyy")}
              {resource.jurisdiction && ` • ${resource.jurisdiction}`}
            </div>
            <a
              href={`/api/resources/${resource.id}/download`}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Download →
            </a>
          </div>
        ))}
      </div>

      {resources.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No resources found matching your filters.</p>
        </div>
      )}
    </div>
  )
}

