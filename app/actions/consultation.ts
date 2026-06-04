'use server'

import { supabasePublic } from '@/lib/supabase-public'

export interface ConsultationFormData {
  name: string
  email: string
  phone: string
  company: string
  monthly_volume: string
  service_interest: 'merchant_processing' | 'embedded_finance' | 'risk_mitigation' | 'all'
  message: string
}

export interface ConsultationResult {
  success: boolean
  error?: string
}

export async function submitConsultation(data: ConsultationFormData): Promise<ConsultationResult> {
  if (!data.name?.trim() || !data.email?.trim()) {
    return { success: false, error: 'Name and email are required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    return { success: false, error: 'Please provide a valid email address.' }
  }

  try {
    const { error: insertError } = await supabasePublic.from('consultations').insert({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || null,
      company: data.company?.trim() || null,
      monthly_volume: data.monthly_volume || null,
      service_interest: data.service_interest || 'all',
      message: data.message?.trim() || null,
    })

    if (insertError) {
      console.error('Consultation insert error:', insertError.message, insertError.code)
      return { success: false, error: 'Failed to submit your request. Please try again.' }
    }

    return { success: true }
  } catch (err) {
    console.error('Consultation action error:', err)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
