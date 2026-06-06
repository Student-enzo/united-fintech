export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { randomBytes } from 'crypto'

function generateToken(): string {
  return randomBytes(24).toString('hex')
}

function tokenExpiresAt(): string {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString()
}

function buildIntakeEmailDraft(
  applicationId: string,
  ownerEmail: string,
  businessName: string,
  token: string
) {
  const intakeLink = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://united-fintech.vercel.app'}/apply/${token}`
  const subject = `Your Merchant Account Application — ${businessName}`
  const body = `Dear ${businessName} Team,

Thank you for your interest in merchant processing services through United Fintech.

We have created your secure application portal. Please use the link below to complete your intake form and upload the required documents:

${intakeLink}

This link is valid for 30 days. Please complete your application at your earliest convenience.

If you have any questions, don't hesitate to reach out to our team.

Best regards,
United Fintech Onboarding Team`

  return {
    application_id: applicationId,
    email_type: 'intake_link',
    subject,
    body,
    to_email: ownerEmail,
    status: 'draft',
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('onboarding_applications')
      .select(`
        *,
        documents:onboarding_documents(count),
        notes:onboarding_notes(count),
        pursuits:onboarding_pursuits(count),
        emails:onboarding_emails(count)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data: data ?? [] })
  } catch (err) {
    console.error('[applications GET]', err)
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      owner_email,
      business_name,
      ein,
      owner_name,
      owner_phone,
      mcc,
      monthly_volume,
      website,
      business_type,
    } = body

    if (!owner_email || !business_name) {
      return NextResponse.json(
        { success: false, error: 'owner_email and business_name are required' },
        { status: 400 }
      )
    }

    // Duplicate check
    const orFilter: string[] = []
    if (ein) orFilter.push(`ein.eq.${ein}`)
    orFilter.push(`business_name.ilike.${business_name}`)

    const { data: duplicates } = await supabase
      .from('onboarding_applications')
      .select('id, business_name, ein, created_at')
      .or(orFilter.join(','))
      .limit(5)

    if (duplicates && duplicates.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Duplicate detected',
          duplicates,
        },
        { status: 409 }
      )
    }

    const intake_token = generateToken()
    const intake_token_expires_at = tokenExpiresAt()

    const { data: application, error: insertError } = await supabase
      .from('onboarding_applications')
      .insert({
        owner_email,
        business_name,
        ein: ein ?? null,
        owner_name: owner_name ?? null,
        owner_phone: owner_phone ?? null,
        mcc: mcc ?? null,
        monthly_volume: monthly_volume ?? null,
        website: website ?? null,
        business_type: business_type ?? null,
        intake_token,
        intake_token_expires_at,
        current_phase: 'intake_sent',
        link_status: 'sent',
        chargeback_history: 'none',
        co_owners: [],
      })
      .select()
      .single()

    if (insertError) throw insertError

    const emailRow = buildIntakeEmailDraft(
      application.id,
      owner_email,
      business_name,
      intake_token
    )

    const { data: emailDraft, error: emailError } = await supabase
      .from('onboarding_emails')
      .insert(emailRow)
      .select()
      .single()

    if (emailError) console.error('[applications POST] email draft error:', emailError)

    const intakeLink = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://united-fintech.vercel.app'}/apply/${intake_token}`

    return NextResponse.json(
      { success: true, application, emailDraft: emailDraft ?? null, intakeLink },
      { status: 201 }
    )
  } catch (err) {
    console.error('[applications POST]', err)
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
