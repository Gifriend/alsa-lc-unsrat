import type { NextRequest } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

interface MemberStats {
  activeMembers: number
  alumni: number
  totalMembers: number
  membersByYear?: Record<number, number>
}

export async function GET() {
  try {
    const doc = await adminDb.collection("members").doc("stats").get()

    if (!doc.exists) {
      // Return default stats if document doesn't exist
      return Response.json({
        activeMembers: 0,
        alumni: 0,
        totalMembers: 0,
      })
    }

    return Response.json(doc.data())
  } catch (error) {
    console.error("Error fetching member stats:", error)
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: Partial<MemberStats> = await request.json()

    const updateData: Partial<MemberStats> = {}
    if (body.activeMembers !== undefined) updateData.activeMembers = body.activeMembers
    if (body.alumni !== undefined) updateData.alumni = body.alumni

    // Calculate total members
    if (updateData.activeMembers !== undefined || updateData.alumni !== undefined) {
      const current = await adminDb.collection("members").doc("stats").get()
      const currentData = current.data() || {}
      const active = updateData.activeMembers ?? currentData.activeMembers ?? 0
      const alumni = updateData.alumni ?? currentData.alumni ?? 0
      updateData.totalMembers = active + alumni
    }

    await adminDb.collection("members").doc("stats").update(updateData)

    return Response.json({ success: true, data: updateData })
  } catch (error) {
    console.error("Error updating member stats:", error)
    return Response.json({ error: "Failed to update stats" }, { status: 500 })
  }
}
