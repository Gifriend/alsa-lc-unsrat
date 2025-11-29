import { createClient } from '@supabase/supabase-js'
import { cookies } from "next/headers"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

async function checkAuth() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("admin_auth")
  return authToken?.value === "true"
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .order('year', { ascending: false })

    if (error) throw error
    return Response.json(data)
  } catch (error) {
    console.error("Error fetching publications:", error)
    return Response.json([], { status: 500 })
  }
}

export async function POST(request: Request) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const authors = formData.get('authors') as string
    const year = parseInt(formData.get('year') as string)
    const file = formData.get('pdf') as File | null

    let pdf_url = null
    if (file) {
      const filePath = `pdf/${crypto.randomUUID()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('publications')  // Nama bucket
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Dapatkan public URL (jika bucket public)
      pdf_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/publications/${filePath}`
      // Jika bucket private, gunakan signed URL: await supabase.storage.from('publications').createSignedUrl(filePath, 60 * 60 * 24 * 365) // 1 tahun
    }

    const { data, error } = await supabase
      .from('publications')
      .insert({ title, authors, year, pdf_url })
      .select()

    if (error) throw error
    return Response.json(data[0], { status: 201 })
  } catch (error) {
    console.error("Error creating publication:", error)
    return Response.json({ message: "Error creating publication" }, { status: 500 })
  }
}