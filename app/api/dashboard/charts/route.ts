import { NextResponse } from 'next/server'
import { getMonthlyStats, getResidualsByPartner, listMerchants } from '@/lib/db'
import type { PipelineStage } from '@/lib/db'

export const dynamic = 'force-dynamic'

const STAGE_ORDER: PipelineStage[] = [
  'new_lead', 'application_started', 'submitted_to_processor',
  'underwriting', 'approved', 'live', 'closed_lost',
]

const STAGE_LABELS: Record<PipelineStage, string> = {
  new_lead:               'New Lead',
  application_started:    'Application',
  submitted_to_processor: 'Submitted',
  underwriting:           'Underwriting',
  approved:               'Approved',
  live:                   'Live',
  closed_lost:            'Closed',
}

export async function GET() {
  try {
    const [monthly, partnerResiduals, merchants] = await Promise.all([
      getMonthlyStats(),
      getResidualsByPartner(),
      listMerchants(),
    ])

    const stageCounts = STAGE_ORDER.map(stage => ({
      stage:  STAGE_LABELS[stage],
      count:  merchants.filter(m => m.pipeline_stage === stage).length,
    }))

    return NextResponse.json({ monthly, partnerResiduals, stageCounts })
  } catch (err) {
    console.error('[GET /api/dashboard/charts]', err)
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 })
  }
}
