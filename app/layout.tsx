import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['200', '300', '400', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'United Fintech — Global Interchange',
  description: 'Strategic financial infrastructure for global eCommerce merchants. Merchant processing, embedded finance, and risk mitigation solutions.',
  keywords: ['merchant processing', 'payment processing', 'embedded finance', 'risk mitigation', 'fintech', 'global interchange'],
  icons: {
    icon: '/logo-icon.png',
    apple: '/logo-icon.png',
  },
  openGraph: {
    title: 'United Fintech — Global Interchange',
    description: 'Strategic financial infrastructure for global eCommerce merchants.',
    siteName: 'United Fintech',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
