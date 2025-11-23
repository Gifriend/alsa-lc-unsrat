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
      .collection("merchandise")
      .doc(id)
      .update({
        ...body,
        updatedAt: new Date(),
      })
    return Response.json({ id, ...body })
  } catch (error) {
    console.error("Error updating merchandise:", error)
    return Response.json({ message: "Error updating merchandise" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    await adminDb.collection("merchandise").doc(id).delete()
    return Response.json({ message: "Merchandise deleted" })
  } catch (error) {
    console.error("Error deleting merchandise:", error)
    return Response.json({ message: "Error deleting merchandise" }, { status: 500 })
  }
}
