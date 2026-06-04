import { NextRequest, NextResponse } from 'next/server'
import { listDeals, createDeal } from '@/lib/db'
import { logActivity } from '@/lib/activity'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const deals = await listDeals()
    return NextResponse.json(deals)
  } catch (err) {
    console.error('[GET /api/deals]', err)
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.merchant_id || !body.product_type) {
      return NextResponse.json({ error: 'merchant_id and product_type are required' }, { status: 400 })
    }
    const deal = await createDeal({
      merchant_id:        body.merchant_id,
      partner_id:         body.partner_id         ?? undefined,
      product_type:       body.product_type,
      proposed_rate:      body.proposed_rate       ?? undefined,
      est_monthly_volume: body.est_monthly_volume  ?? undefined,
      status:             body.status              ?? 'draft',
      calculation:        body.calculation         ?? undefined,
      notes:              body.notes               ?? undefined,
      deal_number:        body.deal_number         ?? undefined,
    })
    await logActivity(req, 'deal_created', { deal_id: deal.id, merchant_id: deal.merchant_id })
    return NextResponse.json(deal, { status: 201 })
  } catch (err) {
    console.error('[POST /api/deals]', err)
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 })
  }
}
