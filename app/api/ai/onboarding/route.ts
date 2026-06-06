export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'meta-llama/llama-3.3-70b-instruct'

async function callAI(system: string, user: string, maxTokens = 1500): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('Missing OPENROUTER_API_KEY')

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://united-fintech.vercel.app',
      'X-Title': 'United Fintech Onboarding',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message ?? `AI error ${res.status}`)
  return data.choices?.[0]?.message?.content ?? ''
}

function parseJSON(text: string): unknown {
  const match = text.match(/```json\s*([\s\S]*?)```/) ?? text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/)
  try {
    return JSON.parse(match ? match[1] ?? match[0] : text)
  } catch {
    return { raw: text }
  }
}

async function analyzeDocuments(body: Record<string, unknown>) {
  const docs = body.documents as Array<{ doc_type: string; file_name: string; ai_analysis?: string }> ?? []
  const system = 'You are an expert ISO underwriter reviewing merchant account documents. Return only valid JSON.'
  const user = `Analyze these documents and return JSON:
{
  "riskTier": "low|medium|high|very_high",
  "riskScore": 0-100,
  "riskReasoning": "string",
  "documentFlags": [{"docType": "string", "suspicious": bool, "stale": bool, "extracted_data": {}}],
  "preApprovalRecommendation": "approve|decline|review",
  "summary": "string"
}

Documents:
${docs.map((d) => `- ${d.doc_type} (${d.file_name}): ${d.ai_analysis ?? 'no prior analysis'}`).join('\n')}`

  const raw = await callAI(system, user, 1200)
  return { result: parseJSON(raw) }
}

async function suggestPartners(body: Record<string, unknown>) {
  const partners = body.partners as Array<{ name: string; type: string; risk_appetite: string; training_notes: string }> ?? []
  const profile = JSON.stringify(body.clientProfile ?? {})
  const system = 'You are an ISO agent matching merchant profiles to acquiring banks. Return only valid JSON.'
  const user = `Client profile: ${profile}

Partners:
${partners.map((p, i) => `${i}. ${p.name} (${p.type}, risk: ${p.risk_appetite}): ${p.training_notes}`).join('\n')}

Return JSON array ranked by fit:
[{"partnerName": "string", "matchScore": 0-100, "reasoning": "string", "recommended": bool}]`

  const raw = await callAI(system, user, 1000)
  return { result: parseJSON(raw) }
}

async function answerQuestion(body: Record<string, unknown>) {
  const docs = body.documents as Array<{ doc_type: string; file_name: string; ai_analysis?: string }> ?? []
  const question = (body.question as string) ?? ''
  const system = 'You are an expert reviewing merchant documents for an ISO. You can suggest actions. Return JSON: {"answer": "string", "actions": [{"action": "accept_document|add_note", "payload": {}}]}'
  const user = `Documents available:
${docs.map((d) => `- ${d.doc_type} (${d.file_name}): ${d.ai_analysis ?? 'no analysis'}`).join('\n')}

Question: ${question}`

  const raw = await callAI(system, user, 800)
  const parsed = parseJSON(raw) as { answer?: string; actions?: unknown[] }
  return { result: parsed?.answer ?? raw, actions: parsed?.actions ?? [] }
}

async function draftEmail(body: Record<string, unknown>) {
  const emailType = (body.emailType as string) ?? 'acknowledgment'
  const clientData = body.clientData as Record<string, string> ?? {}
  const system = 'You are drafting professional emails for United Fintech, an ISO. Tone: professional but warm. Return JSON: {"subject": "string", "body": "string"}'
  const user = `Draft a "${emailType}" email.
Client data: ${JSON.stringify(clientData)}
Return subject and body as JSON.`

  const raw = await callAI(system, user, 800)
  return { result: parseJSON(raw) }
}

async function autoAccept(body: Record<string, unknown>) {
  const docs = body.documents as Array<{ doc_type: string; file_name: string; ai_analysis?: string }> ?? []
  const system = 'You are an ISO underwriter. Decide auto-accept for each document. Return only valid JSON array.'
  const user = `For each document decide if it can be auto-accepted:
${docs.map((d) => `- ${d.doc_type} (${d.file_name}): ${d.ai_analysis ?? 'no analysis'}`).join('\n')}

Return: [{"docType": "string", "fileName": "string", "accept": bool, "reason": "string"}]`

  const raw = await callAI(system, user, 600)
  return { result: parseJSON(raw) }
}

async function websiteCheck(body: Record<string, unknown>) {
  const url = (body.websiteUrl as string) ?? ''
  const system = 'You are a compliance analyst reviewing merchant websites. Return only valid JSON.'
  const user = `Analyze this merchant website URL: ${url}

Return JSON:
{
  "valid": bool,
  "businessDescription": "string",
  "has_terms": bool,
  "has_privacy": bool,
  "has_refund": bool,
  "flags": ["string"]
}`

  const raw = await callAI(system, user, 500)
  return { result: parseJSON(raw) }
}

async function fillAgreement(body: Record<string, unknown>) {
  const c = body.clientData as Record<string, string> ?? {}
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const text = `MERCHANT SERVICES REPRESENTATION AGREEMENT

Date: ${c.date ?? today}

This Merchant Services Representation Agreement ("Agreement") is entered into between:

United Fintech, LLC ("ISO")
and
${c.business_name ?? '[Business Name]'} ("Merchant")
Owner: ${c.owner_name ?? '[Owner Name]'}
Address: ${c.address ?? '[Business Address]'}
Monthly Processing Volume (estimated): $${c.monthly_volume ?? '[Volume]'}

1. SCOPE OF SERVICES
United Fintech will act as Merchant's ISO representative to identify and facilitate merchant account placement with acquiring banking partners.

2. MERCHANT OBLIGATIONS
Merchant agrees to provide accurate and complete business and financial information and to maintain compliance with card brand rules.

3. TERM
This Agreement commences on the date above and continues until terminated by either party with 30 days written notice.

4. CONFIDENTIALITY
Both parties agree to keep all information shared under this agreement confidential.

5. AGREEMENT
By proceeding with the onboarding process, Merchant acknowledges and accepts the terms of this Agreement.

____________________________         ____________________________
${c.owner_name ?? '[Owner Name]'}              United Fintech Representative
Merchant Signature                   ISO Signature
Date: ${c.date ?? today}                       Date: ${c.date ?? today}`

  return { result: { agreementText: text } }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>
    const { action } = body

    if (!action) {
      return NextResponse.json({ success: false, result: null, error: 'action is required' }, { status: 400 })
    }

    let outcome: { result: unknown; actions?: unknown[] }

    switch (action) {
      case 'analyze_documents':
        outcome = await analyzeDocuments(body)
        break
      case 'suggest_partners':
        outcome = await suggestPartners(body)
        break
      case 'answer_question':
        outcome = await answerQuestion(body)
        break
      case 'draft_email':
        outcome = await draftEmail(body)
        break
      case 'auto_accept':
        outcome = await autoAccept(body)
        break
      case 'website_check':
        outcome = await websiteCheck(body)
        break
      case 'fill_agreement':
        outcome = await fillAgreement(body)
        break
      default:
        return NextResponse.json({ success: false, result: null, error: `Unknown action: ${action}` }, { status: 400 })
    }

    return NextResponse.json({ success: true, ...outcome })
  } catch (err) {
    console.error('[ai/onboarding]', err)
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ success: false, result: null, error: message }, { status: 500 })
  }
}
