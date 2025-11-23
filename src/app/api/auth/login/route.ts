import { cookies } from "next/headers"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (email !== adminEmail || password !== adminPassword) {
    return Response.json({ message: "Invalid credentials" }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set("admin_auth", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return Response.json({ message: "Login successful", authenticated: true }, { status: 200 })
}
