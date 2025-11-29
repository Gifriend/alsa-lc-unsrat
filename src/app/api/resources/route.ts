// api/resources.ts (updated)
import { createClient } from '@supabase/supabase-js'
import { cookies } from "next/headers"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkAuth() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("admin_auth")
  return authToken?.value === "true"
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return Response.json(data)
  } catch (error) {
    console.error("Error fetching resources:", error)
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
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string || 'other'
    const file = formData.get('file') as File | null

    let file_type: string | null = null
    let file_url: string | null = null

    if (file) {
      file_type = file.name.split('.').pop()?.toLowerCase() || 'unknown'
      const filePath = `${file_type}/${crypto.randomUUID()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, file)

      if (uploadError) throw uploadError
      file_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/resources/${filePath}`
    }

    const { data, error } = await supabase
      .from('resources')
      .insert({ name, description, file_type, file_url, category })
      .select()

    if (error) throw error
    return Response.json(data[0], { status: 201 })
  } catch (error) {
    console.error("Error creating resource:", error)
    return Response.json({ message: "Error creating resource" }, { status: 500 })
  }
}