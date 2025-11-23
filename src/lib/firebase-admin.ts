import { initializeApp, cert, getApp } from "firebase-admin/app"
import { getAuth as getAdminAuth } from "firebase-admin/auth"
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore"

let adminApp: any

try {
  adminApp = getApp()
} catch {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }

  adminApp = initializeApp({
    credential: cert(serviceAccount as any),
  })
}

export const adminAuth = getAdminAuth(adminApp)
export const adminDb = getAdminFirestore(adminApp)
