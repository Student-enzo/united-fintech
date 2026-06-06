export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      application_id,
      doc_type,
      doc_label,
      file_url,
      file_name,
      file_size_bytes,
      is_client_visible,
    } = body

    if (!application_id || !doc_type) {
      return NextResponse.json(
        { success: false, error: 'application_id and doc_type are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('onboarding_documents')
      .insert({
        application_id,
        doc_type,
        doc_label: doc_label ?? doc_type,
        file_url: file_url ?? null,
        file_name: file_name ?? null,
        file_size_bytes: file_size_bytes ?? null,
        status: 'pending',
        ai_flags: { suspicious: false, stale: false, misclassified: false },
        is_client_visible: is_client_visible ?? true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, document: data }, { status: 201 })
  } catch (err) {
    console.error('[documents POST]', err)
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, notes, ai_analysis, ai_flags } = body

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'id and status are required' },
        { status: 400 }
      )
    }

    const allowed = ['pending', 'accepted', 'rejected', 're_upload_requested']
    if (!allowed.includes(status)) {
      return NextResponse.json(
        { success: false, error: `status must be one of: ${allowed.join(', ')}` },
        { status: 400 }
      )
    }

    const update: Record<string, unknown> = {
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: 'admin',
    }

    if (notes !== undefined) update.notes = notes
    if (ai_analysis !== undefined) update.ai_analysis = ai_analysis
    if (ai_flags !== undefined) update.ai_flags = ai_flags

    const { data, error } = await supabase
      .from('onboarding_documents')
      .update(update)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, document: data })
  } catch (err) {
    console.error('[documents PATCH]', err)
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
