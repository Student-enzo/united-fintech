'use client'

import { useState, useEffect } from 'react'
import {
  CreditCard,
  Globe,
  Users,
  Bell,
  Activity,
  ChevronDown,
  Check,
} from 'lucide-react'
import { BRAND } from '@/lib/brand'

// ─── Types ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'uf_admin_settings'

interface ProcessingDefaults {
  reservePercent: number
  defaultTermLength: '1yr' | '2yr' | '3yr'
  maxDailyLimit: number
  autoApproveThreshold: number
}

interface GeographicCoverage {
  supportedStates: string[]
  excludedMccs: string
}

interface CommissionDefaults {
  aeSplitPercent: number
  partnerSplitPercent: number
  residualPaymentDay: '1st' | '15th' | 'last'
}

interface NotificationSettings {
  emailOnNewApplication: boolean
  emailOnAgreementSigned: boolean
  alertOnHighChargeback: boolean
  alertOnMerchantAtRisk: boolean
}

interface ActivityLogSettings {
  detailedLoggingEnabled: boolean
  retentionDays: 30 | 60 | 90 | 180
}

interface UFSettings {
  processing: ProcessingDefaults
  geographic: GeographicCoverage
  commission: CommissionDefaults
  notifications: NotificationSettings
  activityLog: ActivityLogSettings
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
]

const DEFAULTS: UFSettings = {
  processing: {
    reservePercent: 5,
    defaultTermLength: '2yr',
    maxDailyLimit: 50000,
    autoApproveThreshold: 500,
  },
  geographic: {
    supportedStates: ['FL','TX','CA','NY','GA','IL','OH','NC','AZ','CO'],
    excludedMccs: '5933, 7995, 6051, 5912',
  },
  commission: {
    aeSplitPercent: 60,
    partnerSplitPercent: 25,
    residualPaymentDay: '15th',
  },
  notifications: {
    emailOnNewApplication: true,
    emailOnAgreementSigned: true,
    alertOnHighChargeback: true,
    alertOnMerchantAtRisk: true,
  },
  activityLog: {
    detailedLoggingEnabled: true,
    retentionDays: 90,
  },
}

// ─── Utility components ───────────────────────────────────────────────────────

interface SectionCardProps {
  title: string
  subtitle?: string
  icon: React.ElementType
  children: React.ReactNode
  onSave: () => void
  saved: boolean
}

function SectionCard({ title, subtitle, icon: Icon, children, onSave, saved }: SectionCardProps) {
  return (
    <div
      style={{
        borderRadius: '14px',
        border: `1px solid ${BRAND.border}`,
        backgroundColor: BRAND.card,
        overflow: 'hidden',
        marginBottom: '20px',
      }}
    >
      {/* Section header */}
      <div
        style={{
          padding: '18px 24px 14px',
          borderBottom: `1px solid ${BRAND.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            backgroundColor: 'rgba(144,196,207,0.1)',
            border: `1px solid rgba(144,196,207,0.2)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={16} color={BRAND.cyan} />
        </div>
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: BRAND.text, margin: 0 }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: '12px', color: BRAND.muted, margin: '2px 0 0' }}>{subtitle}</p>
          )}
        </div>
      </div>

      {/* Section body */}
      <div style={{ padding: '24px' }}>
        {children}

        {/* Save row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px', paddingTop: '20px', borderTop: `1px solid ${BRAND.border}` }}>
          <button
            onClick={onSave}
            style={{
              padding: '9px 22px',
              borderRadius: '10px',
              backgroundColor: BRAND.cyan,
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 18px rgba(144,196,207,0.25)',
              transition: 'opacity 0.15s',
            }}
          >
            Save Changes
          </button>
          {saved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: BRAND.success, fontSize: '13px', fontWeight: 500 }}>
              <Check size={14} />
              Saved
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Small components

interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 48,
        height: 26,
        borderRadius: 13,
        border: `1px solid ${checked ? BRAND.cyan + '99' : BRAND.border}`,
        backgroundColor: checked ? 'rgba(144,196,207,0.25)' : 'rgba(255,255,255,0.05)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background-color 0.2s, border-color 0.2s',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: checked ? 24 : 2,
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: checked ? BRAND.cyan : BRAND.muted,
          transition: 'left 0.2s, background-color 0.2s',
          boxShadow: checked ? `0 0 8px ${BRAND.cyan}66` : 'none',
        }}
      />
    </button>
  )
}

interface FieldProps {
  label: string
  hint?: string
  children: React.ReactNode
}

function Field({ label, hint, children }: FieldProps) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: BRAND.muted,
          marginBottom: '6px',
        }}
      >
        {label}
      </label>
      {children}
      {hint && (
        <p style={{ fontSize: '11px', color: BRAND.muted, margin: '4px 0 0' }}>{hint}</p>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: '10px',
  border: `1px solid ${BRAND.border}`,
  backgroundColor: BRAND.bg,
  color: BRAND.text,
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
}

interface SelectProps {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}

function Select({ value, onChange, options }: SelectProps) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          ...inputStyle,
          appearance: 'none',
          paddingRight: '36px',
          cursor: 'pointer',
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown
        size={14}
        color={BRAND.muted}
        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
      />
    </div>
  )
}

interface ToggleRowProps {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '14px 0',
        borderBottom: `1px solid ${BRAND.border}`,
      }}
    >
      <div>
        <p style={{ fontSize: '13px', fontWeight: 500, color: BRAND.text, margin: 0 }}>{label}</p>
        <p style={{ fontSize: '11px', color: BRAND.muted, margin: '2px 0 0' }}>{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

// ─── State selector ───────────────────────────────────────────────────────────

function StateSelector({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (v: string[]) => void
}) {
  function toggle(state: string) {
    onChange(
      selected.includes(state)
        ? selected.filter(s => s !== state)
        : [...selected, state]
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {US_STATES.map(s => {
          const active = selected.includes(s)
          return (
            <button
              key={s}
              onClick={() => toggle(s)}
              style={{
                padding: '4px 10px',
                borderRadius: '7px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                border: `1px solid ${active ? BRAND.cyan + '66' : BRAND.border}`,
                backgroundColor: active ? 'rgba(144,196,207,0.15)' : 'rgba(255,255,255,0.03)',
                color: active ? BRAND.cyan : BRAND.muted,
                transition: 'all 0.15s',
              }}
            >
              {s}
            </button>
          )
        })}
      </div>
      <p style={{ fontSize: '11px', color: BRAND.muted, margin: '8px 0 0' }}>
        {selected.length} state{selected.length !== 1 ? 's' : ''} selected
      </p>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [settings, setSettings] = useState<UFSettings>(DEFAULTS)
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) })
    } catch { /* ignore */ }
  }, [])

  function saveSection(key: keyof UFSettings) {
    const next = { ...settings }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setSaved(prev => ({ ...prev, [key]: true }))
    setTimeout(() => setSaved(prev => ({ ...prev, [key]: false })), 2500)
  }

  function setProcessing<K extends keyof ProcessingDefaults>(k: K, v: ProcessingDefaults[K]) {
    setSettings(s => ({ ...s, processing: { ...s.processing, [k]: v } }))
  }
  function setGeographic<K extends keyof GeographicCoverage>(k: K, v: GeographicCoverage[K]) {
    setSettings(s => ({ ...s, geographic: { ...s.geographic, [k]: v } }))
  }
  function setCommission<K extends keyof CommissionDefaults>(k: K, v: CommissionDefaults[K]) {
    setSettings(s => ({ ...s, commission: { ...s.commission, [k]: v } }))
  }
  function setNotification<K extends keyof NotificationSettings>(k: K, v: NotificationSettings[K]) {
    setSettings(s => ({ ...s, notifications: { ...s.notifications, [k]: v } }))
  }
  function setActivityLog<K extends keyof ActivityLogSettings>(k: K, v: ActivityLogSettings[K]) {
    setSettings(s => ({ ...s, activityLog: { ...s.activityLog, [k]: v } }))
  }

  const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1
          style={{
            fontSize: '22px',
            fontWeight: 700,
            margin: '0 0 4px',
            letterSpacing: '-0.01em',
            background: `linear-gradient(135deg, ${BRAND.text} 0%, ${BRAND.cyan} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Settings
        </h1>
        <p style={{ fontSize: '13px', color: BRAND.muted, margin: 0 }}>
          Configure platform defaults, coverage rules, and notification preferences
        </p>
      </div>

      {/* ── Processing Defaults ─────────────────────────────────────── */}
      <SectionCard
        title="Processing Defaults"
        subtitle="Default values applied to new merchant applications"
        icon={CreditCard}
        onSave={() => saveSection('processing')}
        saved={!!saved.processing}
      >
        <div style={grid2}>
          <Field label="Default Reserve %" hint="Rolling reserve percentage held from settlements">
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min={0}
                max={50}
                step={0.5}
                value={settings.processing.reservePercent}
                onChange={e => setProcessing('reservePercent', Number(e.target.value))}
                style={{ ...inputStyle, paddingRight: '32px' }}
              />
              <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: BRAND.muted, fontSize: '13px' }}>%</span>
            </div>
          </Field>

          <Field label="Default Term Length" hint="Contract duration offered by default">
            <Select
              value={settings.processing.defaultTermLength}
              onChange={v => setProcessing('defaultTermLength', v as ProcessingDefaults['defaultTermLength'])}
              options={[
                { value: '1yr', label: '1 Year'  },
                { value: '2yr', label: '2 Years' },
                { value: '3yr', label: '3 Years' },
              ]}
            />
          </Field>

          <Field label="Max Daily Processing Limit" hint="Cap applied per merchant per day">
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: BRAND.muted, fontSize: '13px' }}>$</span>
              <input
                type="number"
                min={0}
                step={1000}
                value={settings.processing.maxDailyLimit}
                onChange={e => setProcessing('maxDailyLimit', Number(e.target.value))}
                style={{ ...inputStyle, paddingLeft: '24px' }}
              />
            </div>
          </Field>

          <Field label="Auto-Approve Threshold" hint="Transactions below this amount skip manual review">
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: BRAND.muted, fontSize: '13px' }}>$</span>
              <input
                type="number"
                min={0}
                step={50}
                value={settings.processing.autoApproveThreshold}
                onChange={e => setProcessing('autoApproveThreshold', Number(e.target.value))}
                style={{ ...inputStyle, paddingLeft: '24px' }}
              />
            </div>
          </Field>
        </div>
      </SectionCard>

      {/* ── Geographic Coverage ─────────────────────────────────────── */}
      <SectionCard
        title="Geographic Coverage"
        subtitle="States supported and MCC codes excluded from boarding"
        icon={Globe}
        onSave={() => saveSection('geographic')}
        saved={!!saved.geographic}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Field label="Supported States" hint="Click to toggle individual states">
            <div style={{ marginTop: '8px' }}>
              <StateSelector
                selected={settings.geographic.supportedStates}
                onChange={v => setGeographic('supportedStates', v)}
              />
            </div>
          </Field>

          <Field label="Excluded MCC Codes" hint="Comma-separated 4-digit MCC codes we do not board">
            <input
              type="text"
              value={settings.geographic.excludedMccs}
              onChange={e => setGeographic('excludedMccs', e.target.value)}
              placeholder="e.g. 5933, 7995, 6051"
              style={inputStyle}
            />
          </Field>
        </div>
      </SectionCard>

      {/* ── Commission Defaults ─────────────────────────────────────── */}
      <SectionCard
        title="Commission Defaults"
        subtitle="Default split percentages and residual payment schedule"
        icon={Users}
        onSave={() => saveSection('commission')}
        saved={!!saved.commission}
      >
        <div style={grid2}>
          <Field label="Default AE Split %" hint="Account Executive share of residual income">
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={settings.commission.aeSplitPercent}
                onChange={e => setCommission('aeSplitPercent', Number(e.target.value))}
                style={{ ...inputStyle, paddingRight: '32px' }}
              />
              <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: BRAND.muted, fontSize: '13px' }}>%</span>
            </div>
          </Field>

          <Field label="Default Partner Split %" hint="ISO / referral partner share of residual income">
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={settings.commission.partnerSplitPercent}
                onChange={e => setCommission('partnerSplitPercent', Number(e.target.value))}
                style={{ ...inputStyle, paddingRight: '32px' }}
              />
              <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: BRAND.muted, fontSize: '13px' }}>%</span>
            </div>
          </Field>

          <Field label="Residual Payment Day" hint="Day of month residuals are disbursed" >
            <Select
              value={settings.commission.residualPaymentDay}
              onChange={v => setCommission('residualPaymentDay', v as CommissionDefaults['residualPaymentDay'])}
              options={[
                { value: '1st',  label: '1st of the month'      },
                { value: '15th', label: '15th of the month'     },
                { value: 'last', label: 'Last day of the month' },
              ]}
            />
          </Field>

          <Field label="Split total" hint="Remaining percentage is retained by the house">
            <div
              style={{
                ...inputStyle,
                cursor: 'default',
                backgroundColor: 'rgba(255,255,255,0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>House Retention</span>
              <span
                style={{
                  fontWeight: 700,
                  color: (() => {
                    const house = 100 - settings.commission.aeSplitPercent - settings.commission.partnerSplitPercent
                    return house < 0 ? BRAND.danger : house < 10 ? BRAND.warn : BRAND.success
                  })(),
                }}
              >
                {Math.max(0, 100 - settings.commission.aeSplitPercent - settings.commission.partnerSplitPercent)}%
              </span>
            </div>
          </Field>
        </div>
      </SectionCard>

      {/* ── Notifications ───────────────────────────────────────────── */}
      <SectionCard
        title="Notifications"
        subtitle="Configure email and in-app alert triggers"
        icon={Bell}
        onSave={() => saveSection('notifications')}
        saved={!!saved.notifications}
      >
        <div>
          <ToggleRow
            label="Email on new merchant application"
            description="Send email when a new merchant application is submitted"
            checked={settings.notifications.emailOnNewApplication}
            onChange={v => setNotification('emailOnNewApplication', v)}
          />
          <ToggleRow
            label="Email on agreement signed"
            description="Notify when a merchant or partner signs an agreement"
            checked={settings.notifications.emailOnAgreementSigned}
            onChange={v => setNotification('emailOnAgreementSigned', v)}
          />
          <ToggleRow
            label="Alert on chargeback above threshold"
            description="Trigger alert when a merchant's chargeback ratio exceeds 1.5%"
            checked={settings.notifications.alertOnHighChargeback}
            onChange={v => setNotification('alertOnHighChargeback', v)}
          />
          <ToggleRow
            label="Alert on merchant at risk"
            description="Trigger alert when a merchant is flagged as high-risk by compliance"
            checked={settings.notifications.alertOnMerchantAtRisk}
            onChange={v => setNotification('alertOnMerchantAtRisk', v)}
          />
        </div>
      </SectionCard>

      {/* ── Activity Log ────────────────────────────────────────────── */}
      <SectionCard
        title="Activity Log"
        subtitle="Control audit logging verbosity and data retention"
        icon={Activity}
        onSave={() => saveSection('activityLog')}
        saved={!!saved.activityLog}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <ToggleRow
            label="Enable detailed activity logging"
            description="Record granular events including field-level changes and API calls"
            checked={settings.activityLog.detailedLoggingEnabled}
            onChange={v => setActivityLog('detailedLoggingEnabled', v)}
          />

          <Field label="Log Retention Period" hint="Events older than this will be purged automatically">
            <Select
              value={String(settings.activityLog.retentionDays)}
              onChange={v => setActivityLog('retentionDays', Number(v) as ActivityLogSettings['retentionDays'])}
              options={[
                { value: '30',  label: '30 days'  },
                { value: '60',  label: '60 days'  },
                { value: '90',  label: '90 days'  },
                { value: '180', label: '180 days' },
              ]}
            />
          </Field>
        </div>
      </SectionCard>

    </div>
  )
}
