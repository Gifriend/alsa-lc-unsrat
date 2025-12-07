import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process. env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string || 'other'
    const newFiles = formData.getAll('files') as File[]
    const keepFileIdsRaw = formData.getAll('keepFileIds') as string[]
    
    // Filter out empty strings
    const keepFileIds = keepFileIdsRaw.filter(id => id && id.trim() !== '')

    // 1. Update resource info
    const { error: updateError } = await supabase
      .from('resources')
      .update({ 
        name, 
        description, 
        category,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (updateError) throw updateError

    // 2. Get existing files
    const { data: existingFiles } = await supabase
      . from('resource_files')
      .select('*')
      .eq('resource_id', id)

    // 3. Delete files that are NOT in keepFileIds
    if (existingFiles && existingFiles.length > 0) {
      for (const file of existingFiles) {
        if (!keepFileIds.includes(file.id)) {
          // Delete from storage
          try {
            const filePath = file.file_url.split('/resources/')[1]
            if (filePath) {
              await supabase.storage. from('resources').remove([filePath])
            }
          } catch (err) {
            console.error("Error removing file from storage:", err)
          }
          
          // Delete from database
          await supabase
            .from('resource_files')
            .delete()
            .eq('id', file.id)
        }
      }
    }

    // 4. Upload new files if any
    const uploadedFiles = []
    if (newFiles.length > 0) {
      for (const file of newFiles) {
        const file_type = file.name.split('.').pop()?.toLowerCase() || 'unknown'
        const filePath = `${file_type}/${crypto.randomUUID()}-${file.name}`
        
        const { error: uploadError } = await supabase.storage
          .from('resources')
          .upload(filePath, file, {
            contentType: file.type,
            upsert: false
          })

        if (uploadError) {
          console.error("Upload error:", uploadError)
          continue
        }

        const file_url = `${process.env. SUPABASE_URL}/storage/v1/object/public/resources/${filePath}`

        const { data: fileData, error: fileError } = await supabase
          .from('resource_files')
          .insert({
            resource_id: id,
            file_name: file.name,
            file_url,
            file_type
          })
          .select()
          .single()

        if (!fileError && fileData) {
          uploadedFiles.push(fileData)
        }
      }
    }

    // 5. Return updated resource with all files
    const { data: updatedResource } = await supabase
      .from('resources')
      .select(`
        *,
        resource_files (*)
      `)
      .eq('id', id)
      . single()

    return Response.json(updatedResource)

  } catch (error) {
    console.error("Error updating resource:", error)
    return Response.json({ 
      message: "Error updating resource", 
      error: String(error) 
    }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    // 1. Get all files for this resource
    const { data: files } = await supabase
      . from('resource_files')
      .select('file_url')
      .eq('resource_id', id)
    
    // 2. Delete all files from storage
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const filePath = file.file_url.split('/resources/')[1]
          if (filePath) {
            await supabase.storage.from('resources').remove([filePath])
          }
        } catch (err) {
          console.error("Error removing file from storage:", err)
        }
      }
    }

    // 3. Delete from resource_files table
    await supabase
      .from('resource_files')
      .delete()
      .eq('resource_id', id)

    // 4. Delete resource
    const { error } = await supabase
      . from('resources')
      .delete()
      .eq('id', id)
      
    if (error) throw error
    
    return Response.json({ message: "Resource deleted successfully" })
  } catch (error) {
    console.error("Error deleting resource:", error)
    return Response.json({ 
      message: "Error deleting resource", 
      error: String(error) 
    }, { status: 500 })
  }
}