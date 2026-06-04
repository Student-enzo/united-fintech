import { NextResponse } from 'next/server'
import { getDashboardKPIs } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const kpis = await getDashboardKPIs()
    return NextResponse.json(kpis)
  } catch (err) {
    console.error('[GET /api/dashboard/stats]', err)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
