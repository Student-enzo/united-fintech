'use client'
import { useState } from 'react'
import type { OnboardingDocument, PursuitDocumentRequest } from '@/lib/onboarding-types'

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  pending:             { color: '#FCD34D', background: 'rgba(252,211,77,0.1)',  border: '1px solid rgba(252,211,77,0.3)' },
  accepted:            { color: '#6EE7B7', background: 'rgba(110,231,183,0.1)', border: '1px solid rgba(110,231,183,0.3)' },
  rejected:            { color: '#E8504A', background: 'rgba(232,80,74,0.1)',   border: '1px solid rgba(232,80,74,0.3)' },
  re_upload_requested: { color: '#FCD34D', background: 'rgba(252,211,77,0.1)',  border: '1px solid rgba(252,211,77,0.3)' },
}
const STATUS_LABEL: Record<string, string> = {
  pending: 'Under Review', accepted: 'Accepted', rejected: 'Rejected', re_upload_requested: 'Re-upload Requested',
}

export function DocumentsClient({ applicationId, documents, requests }: {
  applicationId: string
  documents: OnboardingDocument[]
  requests: PursuitDocumentRequest[]
}) {
  const [localDocs, setLocalDocs] = useState(documents)
  const pendingReqs = requests.filter(r => r.status === 'pending')

  function addDoc(doc: OnboardingDocument) {
    setLocalDocs(prev => [doc, ...prev])
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: 'rgba(255,255,255,0.85)', fontSize: 24, fontWeight: 300, marginBottom: 6 }}>Documents</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Upload and manage your application documents.</p>
      </div>

      {/* Requested documents */}
      {pendingReqs.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#FCD34D', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
            Requested Documents
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pendingReqs.map(req => (
              <RequestCard key={req.id} req={req} applicationId={applicationId} onUpload={addDoc} />
            ))}
          </div>
        </section>
      )}

      {/* Uploaded documents */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
          Your Documents
        </h2>
        {localDocs.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, padding: '20px 0' }}>No documents uploaded yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {localDocs.map(doc => (
              <div key={doc.id} style={{
                background: '#282626', border: '1px solid rgba(144,196,207,0.12)',
                borderRadius: 10, padding: '12px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
              }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{doc.doc_label ?? doc.doc_type}</div>
                  {doc.file_name && <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 }}>{doc.file_name}</div>}
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 2 }}>
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </div>
                </div>
                <span style={{ padding: '4px 12px', borderRadius: 99, fontSize: 12, ...STATUS_STYLE[doc.status] }}>
                  {STATUS_LABEL[doc.status] ?? doc.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upload any document */}
      <section>
        <h2 style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
          Upload a Document
        </h2>
        <UploadAny applicationId={applicationId} onUpload={addDoc} />
      </section>
    </div>
  )
}

function RequestCard({ req, applicationId, onUpload }: {
  req: PursuitDocumentRequest
  applicationId: string
  onUpload: (doc: OnboardingDocument) => void
}) {
  const [uploading, setUploading] = useState(false)

  async function handleFile(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append('applicationId', applicationId)
    fd.append('docType', req.id)
    fd.append('docLabel', req.document_name)
    fd.append('file', file)
    const res = await fetch('/api/portal/documents', { method: 'POST', body: fd })
    if (res.ok) {
      const doc = await res.json()
      onUpload(doc)
    }
    setUploading(false)
  }

  return (
    <div style={{
      background: 'rgba(252,211,77,0.06)', border: '1px solid rgba(252,211,77,0.2)',
      borderRadius: 10, padding: '14px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
    }}>
      <div>
        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>{req.document_name}</div>
        {req.reason && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{req.reason}</div>}
        {req.deadline_at && (
          <div style={{ color: '#FCD34D', fontSize: 12, marginTop: 2 }}>
            Due: {new Date(req.deadline_at).toLocaleDateString()}
          </div>
        )}
      </div>
      <label style={{
        padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap',
        background: 'rgba(252,211,77,0.15)', color: '#FCD34D',
        border: '1px solid rgba(252,211,77,0.3)',
      }}>
        {uploading ? 'Uploading…' : 'Upload'}
        <input type="file" style={{ display: 'none' }} onChange={e => {
          const f = e.target.files?.[0]; if (f) handleFile(f)
        }} />
      </label>
    </div>
  )
}

function UploadAny({ applicationId, onUpload }: {
  applicationId: string
  onUpload: (doc: OnboardingDocument) => void
}) {
  const [label,     setLabel]     = useState('')
  const [file,      setFile]      = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  async function submit() {
    if (!file || !label.trim()) return
    setUploading(true)
    const fd = new FormData()
    fd.append('applicationId', applicationId)
    fd.append('docType', 'other')
    fd.append('docLabel', label.trim())
    fd.append('file', file)
    const res = await fetch('/api/portal/documents', { method: 'POST', body: fd })
    if (res.ok) {
      const doc = await res.json()
      onUpload(doc)
      setLabel('')
      setFile(null)
    }
    setUploading(false)
  }

  const INPUT: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(144,196,207,0.22)',
    color: 'rgba(255,255,255,0.85)', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{
      background: '#282626', border: '1px solid rgba(144,196,207,0.15)',
      borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <div>
        <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
          Document Label
        </label>
        <input
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="e.g. Voided Check, Business License…"
          style={INPUT}
        />
      </div>

      <label style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '12px 20px', borderRadius: 10, cursor: 'pointer',
        border: '2px dashed rgba(144,196,207,0.25)', color: 'rgba(255,255,255,0.5)', fontSize: 14,
      }}>
        {file ? file.name : '+ Choose file'}
        <input type="file" style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] ?? null)} />
      </label>

      <button
        onClick={submit}
        disabled={!file || !label.trim() || uploading}
        style={{
          padding: '11px 0', borderRadius: 10, border: 'none',
          background: file && label.trim() ? '#90c4cf' : 'rgba(255,255,255,0.1)',
          color: file && label.trim() ? '#1c1c1c' : 'rgba(255,255,255,0.3)',
          cursor: file && label.trim() ? 'pointer' : 'not-allowed',
          fontSize: 14, fontWeight: 500,
        }}>
        {uploading ? 'Uploading…' : 'Upload Document'}
      </button>
    </div>
  )
}
