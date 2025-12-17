import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const createResourceSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()),
  fileKey: z.string(),
  fileName: z.string(),
  mimeType: z.string().optional(),
  fileSize: z.number().optional(),
  jurisdiction: z.string().optional(),
  published: z.boolean().default(false),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resources = await prisma.resource.findMany({
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json({ resources })
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = createResourceSchema.parse(body)

    const resource = await prisma.resource.create({
      data: {
        ...data,
        contributorId: session.user.id,
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "create",
        entityType: "resource",
        entityId: resource.id,
      },
    })

    return NextResponse.json({ resource }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("Error creating resource:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

