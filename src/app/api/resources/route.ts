import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL! ,
  process.env. SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Fetch resources dengan files-nya
    const { data: resources, error } = await supabase
      .from('resources')
      .select(`
        *,
        resource_files (
          id,
          file_name,
          file_url,
          file_type,
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return Response.json(resources || [])
  } catch (error) {
    console.error("Error fetching resources:", error)
    return Response.json([], { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = formData. get('name') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string || 'other'
    const files = formData.getAll('files') as File[]

    if (!name || ! description) {
      return Response.json({ message: "Name and description are required" }, { status: 400 })
    }

    if (files.length === 0) {
      return Response.json({ message: "At least one file is required" }, { status: 400 })
    }

    // 1. Insert resource dulu
    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .insert({
        name,
        description,
        category,
        file_type: null,
        file_url: null
      })
      .select()
      .single()

    if (resourceError) throw resourceError

    // 2.  Upload semua files dan insert ke resource_files
    const uploadedFiles = []

    for (const file of files) {
      const file_type = file.name.split('.').pop()?. toLowerCase() || 'unknown'
      const filePath = `${file_type}/${crypto.randomUUID()}-${file.name}`
      
      const { error: uploadError } = await supabase. storage
        .from('resources')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        })

      if (uploadError) {
        console.error("Upload error:", uploadError)
        continue
      }

      const file_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/resources/${filePath}`

      // Insert ke resource_files table
      const { data: fileData, error: fileError } = await supabase
        .from('resource_files')
        . insert({
          resource_id: resource.id,
          file_name: file.name,
          file_url,
          file_type
        })
        .select()
        .single()

      if (! fileError && fileData) {
        uploadedFiles.push(fileData)
      }
    }

    return Response.json({
      message: `Resource created with ${uploadedFiles.length} file(s)`,
      data: {
        ... resource,
        resource_files: uploadedFiles
      }
    }, { status: 201 })

  } catch (error) {
    console.error("Error creating resource:", error)
    return Response. json({ 
      message: "Error creating resource", 
      error: String(error) 
    }, { status: 500 })
  }
}