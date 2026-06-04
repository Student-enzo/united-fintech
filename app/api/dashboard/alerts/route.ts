import { NextResponse } from 'next/server'
import { listConsultations, listMerchants, listDeals, listResiduals } from '@/lib/db'

export const dynamic = 'force-dynamic'

export type AlertItem = {
  id:       string
  type:     'consultation' | 'merchant' | 'deal' | 'residual'
  severity: 'info' | 'warn' | 'danger'
  title:    string
  detail:   string
  href:     string
}

export async function GET() {
  try {
    const [consultations, merchants, deals, residuals] = await Promise.all([
      listConsultations(),
      listMerchants(),
      listDeals(),
      listResiduals(),
    ])

    const alerts: AlertItem[] = []

    // New consultation requests
    const newConsults = consultations.filter(c => c.status === 'new')
    for (const c of newConsults.slice(0, 5)) {
      alerts.push({
        id:       `consult-${c.id}`,
        type:     'consultation',
        severity: 'info',
        title:    `New consultation: ${c.name}`,
        detail:   c.company ? `${c.company} · ${c.service_interest ?? 'General'}` : (c.service_interest ?? 'General inquiry'),
        href:     '/admin/activity',
      })
    }

    // High-risk merchants needing attention
    const highRisk = merchants.filter(m => m.risk_tier === 'high' && m.pipeline_stage !== 'live' && m.pipeline_stage !== 'closed_lost')
    for (const m of highRisk.slice(0, 3)) {
      alerts.push({
        id:       `risk-${m.id}`,
        type:     'merchant',
        severity: 'danger',
        title:    `High-risk merchant stalled: ${m.name}`,
        detail:   `Stage: ${m.pipeline_stage.replace(/_/g, ' ')}`,
        href:     '/admin/merchants',
      })
    }

    // Deals stuck in underwriting
    const stuckDeals = deals.filter(d => d.status === 'underwriting')
    if (stuckDeals.length > 0) {
      alerts.push({
        id:       'deals-underwriting',
        type:     'deal',
        severity: 'warn',
        title:    `${stuckDeals.length} deal${stuckDeals.length > 1 ? 's' : ''} in underwriting`,
        detail:   'Review and advance or follow up with processor',
        href:     '/admin/deals',
      })
    }

    // Pending residuals
    const pendingResiduals = residuals.filter(r => r.status === 'pending')
    if (pendingResiduals.length > 0) {
      alerts.push({
        id:       'residuals-pending',
        type:     'residual',
        severity: 'info',
        title:    `${pendingResiduals.length} residual${pendingResiduals.length > 1 ? 's' : ''} pending receipt`,
        detail:   'Mark as received once confirmed with partners',
        href:     '/admin/residuals',
      })
    }

    // Sort: danger first, then warn, then info
    const order = { danger: 0, warn: 1, info: 2 }
    alerts.sort((a, b) => order[a.severity] - order[b.severity])

    return NextResponse.json(alerts)
  } catch (err) {
    console.error('[GET /api/dashboard/alerts]', err)
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
  }
}
