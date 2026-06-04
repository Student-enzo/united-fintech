import { NextRequest, NextResponse } from 'next/server'
import { getAgreement, updateAgreementStatus } from '@/lib/db'
import { logActivity } from '@/lib/activity'

export const dynamic = 'force-dynamic'

type Context = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Context) {
  const { id } = await params
  try {
    const agreement = await getAgreement(id)
    if (!agreement) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(agreement)
  } catch (err) {
    console.error('[GET /api/agreements/[id]]', err)
    return NextResponse.json({ error: 'Failed to fetch agreement' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Context) {
  const { id } = await params
  try {
    const body = await req.json()
    if (body.status) {
      await updateAgreementStatus(id, body.status)
      await logActivity(req, 'agreement_status_changed', { agreement_id: id, status: body.status })
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'No updatable field provided' }, { status: 400 })
  } catch (err) {
    console.error('[PATCH /api/agreements/[id]]', err)
    return NextResponse.json({ error: 'Failed to update agreement' }, { status: 500 })
  }
}
