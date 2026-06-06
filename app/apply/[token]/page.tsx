'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { CheckCircle, ChevronRight, ChevronLeft, AlertTriangle, Loader2, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { BRAND } from '@/lib/brand'
import {
  INIT, STEP_LABELS, DOCS, FormData,
  Step1, Step2, Step3, Step4, Step5, Step6, Gate,
} from './components'

export default function ApplyPage() {
  const params = useParams()
  const token = Array.isArray(params?.token) ? params.token[0] : (params?.token ?? '')

  const [loading, setLoading] = useState(true)
  const [appId, setAppId] = useState<string | null>(null)
  const [gateState, setGateState] = useState<'ok' | 'expired' | 'submitted' | 'error'>('ok')
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FormData>(INIT)
  const [docFiles, setDocFiles] = useState<Record<string, File | null>>({})
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    async function boot() {
      const { data: app, error: err } = await supabase
        .from('onboarding_applications')
        .select('id, intake_token_expires_at, intake_submitted_at, business_name, owner_name, intake_data')
        .eq('intake_token', token)
        .single()

      if (err || !app) { setGateState('error'); setLoading(false); return }
      if (app.intake_submitted_at) { setGateState('submitted'); setLoading(false); return }
      if (app.intake_token_expires_at && new Date(app.intake_token_expires_at) < new Date()) {
        setGateState('expired'); setLoading(false); return
      }

      setAppId(app.id)
      if (app.intake_data && typeof app.intake_data === 'object') {
        setData(prev => ({ ...prev, ...(app.intake_data as Partial<FormData>) }))
      }
      setLoading(false)
    }
    boot()
  }, [token])

  const set = useCallback((k: keyof FormData, v: unknown) => {
    setData(prev => ({ ...prev, [k]: v }))
  }, [])

  const setDocFile = useCallback((k: string, f: File) => {
    setDocFiles(prev => ({ ...prev, [k]: f }))
  }, [])

  async function saveProgress(nextStep: number) {
    if (!appId) return
    setSaving(true)
    await supabase.from('onboarding_applications').update({
      intake_data: data,
      updated_at: new Date().toISOString(),
    }).eq('id', appId)
    setSaving(false)
    setStep(nextStep)
  }

  async function handleSubmit() {
    if (!appId) return
    setSubmitting(true)
    setError('')
    try {
      const { error: err } = await supabase.from('onboarding_applications').update({
        intake_submitted_at: new Date().toISOString(),
        link_status: 'submitted',
        current_phase: 'document_review',
        intake_data: data,
        co_owners: data.coOwners.length > 0 ? data.coOwners : null,
        updated_at: new Date().toISOString(),
      }).eq('id', appId)
      if (err) throw err
      setDone(true)
    } catch {
      setError('Submission failed. Please try again or contact support.')
    } finally {
      setSubmitting(false)
    }
  }

  function validate(): boolean {
    if (step === 0) return !!(data.businessName && data.entityType && data.ein && data.stateOfInc && data.yearsInBusiness && data.industry && data.businessPhone && data.businessAddress && data.city && data.state && data.zip)
    if (step === 1) return !!(data.ownerName && data.ownerDob && data.ownerSsn4.length === 4 && data.ownerPct && data.ownerAddress && data.ownerCity && data.ownerState && data.ownerZip && data.ownerPhone)
    if (step === 2) return !!(data.monthlyVolume && data.avgTicket)
    if (step === 3) return !!(data.bankName && data.routingNumber.length === 9 && data.accountNumber)
    if (step === 4) return DOCS.filter(d => d.required).every(d => !!docFiles[d.key])
    if (step === 5) {
      const sigMatch = data.signature.trim().toLowerCase() === data.ownerName.trim().toLowerCase()
      return data.agreed && sigMatch
    }
    return true
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: BRAND.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={28} color={BRAND.cyan} style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  )

  if (gateState === 'expired') return (
    <Gate icon={<AlertTriangle size={32} color={BRAND.warn} />} color={`${BRAND.warn}26`} borderColor={`${BRAND.warn}59`}
      title="This link has expired."
      body="Contact United Fintech to request a new application link." />
  )

  if (gateState === 'submitted') return (
    <Gate icon={<CheckCircle size={32} color={BRAND.success} />} color={`${BRAND.success}1a`} borderColor={`${BRAND.success}59`}
      title="Application already received."
      body="Check your email for portal access details. The team will be in touch within 1–2 business days." />
  )

  if (gateState === 'error') return (
    <Gate icon={<AlertTriangle size={32} color={BRAND.danger} />} color={`${BRAND.danger}1a`} borderColor={`${BRAND.danger}4d`}
      title="Invalid or expired link."
      body="Please contact United Fintech for a new application link." />
  )

  if (done) return (
    <div style={{ minHeight: '100vh', backgroundColor: BRAND.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: `${BRAND.success}1f`, border: `2px solid ${BRAND.success}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <CheckCircle size={36} color={BRAND.success} />
      </div>
      <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Application Submitted!</h2>
      <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, maxWidth: 400, lineHeight: 1.7 }}>
        Thank you, <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{data.businessName}</strong>. Your application has been submitted successfully.
      </p>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, maxWidth: 400, lineHeight: 1.7, marginTop: 12 }}>
        The United Fintech team will review your documents and be in touch within 1–2 business days.
        Watch for an email with your portal login details to track your progress.
      </p>
      <div style={{ marginTop: 28, padding: '10px 16px', borderRadius: 10, backgroundColor: 'rgba(144,196,207,0.07)', border: '1px solid rgba(144,196,207,0.2)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
        Questions? Email <span style={{ color: BRAND.cyan }}>apply@unitedfintech.io</span>
      </div>
    </div>
  )

  const valid = validate()
  const progress = ((step + 1) / STEP_LABELS.length) * 100

  return (
    <div style={{ minHeight: '100vh', backgroundColor: BRAND.bg }}>
      <div style={{ borderBottom: '1px solid rgba(144,196,207,0.1)', backgroundColor: 'rgba(0,0,0,0.3)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Image src="/logo-vertical.png" alt="United Fintech" width={120} height={36} style={{ objectFit: 'contain' }} />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Shield size={11} color={BRAND.cyan} /> Secure Application Portal
        </span>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '36px 16px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Merchant Application</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 6 }}>Complete all 6 steps to submit. Progress is saved automatically.</p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {STEP_LABELS.map((label, i) => {
              const isDone = i < step
              const active = i === step
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                    border: `1px solid ${active ? BRAND.cyan : isDone ? `${BRAND.success}59` : 'rgba(255,255,255,0.08)'}`,
                    backgroundColor: active ? 'rgba(144,196,207,0.12)' : isDone ? `${BRAND.success}12` : 'transparent',
                    color: active ? BRAND.cyan : isDone ? BRAND.success : 'rgba(255,255,255,0.25)',
                  }}>
                    {isDone ? <CheckCircle size={10} /> : <span style={{ width: 14, textAlign: 'center' }}>{i + 1}</span>}
                    {label}
                  </div>
                  {i < STEP_LABELS.length - 1 && <ChevronRight size={10} color="rgba(255,255,255,0.15)" />}
                </div>
              )
            })}
          </div>
          <div style={{ height: 3, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.06)', maxWidth: 360, margin: '0 auto' }}>
            <div style={{ height: 3, borderRadius: 99, width: `${progress}%`, backgroundColor: BRAND.cyan, transition: 'width 0.4s ease', boxShadow: `0 0 10px rgba(144,196,207,0.4)` }} />
          </div>
        </div>

        <div style={{ backgroundColor: BRAND.card, border: '1px solid rgba(144,196,207,0.15)', borderRadius: 14, padding: 32 }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: 0 }}>
              Step {step + 1} of {STEP_LABELS.length} — {STEP_LABELS[step]}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 4 }}>
              {step === 0 && 'Tell us about your business.'}
              {step === 1 && 'Owner information required for compliance.'}
              {step === 2 && 'Your current processing details help us find the best rates.'}
              {step === 3 && 'Bank account for settlement deposits.'}
              {step === 4 && 'Upload required compliance documents.'}
              {step === 5 && 'Review, sign, and submit your application.'}
            </p>
          </div>

          {step === 0 && <Step1 d={data} s={set} />}
          {step === 1 && <Step2 d={data} s={set} />}
          {step === 2 && <Step3 d={data} s={set} />}
          {step === 3 && <Step4 d={data} s={set} />}
          {step === 4 && <Step5 files={docFiles} setFile={setDocFile} />}
          {step === 5 && <Step6 d={data} s={set} ownerName={data.ownerName} businessName={data.businessName} />}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
          <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: step === 0 ? 'not-allowed' : 'pointer',
              border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)',
              color: step === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.65)',
            }}>
            <ChevronLeft size={14} /> Back
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {saving && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Saving…</span>}
            {step < STEP_LABELS.length - 1 ? (
              <button type="button" onClick={() => saveProgress(step + 1)} disabled={!valid}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: valid ? 'pointer' : 'not-allowed',
                  backgroundColor: BRAND.cyan, color: BRAND.bg, opacity: valid ? 1 : 0.4,
                  boxShadow: valid ? BRAND.glowCyan : 'none',
                }}>
                Continue <ChevronRight size={14} />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={!valid || submitting}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '10px 28px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: (valid && !submitting) ? 'pointer' : 'not-allowed',
                  backgroundColor: BRAND.cyanDeep, color: '#fff', opacity: (valid && !submitting) ? 1 : 0.5,
                  boxShadow: valid ? `0 0 20px ${BRAND.cyanDeep}4d` : 'none',
                }}>
                {submitting ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</> : 'Submit Application →'}
              </button>
            )}
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 9, backgroundColor: `${BRAND.danger}14`, border: `1px solid ${BRAND.danger}40`, fontSize: 12, color: BRAND.danger, textAlign: 'center' }}>
            {error}
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 28 }}>
          Your information is encrypted and protected. United Fintech will never sell your data.
        </p>
      </div>
    </div>
  )
}
