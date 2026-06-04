import { NextRequest, NextResponse } from 'next/server'
import { listPartners, createPartner } from '@/lib/db'
import { logActivity } from '@/lib/activity'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const partners = await listPartners()
    return NextResponse.json(partners)
  } catch (err) {
    console.error('[GET /api/partners]', err)
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.name?.trim() || !body.type) {
      return NextResponse.json({ error: 'name and type are required' }, { status: 400 })
    }
    const partner = await createPartner({
      name:           body.name.trim(),
      type:           body.type,
      contact_email:  body.contact_email  ?? undefined,
      contact_phone:  body.contact_phone  ?? undefined,
      risk_appetite:  body.risk_appetite  ?? undefined,
      residual_terms: body.residual_terms ?? undefined,
      notes:          body.notes          ?? undefined,
    })
    await logActivity(req, 'partner_created', { partner_id: partner.id, name: partner.name })
    return NextResponse.json(partner, { status: 201 })
  } catch (err) {
    console.error('[POST /api/partners]', err)
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 })
  }
}
