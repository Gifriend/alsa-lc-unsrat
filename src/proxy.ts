import { NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

export async function proxy(request: NextRequest) {
  const cookie = request.cookies.get("admin_auth")

  if (!cookie || !cookie.value) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  try {
    // Verify the UID exists in Firebase
    await adminAuth.getUser(cookie.value)
    return NextResponse.next()
  } catch (error) {
    // Invalid UID or user deleted
    const response = NextResponse.redirect(new URL("/auth/login", request. url))
    response.cookies. delete("admin_auth")
    return response
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}