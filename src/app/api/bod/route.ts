import { adminDb } from "@/lib/firebase-admin"
import { cookies } from "next/headers"

async function checkAuth() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("admin_auth")
  return authToken?.value === "true"
}

export async function GET() {
  try {
    const snapshot = await adminDb.collection("bod").orderBy("level").orderBy("order").get()
    const members = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    const termDoc = await adminDb.collection("settings").doc("bod_term").get()
    const term = termDoc.exists ? termDoc.data()?.value : "2024-2026"

    return Response.json({ members, term })
  } catch (error) {
    console.error("Error fetching BOD:", error)
    return Response.json({ members: [], term: "2024-2026" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const docRef = await adminDb.collection("bod").add({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return Response.json({ id: docRef.id, ...body }, { status: 201 })
  } catch (error) {
    console.error("Error creating BOD member:", error)
    return Response.json({ message: "Error creating BOD member" }, { status: 500 })
  }
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