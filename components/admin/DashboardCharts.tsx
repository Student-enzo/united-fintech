'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const VolumeChart        = dynamic(() => import('./charts/VolumeChart'),        { ssr: false, loading: () => <ChartSkeleton /> })
const PartnerResidualChart = dynamic(() => import('./charts/PartnerResidualChart'), { ssr: false, loading: () => <ChartSkeleton /> })
const PipelineFunnelChart  = dynamic(() => import('./charts/PipelineFunnelChart'),  { ssr: false, loading: () => <ChartSkeleton /> })

function ChartSkeleton() {
  return <div className="h-[220px] rounded-lg animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
}

type ChartData = {
  monthly:          { month: string; volume: number; residual: number }[]
  partnerResiduals: { partner_name: string; residual: number }[]
  stageCounts:      { stage: string; count: number }[]
}

const CARD: React.CSSProperties = {
  backgroundColor: '#141821',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  padding: '20px',
}

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  color: 'rgba(30,168,212,0.7)',
  marginBottom: 4,
}

const SECTION_TITLE: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: 'rgba(255,255,255,0.85)',
  marginBottom: 16,
}

export default function DashboardCharts() {
  const [data, setData]       = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/charts')
      .then(r => r.ok ? r.json() : null)
      .then((d: ChartData | null) => { if (d) setData(d) })
      .finally(() => setLoading(false))
  }, [])

  const empty: ChartData = { monthly: [], partnerResiduals: [], stageCounts: [] }
  const { monthly, partnerResiduals, stageCounts } = data ?? empty

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
      {/* Processing Volume + Residual trend */}
      <div style={{ ...CARD, gridColumn: '1 / -1' }}>
        <p style={SECTION_LABEL}>Revenue</p>
        <p style={SECTION_TITLE}>Processing Volume &amp; Net Residual — Last 12 Months</p>
        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <span className="inline-block w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(180deg,#1EA8D4 0%,#0E8FB8 100%)' }} />
            Processing Volume
          </span>
          <span className="flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <span className="inline-block w-6 h-0.5 rounded" style={{ backgroundColor: '#3DD68C' }} />
            Net Residual
          </span>
        </div>
        {loading ? <ChartSkeleton /> : <VolumeChart data={monthly} />}
      </div>

      {/* Residuals by partner */}
      <div style={CARD}>
        <p style={SECTION_LABEL}>Partners</p>
        <p style={SECTION_TITLE}>Residuals by Partner</p>
        {loading ? <ChartSkeleton /> : <PartnerResidualChart data={partnerResiduals} />}
      </div>

      {/* Pipeline funnel */}
      <div style={CARD}>
        <p style={SECTION_LABEL}>Pipeline</p>
        <p style={SECTION_TITLE}>Merchants by Stage</p>
        {loading ? <ChartSkeleton /> : <PipelineFunnelChart data={stageCounts} />}
      </div>
    </div>
  )
}
