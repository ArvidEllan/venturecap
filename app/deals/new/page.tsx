import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import DealForm from "./deal-form"

export default async function NewDealPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Deal</h1>
        <DealForm />
      </div>
    </div>
  )
}

