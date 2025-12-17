import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { analyzeDeal } from "@/lib/analysis"
import { DealInputData } from "@/lib/analysis/types"

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
      include: {
        inputs: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    })

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    if (!deal.inputs[0]) {
      return NextResponse.json({ error: "No input data found" }, { status: 400 })
    }

    // Get investor profile
    const investorProfile = await prisma.investorProfile.findUnique({
      where: { userId: session.user.id },
    })

    const profile = investorProfile ? {
      fundSize: investorProfile.fundSize || undefined,
      targetStage: investorProfile.targetStage,
      targetOwnership: investorProfile.targetOwnership || undefined,
      maxCheck: investorProfile.maxCheck || undefined,
      minCheck: investorProfile.minCheck || undefined,
      concentrationLimit: investorProfile.concentrationLimit || undefined,
    } : {}

    // Run analysis
    const inputData = deal.inputs[0].data as DealInputData
    const analysisResult = await analyzeDeal(params.dealId, inputData, profile)

    // Get latest analysis version
    const latestAnalysis = await prisma.analysis.findFirst({
      where: { dealId: params.dealId },
      orderBy: { version: "desc" },
    })

    const newVersion = latestAnalysis ? latestAnalysis.version + 1 : 1

    // Save analysis
    const analysis = await prisma.analysis.create({
      data: {
        dealId: params.dealId,
        version: newVersion,
        score: analysisResult.score,
        resultsJson: analysisResult as any,
        assumptionsJson: analysisResult.assumptions,
        status: "completed",
        completedAt: new Date(),
      },
    })

    // Update deal status
    await prisma.deal.update({
      where: { id: params.dealId },
      data: { status: "completed" },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "analyze",
        entityType: "deal",
        entityId: params.dealId,
        metadata: { analysisId: analysis.id, version: newVersion },
      },
    })

    return NextResponse.json({ analysis: analysisResult }, { status: 201 })
  } catch (error) {
    console.error("Error analyzing deal:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

