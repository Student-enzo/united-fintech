export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const applicationId = searchParams.get('applicationId')

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: 'applicationId query param is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('onboarding_emails')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, emails: data ?? [] })
  } catch (err) {
    console.error('[emails GET]', err)
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { application_id, email_type, subject, body: emailBody, to_email, pursuit_id } = body

    if (!application_id || !email_type || !subject || !emailBody) {
      return NextResponse.json(
        { success: false, error: 'application_id, email_type, subject, and body are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('onboarding_emails')
      .insert({
        application_id,
        email_type,
        subject,
        body: emailBody,
        to_email: to_email ?? null,
        pursuit_id: pursuit_id ?? null,
        status: 'draft',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, email: data }, { status: 201 })
  } catch (err) {
    console.error('[emails POST]', err)
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('onboarding_emails')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, email: data })
  } catch (err) {
    console.error('[emails PATCH]', err)
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
