import { adminAuth } from "@/lib/firebase-admin"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ 
        message: "Email and password required" 
      }, { status: 400 })
    }

    if (password.length < 6) {
      return Response.json({ 
        message: "Password must be at least 6 characters" 
      }, { status: 400 })
    }

    const userRecord = await adminAuth.createUser({
      email,
      password,
      emailVerified: false,
    })

    return Response.json({ 
      message: "Registration successful",
      uid: userRecord.uid 
    }, { status: 201 })
  } catch (error: any) {
    console.error("Registration error:", error)
    
    if (error.code === "auth/email-already-exists") {
      return Response.json({ 
        message: "Email already exists" 
      }, { status: 400 })
    }
    
    return Response. json({ 
      message: "Registration failed" 
    }, { status: 500 })
  }
}