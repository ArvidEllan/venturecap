import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    const jurisdiction = searchParams.get("jurisdiction")

    const where: any = { published: true }
    if (category) where.category = category
    if (tag) where.tags = { has: tag }
    if (jurisdiction) where.jurisdiction = jurisdiction

    const resources = await prisma.resource.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json({ resources })
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

