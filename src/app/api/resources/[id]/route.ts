// api/resources/[id].ts (updated)
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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string || 'other'
    const file = formData.get('file') as File | null

    let file_type: string | undefined
    let file_url: string | null = null

    if (file) {
      // Hapus file lama jika ada
      const { data: existing } = await supabase.from('resources').select('file_url').eq('id', id).single()
      if (existing?.file_url) {
        const oldPath = existing.file_url.split('/resources/')[1]
        await supabase.storage.from('resources').remove([oldPath])
      }

      file_type = file.name.split('.').pop()?.toLowerCase() || 'unknown'
      const filePath = `${file_type}/${crypto.randomUUID()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, file)

      if (uploadError) throw uploadError
      file_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/resources/${filePath}`
    }

    const updateData: any = { name, description, category }
    if (file_type !== undefined) updateData.file_type = file_type
    if (file_url) updateData.file_url = file_url

    const { data, error } = await supabase
      .from('resources')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) throw error
    return Response.json(data[0])
  } catch (error) {
    console.error("Error updating resource:", error)
    return Response.json({ message: "Error updating resource" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    // Hapus file jika ada
    const { data: existing } = await supabase.from('resources').select('file_url').eq('id', id).single()
    if (existing?.file_url) {
      const filePath = existing.file_url.split('/resources/')[1]
      await supabase.storage.from('resources').remove([filePath])
    }

    const { error } = await supabase.from('resources').delete().eq('id', id)
    if (error) throw error
    return Response.json({ message: "Resource deleted" })
  } catch (error) {
    console.error("Error deleting resource:", error)
    return Response.json({ message: "Error deleting resource" }, { status: 500 })
  }
}