import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const dealInputSchema = z.object({
  data: z.record(z.any()),
  source: z.string().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify deal ownership
    const deal = await prisma.deal.findFirst({
      where: {
        id: params.dealId,
        userId: session.user.id,
      },
    })

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    const body = await request.json()
    const { data, source } = dealInputSchema.parse(body)

    // Get latest version
    const latestInput = await prisma.dealInput.findFirst({
      where: { dealId: params.dealId },
      orderBy: { version: "desc" },
    })

    const newVersion = latestInput ? latestInput.version + 1 : 1

    const input = await prisma.dealInput.create({
      data: {
        dealId: params.dealId,
        version: newVersion,
        data,
        source: source || "form",
      },
    })

    return NextResponse.json({ input }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("Error creating deal input:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

