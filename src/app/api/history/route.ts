import { adminDb } from "@/lib/firebase-admin"
import { cookies } from "next/headers"

async function checkAuth() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("admin_auth")
  return authToken?.value === "true"
}

export async function GET() {
  try {
    const snapshot = await adminDb.collection("history"). orderBy("year", "asc").get()
    const data = snapshot.docs.map((doc) => ({
      id: doc. id,
      ... doc.data(),
    }))
    return Response.json(data)
  } catch (error) {
    console.error("Error fetching history:", error)
    return Response.json([], { status: 500 })
  }
}

export async function POST(request: Request) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request. json()
    const docRef = await adminDb.collection("history").add({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return Response.json({ id: docRef.id, ...body }, { status: 201 })
  } catch (error) {
    console. error("Error creating history:", error)
    return Response.json({ message: "Error creating history" }, { status: 500 })
  }
}