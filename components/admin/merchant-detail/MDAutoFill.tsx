'use client'

import { useRef, useState } from 'react'
import { FileEdit, CheckCircle, Download, Loader2, AlertTriangle, ArrowRight } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import type { MerchantRecord } from '@/lib/mock-merchants'

interface Props {
  merchant: MerchantRecord
}

interface MappingRow {
  formField: string
  ourValue: string
  matched: boolean
}

function buildMapping(m: MerchantRecord): MappingRow[] {
  return [
    { formField: 'Business Legal Name',  ourValue: m.name,              matched: true },
    { formField: 'Owner / Principal',     ourValue: m.owner_name ?? '',  matched: !!m.owner_name },
    { formField: 'Email Address',         ourValue: m.contact_email ?? '', matched: !!m.contact_email },
    { formField: 'Phone Number',          ourValue: m.contact_phone ?? '', matched: !!m.contact_phone },
    { formField: 'Entity Type',           ourValue: m.legal_structure,   matched: true },
    { formField: 'MCC Code',              ourValue: m.mcc,               matched: true },
    { formField: 'Avg Monthly Volume',    ourValue: `$${m.monthly_volume.toLocaleString()}`, matched: true },
    { formField: 'SSN / EIN',             ourValue: 'Not on file',        matched: false },
    { formField: 'Physical Address',      ourValue: 'Not on file',        matched: false },
  ]
}

export default function MDAutoFill({ merchant: m }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadedForm, setUploadedForm] = useState<string | null>(null)
  const [showMapping, setShowMapping] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [dragging, setDragging] = useState(false)

  const FIELDS = [
    { label: 'Legal Business Name', value: m.name },
    { label: 'DBA Name',            value: m.dba_name || '—' },
    { label: 'Owner Name',          value: m.owner_name || '—' },
    { label: 'Business Email',      value: m.contact_email || '—' },
    { label: 'Business Phone',      value: m.contact_phone || '—' },
    { label: 'Legal Structure',     value: m.legal_structure },
    { label: 'MCC Code',            value: m.mcc },
    { label: 'MCC Category',        value: m.mcc_label },
    { label: 'Account Type',        value: m.account_type },
    { label: 'Partner / ISO',       value: m.partner },
    { label: 'Monthly Volume',      value: `$${m.monthly_volume.toLocaleString()}` },
    { label: 'Average Ticket',      value: `$${m.avg_ticket}` },
  ]
  const availableCount = FIELDS.filter(f => f.value !== '—').length
  const missingCount   = FIELDS.filter(f => f.value === '—').length

  const mapping = buildMapping(m)

  function handleFile(file: File) {
    setUploadedForm(file.name)
    setShowMapping(true)
    setGenerated(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function handleGenerate() {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 2000)
  }

  function handleReset() {
    setUploadedForm(null)
    setShowMapping(false)
    setGenerated(false)
  }

  const card: React.CSSProperties = {
    background: BRAND.card,
    border: `1px solid ${BRAND.border}`,
    borderRadius: 12,
    padding: 20,
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>

      {/* ── Left: Data on File ── */}
      <div style={card}>
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: BRAND.text, fontWeight: 600, fontSize: 14, margin: 0 }}>
            Merchant Data Available for Auto-Fill
          </p>
          <p style={{ color: BRAND.muted, fontSize: 12, marginTop: 4 }}>
            <span style={{ color: BRAND.success, fontWeight: 600 }}>{availableCount} fields ready</span>
            {' · '}
            <span style={{ color: BRAND.warn, fontWeight: 600 }}>{missingCount} fields missing</span>
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {FIELDS.map((f, i) => {
            const missing = f.value === '—'
            return (
              <div
                key={f.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 0',
                  borderBottom: i < FIELDS.length - 1 ? `1px solid ${BRAND.border}` : 'none',
                }}
              >
                {/* Status dot */}
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: missing ? BRAND.warn : BRAND.success,
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: BRAND.muted, fontSize: 12, minWidth: 130, flexShrink: 0 }}>
                  {f.label}
                </span>
                <span
                  style={{
                    color: missing ? BRAND.muted : BRAND.text,
                    fontSize: 13,
                    fontWeight: missing ? 400 : 500,
                    wordBreak: 'break-all',
                  }}
                >
                  {f.value}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Right: Upload + Mapping ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Drop zone */}
        <div
          style={{
            ...card,
            border: `1.5px dashed ${dragging ? BRAND.cyan : (uploadedForm ? BRAND.borderCyan : BRAND.border)}`,
            cursor: 'pointer',
            transition: 'border-color 0.2s',
            textAlign: 'center',
            padding: 32,
            background: dragging ? `rgba(144,196,207,0.05)` : BRAND.card,
          }}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploadedForm && fileRef.current?.click()}
        >
          {!uploadedForm ? (
            <>
              <FileEdit size={28} color={BRAND.cyan} style={{ marginBottom: 10, opacity: 0.75 }} />
              <p style={{ color: BRAND.text, fontWeight: 600, fontSize: 14, margin: '0 0 4px' }}>
                Drop PDF form to auto-fill
              </p>
              <p style={{ color: BRAND.muted, fontSize: 12, margin: 0 }}>
                Supports any standard merchant application form
              </p>
            </>
          ) : (
            <>
              <CheckCircle size={26} color={BRAND.success} style={{ marginBottom: 10 }} />
              <p style={{ color: BRAND.text, fontWeight: 600, fontSize: 13, margin: '0 0 4px', wordBreak: 'break-all' }}>
                {uploadedForm}
              </p>
              <p style={{ color: BRAND.success, fontSize: 12, margin: 0 }}>Ready for field mapping</p>
            </>
          )}
        </div>
        <input
          type="file"
          accept=".pdf"
          ref={fileRef}
          style={{ display: 'none' }}
          onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
        />

        {/* Field mapping panel */}
        {showMapping && (
          <div style={card}>
            <p style={{ color: BRAND.text, fontWeight: 600, fontSize: 13, margin: '0 0 14px' }}>
              Field Mapping Detected
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {mapping.map((row, i) => (
                <div
                  key={row.formField}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr auto',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 0',
                    borderBottom: i < mapping.length - 1 ? `1px solid ${BRAND.border}` : 'none',
                  }}
                >
                  <span style={{ color: BRAND.muted, fontSize: 12 }}>{row.formField}</span>
                  <ArrowRight size={12} color={BRAND.muted} />
                  <span
                    style={{
                      color: row.matched ? BRAND.text : BRAND.muted,
                      fontSize: 12,
                      fontStyle: row.matched ? 'normal' : 'italic',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.ourValue}
                  </span>
                  {row.matched ? (
                    <CheckCircle size={13} color={BRAND.success} />
                  ) : (
                    <AlertTriangle size={13} color={BRAND.warn} />
                  )}
                </div>
              ))}
            </div>

            {/* Generate / success */}
            <div style={{ marginTop: 18 }}>
              {!generated ? (
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  style={{
                    width: '100%',
                    padding: '11px 0',
                    background: generating ? `rgba(144,196,207,0.3)` : BRAND.cyan,
                    color: generating ? BRAND.muted : '#1c1c1c',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: generating ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {generating ? (
                    <>
                      <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                      Generating PDF...
                    </>
                  ) : (
                    'Generate Filled Form'
                  )}
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 12px',
                      background: `rgba(110,231,183,0.08)`,
                      border: `1px solid rgba(110,231,183,0.2)`,
                      borderRadius: 8,
                    }}
                  >
                    <CheckCircle size={16} color={BRAND.success} />
                    <span style={{ color: BRAND.success, fontSize: 13, fontWeight: 600 }}>
                      Form Generated Successfully
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <a
                      href="#"
                      download={`filled-${uploadedForm}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: '9px 0',
                        background: BRAND.cyan,
                        color: '#1c1c1c',
                        borderRadius: 7,
                        fontWeight: 700,
                        fontSize: 12,
                        textDecoration: 'none',
                      }}
                    >
                      <Download size={13} />
                      Download Filled Form PDF
                    </a>
                    <button
                      onClick={handleReset}
                      style={{
                        padding: '9px 0',
                        background: 'transparent',
                        border: `1px solid ${BRAND.border}`,
                        borderRadius: 7,
                        color: BRAND.muted,
                        fontSize: 12,
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Generate New Form
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Keyframe for spinner */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
