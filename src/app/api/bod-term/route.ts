import { adminDb } from "@/lib/firebase-admin"
import { cookies } from "next/headers"

async function checkAuth() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("admin_auth")
  return authToken?.value === "true"
}

export async function PUT(request: Request) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { term } = await request.json()
    if (typeof term !== 'string' || term.trim() === '') {
      throw new Error('Invalid term value');
    }
    await adminDb.collection("settings").doc("bod_term").set({ value: term })
    return Response.json({ message: "Term updated" })
  } catch (error) {
    console.error("Error updating term:", error)
    return Response.json({ message: "Error updating term" }, { status: 500 })
  }
}