import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const dynamic = 'force-dynamic'

// POST /api/apply/[token]
// token = merchant UUID (the apply link uses the merchant ID directly)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token: merchantId } = await params

  // Validate merchant exists
  const { data: merchant, error: mErr } = await supabase
    .from('merchants')
    .select('id, pipeline_stage')
    .eq('id', merchantId)
    .maybeSingle()

  if (mErr || !merchant) {
    return NextResponse.json({ error: 'Invalid application link' }, { status: 404 })
  }

  const body = await req.json()

  const monthlyVolumeCents = body.monthlyVolume
    ? Math.round(parseFloat(body.monthlyVolume.replace(/[^0-9.]/g, '')) * 100)
    : null
  const avgTicketCents = body.avgTicket
    ? Math.round(parseFloat(body.avgTicket.replace(/[^0-9.]/g, '')) * 100)
    : null
  const cardPresentPct = body.cardPresentPercent
    ? parseFloat(body.cardPresentPercent)
    : null

  // Upsert application record
  const { error: appErr } = await supabase
    .from('applications')
    .upsert(
      {
        merchant_id:       merchantId,
        business_name:     body.businessName      || null,
        dba_name:          body.dba               || null,
        legal_structure:   body.legalStructure    || null,
        mcc_code:          body.mcc               || null,
        website:           body.website           || null,
        business_address:  body.businessAddress   || null,
        city:              body.city              || null,
        state:             body.state             || null,
        zip:               body.zip               || null,
        phone:             body.phone             || null,
        owner_name:        body.ownerName         || null,
        owner_ssn_last4:   body.ownerSSNLast4     || null,
        owner_dob:         body.ownerDOB          || null,
        ownership_percent: body.ownershipPercent  || null,
        owner_address:     body.ownerAddress      || null,
        owner_city:        body.ownerCity         || null,
        owner_state:       body.ownerState        || null,
        owner_zip:         body.ownerZip          || null,
        current_processor: body.currentProcessor  || null,
        monthly_volume_est: monthlyVolumeCents,
        avg_ticket:        avgTicketCents,
        card_present_pct:  cardPresentPct,
        chargeback_rate:   body.chargebackRate    || null,
        chargeback_history: body.chargebackHistory || null,
        ip_address:        req.headers.get('x-forwarded-for') ?? null,
      },
      { onConflict: 'merchant_id' }
    )

  if (appErr) {
    console.error('[apply POST] application upsert error:', appErr)
    return NextResponse.json({ error: 'Failed to save application' }, { status: 500 })
  }

  // Update merchant with submitted data and advance to underwriting
  const updates: Record<string, unknown> = {
    contact_name:  body.ownerName         || undefined,
    contact_email: body.contactEmail      || undefined,
    contact_phone: body.phone             || undefined,
    mcc_code:      body.mcc               || undefined,
    mcc_label:     body.mccLabel          || undefined,
    website:       body.website           || undefined,
    dba_name:      body.dba               || undefined,
  }
  if (monthlyVolumeCents) updates.monthly_volume_est = monthlyVolumeCents
  if (avgTicketCents)     updates.avg_ticket = avgTicketCents
  if (cardPresentPct)     updates.card_present_pct = cardPresentPct

  // Only advance to underwriting if still in early stages
  const earlyStages = ['lead_identified', 'proposal_sent', 'agreement_sent', 'agreement_signed', 'setup_fee_paid']
  if (earlyStages.includes(merchant.pipeline_stage)) {
    updates.pipeline_stage = 'underwriting'
  }

  // Clean undefined values
  for (const k of Object.keys(updates)) {
    if (updates[k] === undefined) delete updates[k]
  }

  const { error: mUpdateErr } = await supabase
    .from('merchants')
    .update(updates)
    .eq('id', merchantId)

  if (mUpdateErr) {
    console.error('[apply POST] merchant update error:', mUpdateErr)
    // Non-fatal — application was already saved
  }

  // Log activity
  await supabase.from('activity_log').insert({
    merchant_id: merchantId,
    event_type:  'application_received',
    notes:       `Application submitted by ${body.businessName || 'client'}`,
  }).maybeSingle()

  return NextResponse.json({ success: true })
}
