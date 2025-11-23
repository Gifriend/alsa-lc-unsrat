import { adminDb } from "@/lib/firebase-admin"
import { cookies } from "next/headers"

async function checkAuth() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("admin_auth")
  return authToken?.value === "true"
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    await adminDb
      .collection("resources")
      .doc(id)
      .update({
        ...body,
        updatedAt: new Date(),
      })
    return Response.json({ id, ...body })
  } catch (error) {
    console.error("Error updating resource:", error)
    return Response.json({ message: "Error updating resource" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    await adminDb.collection("resources").doc(id).delete()
    return Response.json({ message: "Resource deleted" })
  } catch (error) {
    console.error("Error deleting resource:", error)
    return Response.json({ message: "Error deleting resource" }, { status: 500 })
  }
}
