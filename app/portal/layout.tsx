import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'United Fintech — Client Portal',
  description: 'Merchant onboarding portal',
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children
}
