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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const formData = await request.formData()
    const title = formData.get('title') as string
    const authors = formData.get('authors') as string
    const year = parseInt(formData.get('year') as string)
    const file = formData.get('pdf') as File | null

    let pdf_url = null
    if (file) {
      // Dapatkan existing PDF untuk hapus jika replace
      const { data: existing } = await supabase.from('publications').select('pdf_url').eq('id', id).single()
      if (existing?.pdf_url) {
        const oldPath = existing.pdf_url.split('/publications/')[1]  // Extract path
        await supabase.storage.from('publications').remove([oldPath])
      }

      const filePath = `pdf/${crypto.randomUUID()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('publications')
        .upload(filePath, file)

      if (uploadError) throw uploadError
      pdf_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/publications/${filePath}`
    }

    const updateData: any = { title, authors, year }
    if (pdf_url) updateData.pdf_url = pdf_url

    const { data, error } = await supabase
      .from('publications')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) throw error
    return Response.json(data[0])
  } catch (error) {
    console.error("Error updating publication:", error)
    return Response.json({ message: "Error updating publication" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    // Hapus PDF jika ada
    const { data: existing } = await supabase.from('publications').select('pdf_url').eq('id', id).single()
    if (existing?.pdf_url) {
      const filePath = existing.pdf_url.split('/publications/')[1]
      await supabase.storage.from('publications').remove([filePath])
    }

    const { error } = await supabase.from('publications').delete().eq('id', id)
    if (error) throw error
    return Response.json({ message: "Publication deleted" })
  } catch (error) {
    console.error("Error deleting publication:", error)
    return Response.json({ message: "Error deleting publication" }, { status: 500 })
  }
}