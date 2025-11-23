export async function GET() {
  // This will be connected to Firestore later
  const stats = {
    activeMembers: 50,
    alumni: 200,
    localChapters: 1,
  }

  return Response.json(stats)
}
