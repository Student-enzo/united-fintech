import { NextRequest, NextResponse } from 'next/server'
import { listAgreements, createAgreement } from '@/lib/db'
import { logActivity } from '@/lib/activity'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const agreements = await listAgreements()
    return NextResponse.json(agreements)
  } catch (err) {
    console.error('[GET /api/agreements]', err)
    return NextResponse.json({ error: 'Failed to fetch agreements' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.merchant_id || !body.product_type) {
      return NextResponse.json({ error: 'merchant_id and product_type are required' }, { status: 400 })
    }
    const agreement = await createAgreement({
      deal_id:            body.deal_id            ?? undefined,
      merchant_id:        body.merchant_id,
      partner_id:         body.partner_id         ?? undefined,
      product_type:       body.product_type,
      signed_date:        body.signed_date        ?? undefined,
      go_live_date:       body.go_live_date       ?? undefined,
      rate:               body.rate               ?? undefined,
      residual_split_pct: body.residual_split_pct ?? undefined,
      status:             body.status             ?? 'draft',
      doc_url:            body.doc_url            ?? undefined,
      notes:              body.notes              ?? undefined,
    })
    await logActivity(req, 'agreement_created', { agreement_id: agreement.id })
    return NextResponse.json(agreement, { status: 201 })
  } catch (err) {
    console.error('[POST /api/agreements]', err)
    return NextResponse.json({ error: 'Failed to create agreement' }, { status: 500 })
  }
}
