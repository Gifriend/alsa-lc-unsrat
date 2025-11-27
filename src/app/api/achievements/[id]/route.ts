import { adminDb } from "@/lib/firebase-admin"
import { cookies } from "next/headers"

async function checkAuth() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("admin_auth")
  return authToken?.value === "true"
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const doc = await adminDb.collection("achievements").doc(id).get()

    if (!doc.exists) {
      return Response.json({ message: "Achievement not found" }, { status: 404 })
    }

    return Response.json({ id: doc.id, ...doc.data() })
  } catch (error) {
    console.error("Error fetching achievement:", error)
    return Response.json({ message: "Error fetching achievement" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params 
    const body = await request.json()
    await adminDb
      .collection("achievements")
      .doc(id)
      .update({
        ...body,
        updatedAt: new Date(),
      })
    return Response.json({ id, ...body })
  } catch (error) {
    console.error("Error updating achievement:", error)
    return Response.json({ message: "Error updating achievement" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params 
    await adminDb.collection("achievements").doc(id).delete()
    return Response.json({ message: "Achievement deleted" })
  } catch (error) {
    console.error("Error deleting achievement:", error)
    return Response.json({ message: "Error deleting achievement" }, { status: 500 })
  }
}
