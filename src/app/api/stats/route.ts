import { adminDb } from "@/lib/firebase-admin"

interface OrganizationStats {
  activeMembers: number
  alumni: number
  totalMembers: number
  localChapters: number
  programs: number
  achievements: number
}

export async function GET() {
  try {
    const [membersDoc, programsSnap, achievementsSnap] = await Promise.all([
      adminDb.collection("members").doc("stats").get(),
      adminDb.collection("proker").where("status", "==", "ongoing").get(),
      adminDb.collection("achievements").get(),
    ])

    const memberData = membersDoc.data() || { activeMembers: 0, alumni: 0, totalMembers: 0 }

    const stats: OrganizationStats = {
      activeMembers: memberData.activeMembers || 0,
      alumni: memberData.alumni || 0,
      totalMembers: memberData.totalMembers || 0,
      localChapters: 1, // ALSA LC Unsrat
      programs: programsSnap.size,
      achievements: achievementsSnap.size,
    }

    return Response.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return Response.json(
      {
        activeMembers: 0,
        alumni: 0,
        totalMembers: 0,
        localChapters: 1,
        programs: 0,
        achievements: 0,
      },
      { status: 200 },
    )
  }
}
