import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("admin_auth")

  const authenticated = authToken?.value === "true"

  return Response.json({ authenticated }, { status: 200 })
}
