import { createPortalServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createPortalServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData      = await request.formData()
    const applicationId = formData.get('applicationId') as string
    const docType       = formData.get('docType')       as string
    const docLabel      = formData.get('docLabel')      as string
    const file          = formData.get('file')          as File

    if (!applicationId || !docType || !file) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Verify ownership
    const { data: app } = await supabase
      .from('onboarding_applications')
      .select('id')
      .eq('id', applicationId)
      .eq('client_auth_user_id', user.id)
      .single()
    if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const ext      = file.name.split('.').pop() ?? 'bin'
    const uuid     = crypto.randomUUID()
    const path     = `${applicationId}/${docType}-${uuid}.${ext}`
    const arrayBuf = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from('onboarding-documents')
      .upload(path, arrayBuf, { contentType: file.type, upsert: false })

    let fileUrl: string | null = null
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('onboarding-documents')
        .getPublicUrl(path)
      fileUrl = publicUrl
    }

    const { data: doc } = await supabase.from('onboarding_documents').insert({
      application_id:    applicationId,
      doc_type:          docType,
      doc_label:         docLabel || docType,
      file_url:          fileUrl,
      file_name:         file.name,
      file_size_bytes:   file.size,
      status:            'pending',
      is_client_visible: true,
    }).select().single()

    return NextResponse.json(doc)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
