export const dynamic = 'force-dynamic'

import DashboardKPIs   from '@/components/admin/DashboardKPIs'
import DashboardCharts from '@/components/admin/DashboardCharts'
import AlertsPanel     from '@/components/admin/AlertsPanel'

export default function AdminDashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-wide"
          style={{
            background: 'linear-gradient(90deg, #C9D1D9 0%, #FFFFFF 45%, #8A929C 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
          United Fintech · Admin Overview
        </p>
      </div>

      {/* KPI cards */}
      <DashboardKPIs />

      {/* Charts row + Alerts sidebar */}
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        <DashboardCharts />
        <AlertsPanel />
      </div>
    </div>
  )
}
