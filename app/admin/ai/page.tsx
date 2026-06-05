'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'
import { Send, MessageSquare, Sparkles } from 'lucide-react'
import { Spotlight } from '@/components/ui/spotlight'

type Message = { role: 'user' | 'assistant'; content: string }

const SUGGESTED_PROMPTS = [
  'Analyze my residual statement for this month',
  'Flag merchants with chargeback risk above 1%',
  'Draft a follow-up email for proposal #UF-DEAL-0042',
  'Summarize new activations this week',
  'Calculate effective rate for $500K volume at IC+ 0.20%',
  'Which merchants are up for 90-day review?',
]

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5"
          style={{ backgroundColor: 'rgba(144,196,207,0.15)', border: '1px solid rgba(144,196,207,0.25)' }}
        >
          <Sparkles size={13} style={{ color: '#90c4cf' }} />
        </div>
      )}
      <div
        className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
        style={
          isUser
            ? { backgroundColor: '#90c4cf', color: '#0a0a0a', borderBottomRightRadius: 4 }
            : {
                backgroundColor: '#1c1c1c',
                color: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(144,196,207,0.13)',
                borderBottomLeftRadius: 4,
              }
        }
      >
        {msg.content}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex justify-start mb-3">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
        style={{ backgroundColor: 'rgba(144,196,207,0.15)', border: '1px solid rgba(144,196,207,0.25)' }}
      >
        <Sparkles size={13} style={{ color: '#90c4cf' }} />
      </div>
      <div
        className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
        style={{ backgroundColor: '#1c1c1c', border: '1px solid rgba(144,196,207,0.13)', borderBottomLeftRadius: 4 }}
      >
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{
              backgroundColor: 'rgba(144,196,207,0.5)',
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }`}</style>
    </div>
  )
}

/**
 * CSS-only ambient orb panel — no WASM, no 3D runtime.
 * Uses a pulsing radial gradient that subtly shifts with mouse position.
 */
function AmbientOrb({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Primary orb — follows mouse offset */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 520,
          height: 520,
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${mouseX * 40}px), calc(-50% + ${mouseY * 30}px))`,
          background: 'radial-gradient(circle, rgba(144,196,207,0.13) 0%, rgba(144,196,207,0.04) 50%, transparent 72%)',
          transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
          animation: 'orbPulse 6s ease-in-out infinite',
        }}
      />
      {/* Secondary orb — counter-moves for depth */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 340,
          height: 340,
          top: '38%',
          left: '44%',
          transform: `translate(calc(-50% + ${mouseX * -24}px), calc(-50% + ${mouseY * -18}px))`,
          background: 'radial-gradient(circle, rgba(144,196,207,0.08) 0%, transparent 65%)',
          transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
          animation: 'orbPulse 9s ease-in-out 1.5s infinite',
        }}
      />
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(144,196,207,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(144,196,207,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      {/* Center icon */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(144,196,207,0.08)',
            border: '1px solid rgba(144,196,207,0.18)',
            boxShadow: '0 0 40px rgba(144,196,207,0.12)',
          }}
        >
          <Sparkles size={28} style={{ color: '#90c4cf' }} />
        </div>
        <p className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: 'rgba(144,196,207,0.4)' }}>
          Powered by Claude
        </p>
      </div>
      <style>{`
        @keyframes orbPulse {
          0%, 100% { opacity: 1; transform: translate(calc(-50% + 0px), calc(-50% + 0px)) scale(1); }
          50% { opacity: 0.7; transform: translate(calc(-50% + 0px), calc(-50% + 0px)) scale(1.06); }
        }
      `}</style>
    </div>
  )
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [noKey, setNoKey] = useState(false)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    function handleMouse(e: MouseEvent) {
      // Normalize to [-1, 1] range from viewport center
      setMouseX((e.clientX / window.innerWidth - 0.5) * 2)
      setMouseY((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  async function send(text: string) {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text.trim() }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      const reply = data.message ?? 'No response.'
      if (reply.includes('OPENROUTER_API_KEY')) setNoKey(true)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Failed to connect to AI. Please try again.' },
      ])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    send(input)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ margin: '-32px', height: 'calc(100vh - 64px)', backgroundColor: '#0a0a0a' }}
    >
      <Spotlight className="-top-40 left-0 md:-top-20" fill="rgba(144,196,207,0.45)" />

      {/* Header */}
      <div
        className="flex items-center gap-3 px-8 pt-8 pb-5 border-b relative z-10"
        style={{ borderColor: 'rgba(144,196,207,0.1)' }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(144,196,207,0.12)',
            border: '1px solid rgba(144,196,207,0.2)',
          }}
        >
          <MessageSquare size={17} style={{ color: '#90c4cf' }} />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">AI Assistant</h1>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Powered by Claude &mdash; your fintech intelligence layer
          </p>
        </div>
      </div>

      {/* Body — left chat panel | right ambient orb */}
      <div className="flex flex-1 min-h-0">

        {/* Left panel */}
        <div className="w-[44%] flex flex-col relative z-10">
          {isEmpty ? (
            /* Empty state: heading + suggestion chips */
            <div className="flex flex-col justify-center px-8 py-6 h-full">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{
                  backgroundColor: 'rgba(144,196,207,0.12)',
                  border: '1px solid rgba(144,196,207,0.2)',
                }}
              >
                <Sparkles size={18} style={{ color: '#90c4cf' }} />
              </div>
              <p className="text-3xl font-bold text-white mb-2 leading-tight">
                Hello, Enzo.<br />How can I help?
              </p>
              <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Ask me about merchants, residuals, deals, or anything in your portfolio.
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-3 py-2 rounded-full transition-colors cursor-pointer"
                    style={{
                      backgroundColor: 'rgba(10,10,10,0.6)',
                      border: '1px solid rgba(144,196,207,0.22)',
                      color: 'rgba(255,255,255,0.7)',
                      backdropFilter: 'blur(8px)',
                    }}
                    onMouseEnter={e => {
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(144,196,207,0.18)'
                      ;(e.currentTarget as HTMLElement).style.color = '#fff'
                    }}
                    onMouseLeave={e => {
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(10,10,10,0.6)'
                      ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Chat state: scrollable messages */
            <div className="flex flex-col h-full">
              {noKey && (
                <div
                  className="mx-4 mt-4 px-4 py-3 rounded-xl text-xs flex-shrink-0"
                  style={{
                    backgroundColor: 'rgba(251,191,36,0.1)',
                    border: '1px solid rgba(251,191,36,0.25)',
                    color: '#FBD24A',
                  }}
                >
                  Add <code className="font-mono">OPENROUTER_API_KEY</code> to Vercel &rarr; Project
                  &rarr; Settings &rarr; Environment Variables.
                </div>
              )}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {messages.map((m, i) => (
                  <Bubble key={i} msg={m} />
                ))}
                {loading && <TypingDots />}
                <div ref={bottomRef} />
              </div>
            </div>
          )}
        </div>

        {/* Right panel: CSS-only ambient orb — zero WASM overhead */}
        <div className="flex-1 relative border-l" style={{ borderColor: 'rgba(144,196,207,0.07)' }}>
          <AmbientOrb mouseX={mouseX} mouseY={mouseY} />
        </div>
      </div>

      {/* Input bar */}
      <div
        className="px-8 pb-6 pt-4 border-t relative z-10"
        style={{
          borderColor: 'rgba(144,196,207,0.1)',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(10,10,10,0.5)',
        }}
      >
        <form onSubmit={onSubmit} className="flex items-center gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask about merchants, residuals, deals, chargebacks..."
            rows={1}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
            className="flex-1 resize-none text-sm px-4 py-3 rounded-xl focus:outline-none transition-colors"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(144,196,207,0.2)',
              color: 'rgba(255,255,255,0.85)',
              maxHeight: 120,
              minHeight: 46,
            }}
            onInput={e => {
              const el = e.currentTarget
              el.style.height = 'auto'
              el.style.height = Math.min(el.scrollHeight, 120) + 'px'
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              backgroundColor: input.trim() && !loading ? '#90c4cf' : 'rgba(255,255,255,0.07)',
              color: input.trim() && !loading ? '#0a0a0a' : 'rgba(255,255,255,0.3)',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            }}
          >
            <Send size={15} />
          </button>
        </form>
        <p className="text-[10px] mt-2" style={{ color: 'rgba(255,255,255,0.18)' }}>
          Press Enter to send &middot; Shift+Enter for new line &middot; Powered by Claude
        </p>
      </div>
    </div>
  )
}
