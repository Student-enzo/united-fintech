export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

const today = new Date().toISOString().slice(0, 10)

const SYSTEM_PROMPT = `You are the AI Assistant for United Fintech — an ISO / merchant-account brokerage platform.
TODAY: ${today}

You help the team manage merchant accounts, residual income, deals, compliance, and partner relationships.

SCOPE:
- Merchant portfolio: onboarding status, processing volume, chargeback ratios, effective rates
- Residuals: IC+ pricing, interchange splits, residual statements, per-MID analysis
- Deals: proposals, follow-up emails, deal pipeline, approval status
- Compliance: KYC status, 90-day reviews, high-risk flags, chargeback thresholds
- Partners: ISO agents, sub-agents, referral partners, commission splits
- Calculations: effective rate = (total fees / total volume) × 100; IC+ = interchange + markup

TONE: Professional, concise, numbers-first. Short answers for simple questions. Detail only when asked.

When asked to draft an email, produce the full email text in a clean format.
When asked to calculate, show the formula and the result.
When asked to analyze, summarize key findings in bullet points.`

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json({
      message:
        'AI requires OPENROUTER_API_KEY. Add it in Vercel → Settings → Environment Variables.',
    })
  }

  const chatMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
  ]

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://united-fintech.vercel.app',
        'X-Title': 'United Fintech Admin',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct',
        max_tokens: 1500,
        messages: chatMessages,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      const detail = data?.error?.message ?? data?.message ?? JSON.stringify(data)
      return NextResponse.json({ message: `AI service error (${res.status}): ${detail}` })
    }

    const choice = data.choices?.[0]
    if (!choice) return NextResponse.json({ message: 'No response from AI.' })

    return NextResponse.json({ message: choice.message?.content ?? 'No response.' })
  } catch (err) {
    console.error('AI chat error:', err)
    return NextResponse.json({ message: 'Failed to connect to AI. Please try again.' })
  }
}
