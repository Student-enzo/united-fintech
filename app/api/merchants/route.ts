import { NextRequest, NextResponse } from 'next/server'
import { listMerchants, createMerchant } from '@/lib/db'
import { logActivity } from '@/lib/activity'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const merchants = await listMerchants()
    return NextResponse.json(merchants)
  } catch (err) {
    console.error('[GET /api/merchants]', err)
    return NextResponse.json({ error: 'Failed to fetch merchants' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }
    const merchant = await createMerchant({
      name:           body.name.trim(),
      legal_entity:   body.legal_entity   ?? undefined,
      email:          body.email          ?? undefined,
      phone:          body.phone          ?? undefined,
      website:        body.website        ?? undefined,
      mcc:            body.mcc            ?? undefined,
      business_type:  body.business_type  ?? undefined,
      country:        body.country        ?? undefined,
      monthly_volume: body.monthly_volume ?? undefined,
      risk_tier:      body.risk_tier      ?? undefined,
      pipeline_stage: body.pipeline_stage ?? 'new_lead',
      source:         body.source         ?? undefined,
      partner_id:     body.partner_id     ?? undefined,
      notes:          body.notes          ?? undefined,
    })
    await logActivity(req, 'merchant_created', { name: merchant.name, merchant_id: merchant.id })
    return NextResponse.json(merchant, { status: 201 })
  } catch (err) {
    console.error('[POST /api/merchants]', err)
    return NextResponse.json({ error: 'Failed to create merchant' }, { status: 500 })
  }
}
