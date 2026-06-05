'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { fetchMerchant, saveMerchantStage } from '@/lib/merchants-db'
import {
  ArrowLeft, Building2, TrendingUp, Shield, BarChart2,
  FileSearch, FileEdit, Activity, AlertTriangle, CheckCircle2, Copy, Check,
} from 'lucide-react'
import { BRAND } from '@/lib/brand'
import { STAGE_META, type MerchantRecord, type PipelineStage } from '@/lib/mock-merchants'
import MDOverview    from '@/components/admin/merchant-detail/MDOverview'
import MDPipeline    from '@/components/admin/merchant-detail/MDPipeline'
import MDDocuments   from '@/components/admin/merchant-detail/MDDocuments'
import MDFinance     from '@/components/admin/merchant-detail/MDFinance'
import MDStatements  from '@/components/admin/merchant-detail/MDStatements'
import MDAutoFill    from '@/components/admin/merchant-detail/MDAutoFill'
import MDActivityChat from '@/components/admin/merchant-detail/MDActivityChat'

const TABS = [
  { n: 1, key: 'overview',   label: 'Overview',    icon: <Building2 size={14}/> },
  { n: 2, key: 'pipeline',   label: 'Pipeline',    icon: <TrendingUp size={14}/> },
  { n: 3, key: 'documents',  label: 'Documents',   icon: <Shield size={14}/> },
  { n: 4, key: 'finance',    label: 'Finance',     icon: <BarChart2 size={14}/> },
  { n: 5, key: 'statements', label: 'Statements',  icon: <FileSearch size={14}/> },
  { n: 6, key: 'autofill',   label: 'Auto-Fill',   icon: <FileEdit size={14}/> },
  { n: 7, key: 'activity',   label: 'Activity & Chat', icon: <Activity size={14}/> },
] as const
type TabKey = typeof TABS[number]['key']

const RISK_COLOR: Record<string, string> = { low: BRAND.success, medium: BRAND.warn, high: BRAND.danger }

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(value).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),1800) }}
      className="hover:opacity-70 transition-opacity" style={{ color: copied ? BRAND.success : BRAND.muted }}>
      {copied ? <Check size={11}/> : <Copy size={11}/>}
    </button>
  )
}

export default function MerchantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const [tab, setTab]           = useState<TabKey>('overview')
  const [merchant, setMerchant] = useState<MerchantRecord | null>(null)
  const [loadingMerchant, setLoadingMerchant] = useState(true)
  const [activityLog, setActivityLog] = useState<Array<{
    id: string; text: string; date: string; color: string
  }>>([])

  useEffect(() => {
    fetchMerchant(id)
      .then(m => {
        setMerchant(m)
        if (m) {
          setActivityLog([
            { id:'a1', text:`Stage: ${STAGE_META[m.pipeline_stage].label}`, date:'2 days ago', color: BRAND.cyan },
            { id:'a2', text:`Partner assigned: ${m.partner}`,               date:'5 days ago', color: '#C4B5FD' },
            { id:'a3', text:'Merchant record created',                       date: m.date_added, color: BRAND.muted },
          ])
        }
      })
      .catch(console.error)
      .finally(() => setLoadingMerchant(false))
  }, [id])

  if (loadingMerchant) return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: BRAND.cyan, borderTopColor: 'transparent' }} />
        <span className="text-sm" style={{ color: BRAND.muted }}>Loading merchant…</span>
      </div>
    </div>
  )

  if (!merchant) return (
    <div className="flex items-center justify-center h-screen" style={{ color: BRAND.muted }}>
      Merchant not found. <button onClick={() => router.push('/admin/merchants')} className="ml-3 underline">Back</button>
    </div>
  )

  const sm = STAGE_META[merchant.pipeline_stage]

  function addActivity(text: string, color: string) {
    setActivityLog(prev => [{ id:`a${Date.now()}`, text, date:'just now', color }, ...prev])
  }

  function handleStageChange(stage: PipelineStage) {
    setMerchant(m => m ? { ...m, pipeline_stage: stage, days_in_stage: 0 } : m)
    addActivity(`Stage → ${STAGE_META[stage].label}`, BRAND.cyan)
    saveMerchantStage(id, stage).catch(console.error)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BRAND.bg }}>

      {/* ── Top bar ── */}
      <div className="flex-shrink-0 px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${BRAND.border}`, backgroundColor: BRAND.card }}>
        <div className="flex items-center gap-4 min-w-0">
          <button onClick={() => router.push('/admin/merchants')}
            className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-70 transition-opacity flex-shrink-0"
            style={{ color: BRAND.muted }}>
            <ArrowLeft size={15}/> Merchants
          </button>
          <div className="w-px h-5" style={{ backgroundColor: BRAND.border }} />
          <div className="flex items-center gap-3 min-w-0 flex-wrap">
            <h1 className="text-lg font-bold truncate" style={{ color: BRAND.text }}>{merchant.name}</h1>
            {merchant.dba_name && <span className="text-sm" style={{ color: BRAND.muted }}>DBA: {merchant.dba_name}</span>}
            {merchant.risk && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0"
                style={{ backgroundColor:`${RISK_COLOR[merchant.risk]}18`, color:RISK_COLOR[merchant.risk], border:`1px solid ${RISK_COLOR[merchant.risk]}40` }}>
                {merchant.risk} risk
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0"
              style={{ backgroundColor:sm.bg, color:sm.color, border:`1px solid ${sm.border}` }}>
              {sm.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          {merchant.contact_email && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs" style={{ color: BRAND.muted }}>{merchant.contact_email}</span>
              <CopyBtn value={merchant.contact_email} />
            </div>
          )}
          {merchant.contact_phone && (
            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-xs" style={{ color: BRAND.muted }}>{merchant.contact_phone}</span>
              <CopyBtn value={merchant.contact_phone} />
            </div>
          )}
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex-shrink-0 px-6 flex gap-1 overflow-x-auto"
        style={{ borderBottom: `1px solid ${BRAND.border}`, backgroundColor: BRAND.card, scrollbarWidth:'none' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="flex items-center gap-2 px-4 py-3.5 text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 border-b-2 -mb-px"
            style={tab === t.key
              ? { borderBottomColor: BRAND.cyan, color: BRAND.cyan }
              : { borderBottomColor: 'transparent', color: BRAND.muted }
            }>
            <span className="w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: tab === t.key ? BRAND.cyan : 'rgba(255,255,255,0.08)', color: tab === t.key ? BRAND.bg : BRAND.muted }}>
              {t.n}
            </span>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-6 py-6"
        style={{ scrollbarWidth:'thin', scrollbarColor:`${BRAND.borderCyan} transparent` }}>
        {tab === 'overview'   && <MDOverview   merchant={merchant} />}
        {tab === 'pipeline'   && <MDPipeline   merchant={merchant} onStageChange={handleStageChange} addActivity={addActivity} />}
        {tab === 'documents'  && <MDDocuments  merchant={merchant} addActivity={addActivity} />}
        {tab === 'finance'    && <MDFinance    merchant={merchant} />}
        {tab === 'statements' && <MDStatements merchant={merchant} />}
        {tab === 'autofill'   && <MDAutoFill   merchant={merchant} />}
        {tab === 'activity'   && <MDActivityChat merchant={merchant} activityLog={activityLog} addActivity={addActivity} />}
      </div>
    </div>
  )
}
