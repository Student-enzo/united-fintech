import { createPortalServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  try {
    const supabase = await createPortalServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { applicationId, data } = await request.json()
    if (!applicationId || !data) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const { data: app } = await supabase
      .from('onboarding_applications')
      .select('id')
      .eq('id', applicationId)
      .eq('client_auth_user_id', user.id)
      .single()
    if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await supabase.from('onboarding_applications').update(data).eq('id', applicationId)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createPortalServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { applicationId } = await request.json()
    if (!applicationId) return NextResponse.json({ error: 'Missing applicationId' }, { status: 400 })

    const { data: app } = await supabase
      .from('onboarding_applications')
      .select('id')
      .eq('id', applicationId)
      .eq('client_auth_user_id', user.id)
      .single()
    if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const now = new Date()
    await supabase.from('onboarding_applications').update({
      intake_submitted_at: now.toISOString(),
      link_status: 'submitted',
      current_phase: 'document_review',
    }).eq('id', applicationId)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
