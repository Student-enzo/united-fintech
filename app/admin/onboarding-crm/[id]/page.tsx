'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, Link2, FileSearch, Network, TrendingUp, CheckCircle2, AlertTriangle,
} from 'lucide-react'
import { BRAND } from '@/lib/brand'
import { getApplication } from '@/lib/onboarding-db'
import type { ApplicationWithRelations, Phase } from '@/lib/onboarding-types'
import PhaseIntake from './components/PhaseIntake'
import PhaseDocReview from './components/PhaseDocReview'
import PhasePartnerSelect from './components/PhasePartnerSelect'
import PhasePursuit from './components/PhasePursuit'
import PhaseLive from './components/PhaseLive'

const PHASE_ORDER: Phase[] = ['intake_sent', 'document_review', 'partner_selection', 'pursuit', 'live']

const TABS = [
  { key: 'intake',   label: 'Intake',            icon: <Link2 size={14}/> },
  { key: 'docs',     label: 'Doc Review',         icon: <FileSearch size={14}/> },
  { key: 'partners', label: 'Partner Selection',  icon: <Network size={14}/> },
  { key: 'pursuit',  label: 'Pursuit Pipeline',   icon: <TrendingUp size={14}/> },
  { key: 'live',     label: 'Client Live',        icon: <CheckCircle2 size={14}/> },
] as const
type TabKey = typeof TABS[number]['key']

const PHASE_TO_TAB: Record<Phase, TabKey> = {
  intake_sent:       'intake',
  document_review:   'docs',
  partner_selection: 'partners',
  pursuit:           'pursuit',
  live:              'live',
  declined:          'docs',
}

const RISK_COLOR: Record<string, string> = {
  unscored: BRAND.muted,
  low:      BRAND.success,
  medium:   BRAND.warn,
  high:     BRAND.danger,
  very_high: BRAND.danger,
}

const LINK_LABEL: Record<string, string> = {
  sent:      'Link Sent',
  opened:    'Opened',
  submitted: 'Submitted',
}

export default function OnboardingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const [app, setApp]   = useState<ApplicationWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab]   = useState<TabKey>('intake')

  const load = useCallback(async () => {
    try {
      const data = await getApplication(id)
      if (data) {
        setApp(data)
        setTab(PHASE_TO_TAB[data.current_phase] ?? 'intake')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  const pendingDocs = app?.documents?.filter(d => d.status === 'pending').length ?? 0
  const activePursuits = app?.pursuits?.filter(
    p => p.current_stage !== 'approved' && p.current_stage !== 'declined'
  ).length ?? 0

  const phaseIdx = app ? PHASE_ORDER.indexOf(app.current_phase) : -1

  function tabReached(key: TabKey) {
    const tabIdx = TABS.findIndex(t => t.key === key)
    return tabIdx <= phaseIdx || (app?.current_phase === 'declined')
  }

  if (loading) return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: BRAND.bg }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: BRAND.cyan, borderTopColor: 'transparent' }} />
        <span className="text-sm" style={{ color: BRAND.muted }}>Loading application…</span>
      </div>
    </div>
  )

  if (!app) return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: BRAND.bg, color: BRAND.muted }}>
      Application not found.
      <button onClick={() => router.push('/admin/onboarding-crm')} className="ml-3 underline">Back</button>
    </div>
  )

  const riskColor = RISK_COLOR[app.risk_tier] ?? BRAND.muted

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BRAND.bg }}>

      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 flex flex-col gap-3"
        style={{ borderBottom: `1px solid ${BRAND.border}`, backgroundColor: BRAND.card }}>

        {/* Top row */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 min-w-0">
            <button onClick={() => router.push('/admin/onboarding-crm')}
              className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-70 transition-opacity flex-shrink-0"
              style={{ color: BRAND.muted }}>
              <ArrowLeft size={15}/> Onboarding CRM
            </button>
            <div className="w-px h-5" style={{ backgroundColor: BRAND.border }} />
            <div className="flex flex-col min-w-0">
              <h1 className="text-lg font-bold truncate" style={{ color: BRAND.text }}>
                {app.business_name ?? 'Unnamed Business'}
              </h1>
              {app.owner_name && (
                <span className="text-xs" style={{ color: BRAND.muted }}>{app.owner_name}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
              style={{ backgroundColor: `${riskColor}18`, color: riskColor, border: `1px solid ${riskColor}40` }}>
              {app.risk_tier.replace('_', ' ')} risk
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
              style={{ backgroundColor: 'rgba(144,196,207,0.1)', color: BRAND.cyan, border: `1px solid ${BRAND.borderCyan}` }}>
              {app.current_phase.replace('_', ' ')}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: BRAND.silverLo, border: `1px solid ${BRAND.border}` }}>
              {LINK_LABEL[app.link_status]}
            </span>
          </div>
        </div>

        {/* Duplicate warning */}
        {app.duplicate_of && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
            style={{ backgroundColor: `${BRAND.warn}15`, color: BRAND.warn, border: `1px solid ${BRAND.warn}40` }}>
            <AlertTriangle size={13}/>
            Possible duplicate of application {app.duplicate_of}
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex-shrink-0 px-6 flex gap-1 overflow-x-auto"
        style={{ borderBottom: `1px solid rgba(144,196,207,0.1)`, backgroundColor: BRAND.card, scrollbarWidth: 'none' }}>
        {TABS.map((t, i) => {
          const reached = tabReached(t.key)
          const active  = tab === t.key
          const badge   = t.key === 'docs' && pendingDocs > 0
            ? pendingDocs
            : t.key === 'pursuit' && activePursuits > 0
              ? activePursuits
              : null
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-4 py-3.5 text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 border-b-2 -mb-px"
              style={active
                ? { borderBottomColor: BRAND.cyan, color: BRAND.cyan }
                : reached
                  ? { borderBottomColor: 'transparent', color: 'rgba(255,255,255,0.4)' }
                  : { borderBottomColor: 'transparent', color: 'rgba(255,255,255,0.18)', opacity: 0.6 }
              }>
              <span className="w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: active ? BRAND.cyan : 'rgba(255,255,255,0.08)', color: active ? BRAND.bg : BRAND.muted }}>
                {i + 1}
              </span>
              {t.icon}
              {t.label}
              {badge !== null && (
                <span className="ml-1 text-[9px] font-black px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: active ? BRAND.cyan : BRAND.warn, color: active ? BRAND.bg : '#000' }}>
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6"
        style={{ scrollbarWidth: 'thin', scrollbarColor: `${BRAND.borderCyan} transparent` }}>
        {tab === 'intake'   && <PhaseIntake application={app} onUpdate={load} />}
        {tab === 'docs'     && (
          <PhaseDocReview
            application={app}
            documents={app.documents ?? []}
            notes={app.notes ?? []}
            emailDrafts={app.emails ?? []}
            onUpdate={load}
          />
        )}
        {tab === 'partners' && (
          <PhasePartnerSelect
            application={app}
            partners={[]}
            pursuits={app.pursuits ?? []}
            onUpdate={load}
          />
        )}
        {tab === 'pursuit'  && (
          <PhasePursuit
            application={app}
            pursuits={app.pursuits ?? []}
            onUpdate={load}
          />
        )}
        {tab === 'live'     && (
          <PhaseLive
            application={app}
            pursuits={app.pursuits ?? []}
            emailDrafts={app.emails ?? []}
          />
        )}
      </div>
    </div>
  )
}
