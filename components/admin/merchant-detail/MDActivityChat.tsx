'use client'

import { useEffect, useRef, useState } from 'react'
import { Bot, Send, ChevronDown } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import type { MerchantRecord } from '@/lib/mock-merchants'

export interface ActivityEntry {
  id: string
  text: string
  date: string
  color: string
}

interface ChatMsg {
  id: string
  role: 'user' | 'ai'
  text: string
}

interface Props {
  merchant: MerchantRecord
  activityLog: ActivityEntry[]
  addActivity: (text: string, color: string) => void
}

function getMockResponse(question: string, m: MerchantRecord): string {
  const q = question.toLowerCase()
  if (q.includes('summar'))
    return `${m.name} is a ${m.legal_structure} in the ${m.mcc_label} category, currently in the ${m.pipeline_stage.replace(/_/g, ' ')} stage. Monthly volume is $${m.monthly_volume.toLocaleString()} with an average ticket of $${m.avg_ticket}. Risk is ${m.risk ?? 'unclassified'}. ${m.days_in_stage} days in current stage.`
  if (q.includes('miss') || q.includes('lack'))
    return `Based on the current stage, ensure: (1) All KYC documents are received and approved, (2) Contact info is complete — ${m.contact_email ? '✓ Email on file' : '⚠ No email'}, ${m.contact_phone ? '✓ Phone on file' : '⚠ No phone'}, (3) Processing statements uploaded if in underwriting.`
  if (q.includes('email') || q.includes('follow'))
    return `Draft: "Hi ${m.owner_name || 'there'}, I wanted to follow up on your merchant account application with United Fintech. You're currently in the ${m.pipeline_stage.replace(/_/g, ' ')} stage. Please let me know if you have any questions or need assistance. — United Fintech Team"`
  if (q.includes('risk'))
    return `Risk level: ${m.risk ?? 'medium'}. MCC ${m.mcc} (${m.mcc_label}) carries ${m.risk === 'high' ? 'elevated' : 'standard'} risk. Card-present ratio is ${m.card_present_pct}%. ${m.risk === 'high' ? 'Recommend enhanced monitoring and additional documentation.' : 'No immediate concerns flagged.'}`
  if (q.includes('stage') || q.includes('advance'))
    return `Currently in ${m.pipeline_stage.replace(/_/g, ' ')} for ${m.days_in_stage} days. ${m.days_in_stage > 14 ? '⚠ This is longer than the 14-day target. ' : ''}Next step: check the Pipeline tab for the stage action checklist before advancing.`
  return `I don't have specific data on that for ${m.name}, but you can check the relevant tabs for detailed information. Is there something specific you'd like me to help analyze?`
}

const CHIPS = [
  'Summarize this client',
  "What's missing?",
  'Draft a follow-up email',
  'Risk assessment',
  'What stage should we advance to?',
]

const BOT_AVATAR: React.CSSProperties = {
  width: 26, height: 26, borderRadius: 6,
  background: 'rgba(144,196,207,0.1)',
  border: `1px solid ${BRAND.border}`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0, marginTop: 2,
}

function BotAvatar() {
  return <div style={BOT_AVATAR}><Bot size={13} color={BRAND.cyan} /></div>
}

export default function MDActivityChat({ merchant: m, activityLog, addActivity }: Props) {
  // Activity note state
  const [noteText, setNoteText] = useState('')

  // Chat state
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 'm0',
      role: 'ai',
      text: `Hi! I'm your AI assistant for ${m.name}. Ask me anything about this merchant — their risk profile, missing items, or what to do next.`,
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const userHasAsked = messages.length > 1

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function handleSend(text?: string) {
    const msg = text ?? input
    if (!msg.trim()) return
    const userMsg: ChatMsg = { id: `u${Date.now()}`, role: 'user', text: msg }
    setMessages(p => [...p, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const aiMsg: ChatMsg = {
        id: `a${Date.now()}`,
        role: 'ai',
        text: getMockResponse(msg, m),
      }
      setMessages(p => [...p, aiMsg])
      setTyping(false)
      addActivity(
        `AI query: "${msg.slice(0, 40)}${msg.length > 40 ? '…' : ''}"`,
        BRAND.cyan,
      )
    }, 800)
  }

  function handleAddNote() {
    if (!noteText.trim()) return
    addActivity('Note: ' + noteText.trim(), BRAND.muted)
    setNoteText('')
  }

  const displayedLog = showAll ? activityLog : activityLog.slice(0, 15)

  // ── Shared styles ────────────────────────────────────────────────────────

  const panelCard: React.CSSProperties = {
    background: BRAND.card,
    border: `1px solid ${BRAND.border}`,
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr)',
        gap: 20,
        alignItems: 'start',
      }}
      className="md-activity-chat-grid"
    >
      {/* ── Left: Activity Timeline ── */}
      <div style={{ ...panelCard, maxHeight: 680 }}>
        {/* Header */}
        <div
          style={{
            padding: '16px 18px',
            borderBottom: `1px solid ${BRAND.border}`,
            flexShrink: 0,
          }}
        >
          <p style={{ color: BRAND.text, fontWeight: 600, fontSize: 14, margin: 0 }}>
            Activity Log
          </p>
          <p style={{ color: BRAND.muted, fontSize: 12, margin: '3px 0 0' }}>
            {activityLog.length} entries
          </p>
        </div>

        {/* Timeline */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px' }}>
          {activityLog.length === 0 ? (
            <p style={{ color: BRAND.muted, fontSize: 13, textAlign: 'center', marginTop: 20 }}>
              No activity recorded yet.
            </p>
          ) : (
            <div style={{ position: 'relative', paddingLeft: 20 }}>
              {/* Vertical connector line */}
              <div
                style={{
                  position: 'absolute',
                  left: 5,
                  top: 8,
                  bottom: 8,
                  width: 1,
                  background: BRAND.border,
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {displayedLog.map((entry, i) => (
                  <div
                    key={entry.id}
                    style={{
                      position: 'relative',
                      paddingBottom: i < displayedLog.length - 1 ? 16 : 0,
                    }}
                  >
                    {/* Dot */}
                    <div
                      style={{
                        position: 'absolute',
                        left: -17,
                        top: 4,
                        width: 9,
                        height: 9,
                        borderRadius: '50%',
                        background: entry.color,
                        border: `2px solid ${BRAND.card}`,
                        flexShrink: 0,
                      }}
                    />
                    <p
                      style={{
                        color: BRAND.text,
                        fontSize: 12,
                        margin: '0 0 3px',
                        lineHeight: 1.5,
                      }}
                    >
                      {entry.text}
                    </p>
                    <p style={{ color: BRAND.muted, fontSize: 11, margin: 0 }}>{entry.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activityLog.length > 15 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 12,
                background: 'none',
                border: 'none',
                color: BRAND.cyan,
                fontSize: 12,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <ChevronDown size={13} />
              Show {activityLog.length - 15} more
            </button>
          )}
        </div>

        {/* Add Note */}
        <div
          style={{
            borderTop: `1px solid ${BRAND.border}`,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            flexShrink: 0,
          }}
        >
          <textarea
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="Add a note..."
            rows={2}
            style={{
              width: '100%',
              background: `rgba(255,255,255,0.04)`,
              border: `1px solid ${BRAND.border}`,
              borderRadius: 7,
              color: BRAND.text,
              fontSize: 12,
              padding: '8px 10px',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = BRAND.borderCyan)}
            onBlur={e => (e.currentTarget.style.borderColor = BRAND.border)}
          />
          <button
            onClick={handleAddNote}
            disabled={!noteText.trim()}
            style={{
              padding: '7px 0',
              background: noteText.trim() ? `rgba(144,196,207,0.15)` : 'transparent',
              border: `1px solid ${noteText.trim() ? BRAND.borderCyan : BRAND.border}`,
              borderRadius: 7,
              color: noteText.trim() ? BRAND.cyan : BRAND.muted,
              fontSize: 12,
              fontWeight: 600,
              cursor: noteText.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
            }}
          >
            Log Note
          </button>
        </div>
      </div>

      {/* ── Right: AI Chat ── */}
      <div style={{ ...panelCard, height: 680 }}>
        {/* Header */}
        <div
          style={{
            padding: '16px 18px',
            borderBottom: `1px solid ${BRAND.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `rgba(144,196,207,0.12)`,
              border: `1px solid ${BRAND.borderCyan}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bot size={16} color={BRAND.cyan} />
          </div>
          <div>
            <p style={{ color: BRAND.text, fontWeight: 600, fontSize: 14, margin: 0 }}>
              AI Assistant
            </p>
            <p style={{ color: BRAND.success, fontSize: 11, margin: '2px 0 0' }}>
              ● Online · {m.name}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 16px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {messages.map(msg => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              {msg.role === 'ai' && <BotAvatar />}

              <div
                style={{
                  maxWidth: '78%',
                  padding: '10px 13px',
                  borderRadius: msg.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                  background:
                    msg.role === 'user'
                      ? `rgba(144,196,207,0.18)`
                      : `rgba(255,255,255,0.05)`,
                  border: `1px solid ${msg.role === 'user' ? BRAND.borderCyan : BRAND.border}`,
                  color: BRAND.text,
                  fontSize: 13,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Quick chips — only shown before user asks anything */}
          {!userHasAsked && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                paddingLeft: 34,
                marginTop: -4,
              }}
            >
              {CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  style={{
                    padding: '5px 11px',
                    background: 'transparent',
                    border: `1px solid ${BRAND.borderCyan}`,
                    borderRadius: 20,
                    color: BRAND.cyan,
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.background = `rgba(144,196,207,0.1)`)
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.background = 'transparent')
                  }
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Typing indicator */}
          {typing && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <BotAvatar />
              <div style={{ padding: '10px 14px', borderRadius: '4px 12px 12px 12px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BRAND.border}`, display: 'flex', alignItems: 'center', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: BRAND.muted, animation: `typing-bounce 1.2s ease-in-out ${i * 0.2}s infinite`, display: 'inline-block' }} />
                ))}
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input bar */}
        <div
          style={{
            borderTop: `1px solid ${BRAND.border}`,
            padding: '12px 14px',
            display: 'flex',
            gap: 8,
            alignItems: 'flex-end',
            flexShrink: 0,
          }}
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask anything about this merchant..."
            disabled={typing}
            style={{
              flex: 1,
              background: `rgba(255,255,255,0.04)`,
              border: `1px solid ${BRAND.border}`,
              borderRadius: 8,
              color: BRAND.text,
              fontSize: 13,
              padding: '9px 12px',
              outline: 'none',
              fontFamily: 'inherit',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = BRAND.borderCyan)}
            onBlur={e => (e.currentTarget.style.borderColor = BRAND.border)}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || typing}
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: input.trim() && !typing ? BRAND.cyan : `rgba(144,196,207,0.1)`,
              border: `1px solid ${input.trim() && !typing ? BRAND.cyan : BRAND.border}`,
              color: input.trim() && !typing ? '#1c1c1c' : BRAND.muted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: input.trim() && !typing ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
              flexShrink: 0,
            }}
          >
            <Send size={15} />
          </button>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @media (max-width: 768px) {
          .md-activity-chat-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
