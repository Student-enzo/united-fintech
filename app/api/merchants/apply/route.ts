import { NextRequest, NextResponse } from 'next/server'
import { upsertMerchantFromApplication } from '@/lib/merchants-db'
import type { AccountType } from '@/lib/mock-merchants'

export const dynamic = 'force-dynamic'

const LEGAL_STRUCTURES = ['LLC', 'Corporation', 'Sole Proprietor', 'Partnership']
const ACCOUNT_TYPES: AccountType[] = ['Card Present', 'eCommerce', 'MOTO', 'ACH']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

function num(v: unknown): number | null {
  const n = typeof v === 'number' ? v : parseFloat(str(v).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validate(body: any) {
  const errors: Record<string, string> = {}

  const businessName = str(body.businessName)
  if (businessName.length < 2) errors.businessName = 'Business name is required.'

  const legalStructure = str(body.legalStructure)
  if (!LEGAL_STRUCTURES.includes(legalStructure)) errors.legalStructure = 'Select a valid legal structure.'

  const accountType = str(body.accountType) as AccountType
  if (!ACCOUNT_TYPES.includes(accountType)) errors.accountType = 'Select a valid account type.'

  const industry = str(body.industry)
  if (industry.length < 2) errors.industry = 'Industry / type of business is required.'

  const ownerName = str(body.ownerName)
  if (ownerName.length < 2) errors.ownerName = "Owner's full name is required."

  const contactEmail = str(body.contactEmail).toLowerCase()
  if (!EMAIL_RE.test(contactEmail)) errors.contactEmail = 'Enter a valid email address.'

  const contactPhoneDigits = str(body.contactPhone).replace(/\D/g, '')
  if (contactPhoneDigits.length < 10) errors.contactPhone = 'Enter a valid phone number.'

  const monthlyVolume = num(body.monthlyVolume)
  if (monthlyVolume === null || monthlyVolume <= 0) errors.monthlyVolume = 'Enter estimated monthly volume.'

  const avgTicket = num(body.avgTicket)
  if (avgTicket === null || avgTicket <= 0) errors.avgTicket = 'Enter an average ticket size.'

  const cardPresentPctRaw = num(body.cardPresentPct)
  const cardPresentPct = cardPresentPctRaw === null ? 50 : Math.min(100, Math.max(0, cardPresentPctRaw))

  const dba = str(body.dba)

  if (Object.keys(errors).length > 0) return { errors }

  return {
    value: {
      name:             businessName,
      dba_name:         dba || undefined,
      mcc:              '',
      mcc_label:        industry,
      legal_structure:  legalStructure,
      account_type:     accountType,
      monthly_volume:   monthlyVolume as number,
      avg_ticket:       avgTicket as number,
      card_present_pct: cardPresentPct,
      owner_name:       ownerName,
      contact_email:    contactEmail,
      contact_phone:    str(body.contactPhone),
    },
  }
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const result = validate(body)
  if ('errors' in result) {
    return NextResponse.json({ error: 'Please fix the highlighted fields.', fields: result.errors }, { status: 400 })
  }

  try {
    const { merchant, created } = await upsertMerchantFromApplication(result.value)
    return NextResponse.json({ success: true, merchantId: merchant.id, created })
  } catch (err) {
    console.error('[merchants/apply POST] error:', err)
    return NextResponse.json({ error: 'Something went wrong submitting your application. Please try again.' }, { status: 500 })
  }
}
