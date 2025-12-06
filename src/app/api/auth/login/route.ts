import { cookies } from "next/headers"
import { adminAuth } from "@/lib/firebase-admin" 

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json()

    if (!idToken) {
      return Response.json({ message: "ID Token required" }, { status: 400 })
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const uid = decodedToken.uid

    const cookieStore = await cookies()
    cookieStore.set("admin_auth", uid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return Response.json({ 
      message: "Login successful", 
      authenticated: true 
    }, { status: 200 })
  } catch (error) {
    console.error("Login error:", error)
    return Response.json({ 
      message: "Invalid credentials" 
    }, { status: 401 })
  }
}