import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const createDealSchema = z.object({
  companyName: z.string().min(1),
  stage: z.string().optional(),
  sector: z.string().optional(),
  geography: z.string().optional(),
  jurisdiction: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const deals = await prisma.deal.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        analyses: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    })

    return NextResponse.json({ deals })
  } catch (error) {
    console.error("Error fetching deals:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = createDealSchema.parse(body)

    const deal = await prisma.deal.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ deal }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("Error creating deal:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

