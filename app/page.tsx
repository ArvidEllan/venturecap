import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            VC Decision Support Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Analyze startup investments with structured risk scoring, scenario modeling, and check-size recommendations.
            <br />
            <span className="text-sm text-amber-600 font-semibold mt-2 block">
              Decision-support tool. Not financial advice.
            </span>
          </p>
          
          <div className="flex gap-4 justify-center mb-16">
            <Link
              href="/auth/signin"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signin"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Get Started
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-3">Risk Scoring</h3>
              <p className="text-gray-600">
                Comprehensive scorecard across market, traction, unit economics, and more.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-3">Scenario Modeling</h3>
              <p className="text-gray-600">
                Base, upside, and downside scenarios with revenue and runway projections.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-3">Check Size Recommendations</h3>
              <p className="text-gray-600">
                Personalized investment capacity estimates based on your investor profile.
              </p>
            </div>
          </div>

          <div className="mt-16 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold mb-2">Investor Resources Library</h3>
            <p className="text-gray-700">
              Access curated templates and documents: term sheets, DD checklists, IC memos, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
