import { NextRequest, NextResponse } from 'next/server'
import { getMerchant, updateMerchant, updateMerchantStage, deleteMerchant } from '@/lib/db'
import { logActivity } from '@/lib/activity'

export const dynamic = 'force-dynamic'

type Context = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Context) {
  const { id } = await params
  try {
    const merchant = await getMerchant(id)
    if (!merchant) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(merchant)
  } catch (err) {
    console.error('[GET /api/merchants/[id]]', err)
    return NextResponse.json({ error: 'Failed to fetch merchant' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Context) {
  const { id } = await params
  try {
    const body = await req.json()

    if (body.pipeline_stage && Object.keys(body).length === 1) {
      await updateMerchantStage(id, body.pipeline_stage)
      await logActivity(req, 'merchant_stage_changed', { merchant_id: id, stage: body.pipeline_stage })
      return NextResponse.json({ ok: true })
    }

    const merchant = await updateMerchant(id, body)
    await logActivity(req, 'merchant_updated', { merchant_id: id })
    return NextResponse.json(merchant)
  } catch (err) {
    console.error('[PATCH /api/merchants/[id]]', err)
    return NextResponse.json({ error: 'Failed to update merchant' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Context) {
  const { id } = await params
  try {
    await deleteMerchant(id)
    await logActivity(req, 'merchant_deleted', { merchant_id: id })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/merchants/[id]]', err)
    return NextResponse.json({ error: 'Failed to delete merchant' }, { status: 500 })
  }
}
