import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import ResourcesList from "./resources-list"

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: { category?: string; tag?: string; jurisdiction?: string }
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const resources = await prisma.resource.findMany({
    where: {
      published: true,
      ...(searchParams.category && { category: searchParams.category }),
      ...(searchParams.tag && { tags: { has: searchParams.tag } }),
      ...(searchParams.jurisdiction && { jurisdiction: searchParams.jurisdiction }),
    },
    orderBy: { updatedAt: "desc" },
  })

  const categories = await prisma.resource.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ["category"],
  })

  const tags = await prisma.resource.findMany({
    where: { published: true },
    select: { tags: true },
  })

  const allTags = Array.from(new Set(tags.flatMap((r) => r.tags)))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Investor Resources Library</h1>
          <p className="text-gray-600 mt-1">
            Curated templates and documents for investment decision-making
          </p>
        </div>

        <ResourcesList
          resources={resources}
          categories={categories.map((c) => c.category)}
          tags={allTags}
          filters={searchParams}
        />
      </div>
    </div>
  )
}

