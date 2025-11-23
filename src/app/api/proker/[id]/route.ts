import { adminDb } from "@/lib/firebase-admin"
import { cookies } from "next/headers"
import { use } from "react"

async function checkAuth() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("admin_auth")
  return authToken?.value === "true"
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = use(params);
    const body = await request.json()
    await adminDb
      .collection("proker")
      .doc(id)
      .update({
        ...body,
        updatedAt: new Date(),
      })
    return Response.json({ id, ...body })
  } catch (error) {
    console.error("Error updating proker:", error)
    return Response.json({ message: "Error updating proker" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = use(params);
    await adminDb.collection("proker").doc(id).delete()
    return Response.json({ message: "Proker deleted" })
  } catch (error) {
    console.error("Error deleting proker:", error)
    return Response.json({ message: "Error deleting proker" }, { status: 500 })
  }
}
