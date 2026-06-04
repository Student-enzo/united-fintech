import { NextRequest, NextResponse } from 'next/server'
import { getDeal, updateDealStatus } from '@/lib/db'
import { logActivity } from '@/lib/activity'

export const dynamic = 'force-dynamic'

type Context = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Context) {
  const { id } = await params
  try {
    const deal = await getDeal(id)
    if (!deal) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(deal)
  } catch (err) {
    console.error('[GET /api/deals/[id]]', err)
    return NextResponse.json({ error: 'Failed to fetch deal' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Context) {
  const { id } = await params
  try {
    const body = await req.json()
    if (body.status) {
      await updateDealStatus(id, body.status)
      await logActivity(req, 'deal_status_changed', { deal_id: id, status: body.status })
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'No updatable field provided' }, { status: 400 })
  } catch (err) {
    console.error('[PATCH /api/deals/[id]]', err)
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 })
  }
}
