import { NextResponse } from 'next/server'
import { listCommissions } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const commissions = await listCommissions()
    return NextResponse.json(commissions)
  } catch (err) {
    console.error('[GET /api/commissions]', err)
    return NextResponse.json({ error: 'Failed to fetch commissions' }, { status: 500 })
  }
}
