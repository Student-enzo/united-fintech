'use client'
import { useState } from 'react'
import type { OnboardingApplication } from '@/lib/onboarding-types'

interface IntakeState {
  business_name: string; dba: string; business_type: string; ein: string
  state_of_inc: string; years_in_business: string; website: string; industry: string
  owner_name: string; owner_dob: string; owner_ssn_last4: string
  owner_address: string; owner_city: string; owner_state: string; owner_zip: string
  ownership_percent: string; owner_phone: string
  monthly_volume: string; avg_ticket: string; card_present_percent: string
  has_processor: boolean; current_processor: string; chargeback_history: string
  bank_name: string; routing_number: string; account_number: string; account_type: string
  signature_name: string; agreed_to_terms: boolean
}

function getInitial(app: OnboardingApplication): IntakeState {
  return {
    business_name: app.business_name ?? '',
    dba: '',
    business_type: app.business_type ?? 'LLC',
    ein: app.ein ?? '',
    state_of_inc: app.state ?? '',
    years_in_business: app.years_in_business ?? '',
    website: app.website ?? '',
    industry: '',
    owner_name: app.owner_name ?? '',
    owner_dob: app.owner_dob ?? '',
    owner_ssn_last4: app.owner_ssn_last4 ?? '',
    owner_address: app.owner_address ?? '',
    owner_city: app.owner_city ?? '',
    owner_state: app.owner_state ?? '',
    owner_zip: app.owner_zip ?? '',
    ownership_percent: app.ownership_percent ?? '',
    owner_phone: app.owner_phone ?? '',
    monthly_volume: app.monthly_volume ?? '',
    avg_ticket: app.avg_ticket ?? '',
    card_present_percent: app.card_present_percent ?? '',
    has_processor: !!app.current_processor,
    current_processor: app.current_processor ?? '',
    chargeback_history: app.chargeback_history ?? '',
    bank_name: '',
    routing_number: '',
    account_number: '',
    account_type: 'checking',
    signature_name: '',
    agreed_to_terms: false,
  }
}

const STEP_TITLES = [
  'Business Information',
  'Owner Information',
  'Processing History',
  'Banking Details',
  'Document Uploads',
  'Review & Sign',
]

const FIELD_MAP: Record<number, string[]> = {
  1: ['business_name','dba','business_type','ein','state_of_inc','years_in_business','website','industry'],
  2: ['owner_name','owner_dob','owner_ssn_last4','owner_address','owner_city','owner_state','owner_zip','ownership_percent','owner_phone'],
  3: ['monthly_volume','avg_ticket','card_present_percent','has_processor','current_processor','chargeback_history'],
  4: ['bank_name','routing_number','account_number','account_type'],
}

const INPUT: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 10,
  backgroundColor: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(144,196,207,0.22)',
  color: 'rgba(255,255,255,0.85)', fontSize: 14, outline: 'none', boxSizing: 'border-box',
}
const LABEL: React.CSSProperties = {
  display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 11,
  letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6,
}
const G2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={LABEL}>{label}</label>
      {children}
    </div>
  )
}

export function IntakeFormWrapper({ applicationId, initialData }: {
  applicationId: string
  initialData: OnboardingApplication
}) {
  const [step,       setStep]       = useState(1)
  const [form,       setForm]       = useState<IntakeState>(getInitial(initialData))
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function update(field: keyof IntakeState, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function saveAndAdvance(nextStep: number) {
    setSaving(true)
    const fields = FIELD_MAP[step]
    if (fields) {
      const payload: Record<string, unknown> = {}
      fields.forEach(f => { payload[f] = (form as unknown as Record<string, unknown>)[f] })
      await fetch('/api/portal/intake', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, data: payload }),
      })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setStep(nextStep)
  }

  async function handleSubmit() {
    if (!form.agreed_to_terms || !form.signature_name.trim()) return
    setSubmitting(true)
    await fetch('/api/portal/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId }),
    })
    window.location.reload()
  }

  const canSubmit = form.agreed_to_terms && form.signature_name.trim().length > 0

  return (
    <div style={{ background: '#282626', border: '1px solid rgba(144,196,207,0.15)', borderRadius: 14, overflow: 'hidden' }}>
      {/* Header / progress */}
      <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(144,196,207,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Step {step} of 6
          </span>
          <span style={{ color: '#90c4cf', fontSize: 13 }}>{STEP_TITLES[step - 1]}</span>
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
          <div style={{ height: '100%', width: `${(step / 6) * 100}%`, background: '#90c4cf', borderRadius: 99, transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Step content */}
      <div style={{ padding: 28 }}>
        {step === 1 && <Step1 form={form} update={update} />}
        {step === 2 && <Step2 form={form} update={update} />}
        {step === 3 && <Step3 form={form} update={update} />}
        {step === 4 && <Step4 form={form} update={update} />}
        {step === 5 && <Step5 applicationId={applicationId} />}
        {step === 6 && <Step6 form={form} update={update} businessName={form.business_name} />}
      </div>

      {/* Nav buttons */}
      <div style={{ padding: '16px 28px', borderTop: '1px solid rgba(144,196,207,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setStep(s => s - 1)}
          disabled={step === 1}
          style={{
            padding: '10px 20px', borderRadius: 8,
            border: '1px solid rgba(144,196,207,0.22)',
            background: 'transparent',
            color: step === 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
            cursor: step === 1 ? 'not-allowed' : 'pointer', fontSize: 14,
          }}>
          Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {saved   && <span style={{ color: '#6EE7B7', fontSize: 13 }}>Saved</span>}
          {saving  && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Saving…</span>}

          {step < 6 ? (
            <button onClick={() => saveAndAdvance(step + 1)} style={{
              padding: '10px 24px', borderRadius: 8, border: 'none',
              background: '#90c4cf', color: '#1c1c1c', cursor: 'pointer', fontSize: 14, fontWeight: 500,
            }}>
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              style={{
                padding: '10px 24px', borderRadius: 8, border: 'none',
                background: canSubmit ? '#6EE7B7' : 'rgba(255,255,255,0.1)',
                color: canSubmit ? '#1c1c1c' : 'rgba(255,255,255,0.3)',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                fontSize: 14, fontWeight: 500,
              }}>
              {submitting ? 'Submitting…' : 'Submit Application'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Step1({ form, update }: { form: IntakeState; update: (k: keyof IntakeState, v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={G2}>
        <Field label="Legal Business Name">
          <input style={INPUT} value={form.business_name} onChange={e => update('business_name', e.target.value)} placeholder="Acme LLC" />
        </Field>
        <Field label="DBA (if different)">
          <input style={INPUT} value={form.dba} onChange={e => update('dba', e.target.value)} placeholder="Optional" />
        </Field>
      </div>
      <div style={G2}>
        <Field label="Entity Type">
          <select style={{ ...INPUT, cursor: 'pointer' }} value={form.business_type} onChange={e => update('business_type', e.target.value)}>
            <option value="LLC">LLC</option>
            <option value="Corp">Corporation</option>
            <option value="Sole_Proprietor">Sole Proprietor</option>
            <option value="Partnership">Partnership</option>
          </select>
        </Field>
        <Field label="EIN / Tax ID">
          <input style={INPUT} value={form.ein} onChange={e => update('ein', e.target.value)} placeholder="XX-XXXXXXX" />
        </Field>
      </div>
      <div style={G2}>
        <Field label="State of Incorporation">
          <input style={INPUT} value={form.state_of_inc} onChange={e => update('state_of_inc', e.target.value)} placeholder="DE" />
        </Field>
        <Field label="Years in Business">
          <input style={INPUT} type="number" value={form.years_in_business} onChange={e => update('years_in_business', e.target.value)} placeholder="3" />
        </Field>
      </div>
      <Field label="Business Website">
        <input style={INPUT} value={form.website} onChange={e => update('website', e.target.value)} placeholder="https://yourbusiness.com" />
      </Field>
      <Field label="Industry / Business Description">
        <textarea style={{ ...INPUT, minHeight: 80, resize: 'vertical' }} value={form.industry} onChange={e => update('industry', e.target.value)} placeholder="Describe your business and what you sell" />
      </Field>
    </div>
  )
}

function Step2({ form, update }: { form: IntakeState; update: (k: keyof IntakeState, v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Field label="Owner Full Legal Name">
        <input style={INPUT} value={form.owner_name} onChange={e => update('owner_name', e.target.value)} placeholder="Jane Doe" />
      </Field>
      <div style={G2}>
        <Field label="Date of Birth">
          <input style={INPUT} type="date" value={form.owner_dob} onChange={e => update('owner_dob', e.target.value)} />
        </Field>
        <Field label="SSN Last 4 Digits">
          <input style={INPUT} value={form.owner_ssn_last4} onChange={e => update('owner_ssn_last4', e.target.value)} maxLength={4} placeholder="1234" />
        </Field>
      </div>
      <Field label="Home Address">
        <input style={INPUT} value={form.owner_address} onChange={e => update('owner_address', e.target.value)} placeholder="123 Main St" />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
        <Field label="City">
          <input style={INPUT} value={form.owner_city} onChange={e => update('owner_city', e.target.value)} />
        </Field>
        <Field label="State">
          <input style={INPUT} value={form.owner_state} onChange={e => update('owner_state', e.target.value)} maxLength={2} placeholder="CA" />
        </Field>
        <Field label="Zip">
          <input style={INPUT} value={form.owner_zip} onChange={e => update('owner_zip', e.target.value)} placeholder="90210" />
        </Field>
      </div>
      <div style={G2}>
        <Field label="Ownership %">
          <input style={INPUT} type="number" value={form.ownership_percent} onChange={e => update('ownership_percent', e.target.value)} placeholder="100" />
        </Field>
        <Field label="Mobile Phone">
          <input style={INPUT} value={form.owner_phone} onChange={e => update('owner_phone', e.target.value)} placeholder="+1 (555) 000-0000" />
        </Field>
      </div>
    </div>
  )
}

function Step3({ form, update }: { form: IntakeState; update: (k: keyof IntakeState, v: string | boolean) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={G2}>
        <Field label="Est. Monthly Volume ($)">
          <input style={INPUT} value={form.monthly_volume} onChange={e => update('monthly_volume', e.target.value)} placeholder="50000" />
        </Field>
        <Field label="Average Transaction ($)">
          <input style={INPUT} value={form.avg_ticket} onChange={e => update('avg_ticket', e.target.value)} placeholder="250" />
        </Field>
      </div>
      <Field label="% Card Present (in-person)">
        <input style={INPUT} type="number" min="0" max="100" value={form.card_present_percent} onChange={e => update('card_present_percent', e.target.value)} placeholder="60" />
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 4 }}>Remainder is card not present (online / phone)</span>
      </Field>
      <div>
        <label style={LABEL}>Do you have an existing processor?</label>
        <div style={{ display: 'flex', gap: 12 }}>
          {(['Yes', 'No'] as const).map(opt => (
            <button key={opt} type="button" onClick={() => update('has_processor', opt === 'Yes')} style={{
              padding: '9px 20px', borderRadius: 8, fontSize: 14,
              border: `1px solid ${(opt === 'Yes') === form.has_processor ? '#90c4cf' : 'rgba(144,196,207,0.22)'}`,
              background: (opt === 'Yes') === form.has_processor ? 'rgba(144,196,207,0.12)' : 'transparent',
              color: (opt === 'Yes') === form.has_processor ? '#90c4cf' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
            }}>{opt}</button>
          ))}
        </div>
      </div>
      {form.has_processor && (
        <div style={G2}>
          <Field label="Current Processor">
            <input style={INPUT} value={form.current_processor} onChange={e => update('current_processor', e.target.value)} placeholder="Stripe, Square…" />
          </Field>
          <Field label="Chargeback Rate">
            <input style={INPUT} value={form.chargeback_history} onChange={e => update('chargeback_history', e.target.value)} placeholder="0.5%" />
          </Field>
        </div>
      )}
    </div>
  )
}

function Step4({ form, update }: { form: IntakeState; update: (k: keyof IntakeState, v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Field label="Bank Name">
        <input style={INPUT} value={form.bank_name} onChange={e => update('bank_name', e.target.value)} placeholder="Chase, Wells Fargo…" />
      </Field>
      <div style={G2}>
        <Field label="Routing Number">
          <input style={INPUT} value={form.routing_number} onChange={e => update('routing_number', e.target.value)} placeholder="021000021" />
        </Field>
        <Field label="Account Number">
          <input style={INPUT} value={form.account_number} onChange={e => update('account_number', e.target.value)} placeholder="••••••••••" />
        </Field>
      </div>
      <div>
        <label style={LABEL}>Account Type</label>
        <div style={{ display: 'flex', gap: 12 }}>
          {(['checking', 'savings'] as const).map(type => (
            <button key={type} type="button" onClick={() => update('account_type', type)} style={{
              padding: '9px 20px', borderRadius: 8, fontSize: 14, textTransform: 'capitalize',
              border: `1px solid ${form.account_type === type ? '#90c4cf' : 'rgba(144,196,207,0.22)'}`,
              background: form.account_type === type ? 'rgba(144,196,207,0.12)' : 'transparent',
              color: form.account_type === type ? '#90c4cf' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
            }}>{type}</button>
          ))}
        </div>
      </div>
      <div style={{ background: 'rgba(144,196,207,0.05)', border: '1px solid rgba(144,196,207,0.15)', borderRadius: 10, padding: 16 }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
          Upload your voided check or bank letter in the next step.
        </p>
      </div>
    </div>
  )
}

const REQUIRED_DOCS = [
  { type: 'photo_id',         label: 'Government-Issued Photo ID',                    required: true },
  { type: 'bank_statements',  label: '3 Months Business Bank Statements',             required: true },
  { type: 'biz_license',      label: 'Business License / Articles of Incorporation',  required: true },
  { type: 'ein_letter',       label: 'EIN Verification Letter (SS-4)',                required: true },
  { type: 'voided_check',     label: 'Voided Check or Bank Letter',                   required: true },
  { type: 'proof_of_address', label: 'Proof of Business Address',                     required: true },
  { type: 'processing_stmts', label: 'Processing Statements (if applicable)',          required: false },
]

function Step5({ applicationId }: { applicationId: string }) {
  const [uploads,   setUploads]   = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState<string | null>(null)

  async function handleFile(docType: string, docLabel: string, file: File) {
    setUploading(docType)
    const fd = new FormData()
    fd.append('applicationId', applicationId)
    fd.append('docType', docType)
    fd.append('docLabel', docLabel)
    fd.append('file', file)
    await fetch('/api/portal/documents', { method: 'POST', body: fd })
    setUploads(prev => ({ ...prev, [docType]: file.name }))
    setUploading(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 4 }}>
        Upload the documents below. You can also upload them later from the Documents tab.
      </p>
      {REQUIRED_DOCS.map(doc => (
        <div key={doc.type} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderRadius: 10,
          background: uploads[doc.type] ? 'rgba(110,231,183,0.07)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${uploads[doc.type] ? 'rgba(110,231,183,0.25)' : 'rgba(144,196,207,0.15)'}`,
        }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{doc.label}</div>
            {!doc.required && <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>Optional</div>}
            {uploads[doc.type] && <div style={{ color: '#6EE7B7', fontSize: 12, marginTop: 2 }}>{uploads[doc.type]}</div>}
          </div>
          <label style={{
            padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap',
            background: uploads[doc.type] ? 'rgba(110,231,183,0.15)' : 'rgba(144,196,207,0.12)',
            color: uploads[doc.type] ? '#6EE7B7' : '#90c4cf',
            border: `1px solid ${uploads[doc.type] ? 'rgba(110,231,183,0.3)' : 'rgba(144,196,207,0.25)'}`,
          }}>
            {uploading === doc.type ? 'Uploading…' : uploads[doc.type] ? 'Replace' : 'Upload'}
            <input type="file" style={{ display: 'none' }} onChange={e => {
              const f = e.target.files?.[0]; if (f) handleFile(doc.type, doc.label, f)
            }} />
          </label>
        </div>
      ))}
    </div>
  )
}

function Step6({ form, update, businessName }: {
  form: IntakeState
  update: (k: keyof IntakeState, v: string | boolean) => void
  businessName: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(144,196,207,0.12)',
        borderRadius: 10, padding: 20, maxHeight: 280, overflowY: 'auto',
        color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.7,
      }}>
        <div style={{ color: '#90c4cf', fontWeight: 400, fontSize: 14, marginBottom: 16, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          United Fintech — Merchant Representation Agreement
        </div>
        <p>This Merchant Representation Agreement is entered into between <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{businessName || 'your business'}</strong> ("Merchant") and United Fintech LLC ("ISO").</p>
        <p style={{ marginTop: 12 }}>1. <strong>Services.</strong> ISO will represent Merchant in seeking merchant account placement with acquiring banks and processors. ISO does not guarantee approval by any partner.</p>
        <p style={{ marginTop: 12 }}>2. <strong>Accuracy of Information.</strong> Merchant represents that all information provided is true, accurate, and complete. Merchant authorizes ISO to submit this information to partners on Merchant's behalf.</p>
        <p style={{ marginTop: 12 }}>3. <strong>Confidentiality.</strong> ISO will handle Merchant's information in accordance with applicable privacy laws. Information may be shared with partner banks solely for underwriting purposes.</p>
        <p style={{ marginTop: 12 }}>4. <strong>Fees.</strong> ISO compensation is paid by partners and does not represent an additional charge to Merchant unless explicitly disclosed in a separate fee schedule.</p>
        <p style={{ marginTop: 12 }}>5. <strong>Governing Law.</strong> This Agreement shall be governed by the laws of the state in which ISO is registered.</p>
        <p style={{ marginTop: 16, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>By signing below, Merchant agrees to all terms and authorizes United Fintech to represent their application to acquiring institutions.</p>
      </div>

      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={form.agreed_to_terms}
          onChange={e => update('agreed_to_terms', e.target.checked)}
          style={{ marginTop: 2, accentColor: '#90c4cf', width: 16, height: 16 }}
        />
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
          I have read and agree to the terms of the United Fintech Merchant Representation Agreement.
        </span>
      </label>

      <div>
        <label style={LABEL}>E-Signature — Type your full legal name</label>
        <input
          style={{ ...INPUT, fontStyle: 'italic', fontSize: 16 }}
          value={form.signature_name}
          onChange={e => update('signature_name', e.target.value)}
          placeholder="Jane Doe"
        />
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 6 }}>
          Typing your name serves as your electronic signature.
        </div>
      </div>
    </div>
  )
}
