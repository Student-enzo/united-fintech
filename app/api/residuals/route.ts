import { NextResponse } from 'next/server'
import { listResiduals } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const residuals = await listResiduals()
    return NextResponse.json(residuals)
  } catch (err) {
    console.error('[GET /api/residuals]', err)
    return NextResponse.json({ error: 'Failed to fetch residuals' }, { status: 500 })
  }
}
