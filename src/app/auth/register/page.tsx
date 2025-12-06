"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase" // Sesuaikan path ke Firebase config

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (password. length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const idToken = await userCredential.user.getIdToken()

      // Auto login after registration
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      })

      if (response.ok) {
        router.push("/admin")
      } else {
        // If auto-login fails, redirect to login page
        router.push("/auth/login")
      }
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email already exists")
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format")
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak")
      } else {
        setError("Registration failed.  Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary to-primary-light flex items-center justify-center p-4">
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-primary">ALSA Admin</h1>
          <p className="text-neutral-medium mt-2">Create your admin account</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

          <div>
            <label className="block text-sm font-bold text-primary mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-ring rounded focus:outline-none focus:border-accent focus:border-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target. value)}
              className="w-full px-4 py-2 border border-ring rounded focus:outline-none focus:border-accent focus:border-2"
              required
              minLength={6}
            />
            <p className="text-xs text-neutral-medium mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-ring rounded focus:outline-none focus:border-accent focus:border-2"
              required
              minLength={6}
            />
          </div>

          <button type="submit" disabled={isLoading} className="w-full btn-primary disabled:opacity-50">
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-neutral-medium text-sm mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-accent hover:text-accent-light font-bold">
            Login
          </Link>
        </p>

        <p className="text-center text-neutral-medium text-sm mt-2">
          <Link href="/" className="text-accent hover:text-accent-light">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}