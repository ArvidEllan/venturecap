import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import DealWorkspace from "./deal-workspace"

export default async function DealPage({
  params,
}: {
  params: { dealId: string }
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const deal = await prisma.deal.findFirst({
    where: {
      id: params.dealId,
      userId: session.user.id,
    },
    include: {
      inputs: {
        orderBy: { version: "desc" },
        take: 1,
      },
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  })

  if (!deal) {
    redirect("/dashboard")
  }

  return <DealWorkspace deal={deal} />
}

