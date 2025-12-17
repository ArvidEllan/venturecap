import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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
        uploads: true,
        analyses: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    })

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    return NextResponse.json({ deal })
  } catch (error) {
    console.error("Error fetching deal:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const deal = await prisma.deal.updateMany({
      where: {
        id: params.dealId,
        userId: session.user.id,
      },
      data: body,
    })

    if (deal.count === 0) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating deal:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

