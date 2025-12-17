import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import AdminResourcesList from "./admin-resources-list"

export default async function AdminResourcesPage() {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== "admin") {
    redirect("/dashboard")
  }

  const resources = await prisma.resource.findMany({
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin: Resources</h1>
            <p className="text-gray-600 mt-1">Manage investor resources and documents</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Upload Resource
          </button>
        </div>

        <AdminResourcesList resources={resources} />
      </div>
    </div>
  )
}

