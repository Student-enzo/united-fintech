import { NextRequest, NextResponse } from 'next/server'
import { getPartner, updatePartner } from '@/lib/db'
import { logActivity } from '@/lib/activity'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type Context = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Context) {
  const { id } = await params
  try {
    const partner = await getPartner(id)
    if (!partner) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(partner)
  } catch (err) {
    console.error('[GET /api/partners/[id]]', err)
    return NextResponse.json({ error: 'Failed to fetch partner' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Context) {
  const { id } = await params
  try {
    const body = await req.json()
    const partner = await updatePartner(id, body)
    await logActivity(req, 'partner_updated', { partner_id: id })
    return NextResponse.json(partner)
  } catch (err) {
    console.error('[PATCH /api/partners/[id]]', err)
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Context) {
  const { id } = await params
  try {
    const { error } = await supabase.from('partners').delete().eq('id', id)
    if (error) throw error
    await logActivity(req, 'partner_deleted', { partner_id: id })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/partners/[id]]', err)
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 })
  }
}
