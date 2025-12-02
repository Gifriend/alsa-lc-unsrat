import { NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  const cookie = request.cookies.get("admin_auth")

  if (!cookie || cookie.value !== "true") {
    return NextResponse.redirect(new URL("auth/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}