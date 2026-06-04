export const dynamic = 'force-dynamic'

import DashboardKPIs from '@/components/admin/DashboardKPIs'

export default function AdminDashboardPage() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold tracking-wide"
          style={{
            background: 'linear-gradient(90deg, #C9D1D9 0%, #FFFFFF 45%, #8A929C 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
          United Fintech · Admin Overview
        </p>
      </div>

      {/* KPI cards */}
      <DashboardKPIs />

      {/* Phase note */}
      <div
        className="mt-8 rounded-xl px-5 py-4"
        style={{
          backgroundColor: 'rgba(43,184,230,0.06)',
          border: '1px solid rgba(43,184,230,0.18)',
        }}
      >
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-1"
          style={{ color: 'rgba(43,184,230,0.7)' }}
        >
          Phase 6
        </p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Live dashboard metrics and charts are coming in Phase 6. KPI values above are
          placeholder zeros until data pipelines are wired.
        </p>
      </div>
    </div>
  )
}
