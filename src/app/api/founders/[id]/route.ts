import { adminDb } from "@/lib/firebase-admin"
import { cookies } from "next/headers"

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
    const { id } = await params // await params
    console.log("ID PARAM:", id)
    const body = await request.json()

    await adminDb
      .collection("founders")
      .doc(id)
      .update({
        ...body,
        updatedAt: new Date(),
      })

    return Response.json({ id, ...body })
  } catch (error) {
    console.error("Error updating founder:", error)
    return Response.json({ message: "Error updating founder" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params // await params

    await adminDb.collection("founders").doc(id).delete()

    return Response.json({ message: "Founder deleted" })
  } catch (error) {
    console.error("Error deleting founder:", error)
    return Response.json({ message: "Error deleting founder" }, { status: 500 })
  }
}
