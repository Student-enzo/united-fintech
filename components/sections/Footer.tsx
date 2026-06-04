'use client'
// TODO: Replace placeholder contact info (email, phone) with real details before launch.

import Link from 'next/link'
import Image from 'next/image'

const SOLUTIONS = [
  { label: 'Merchant Processing', href: '/services/merchant-processing' },
  { label: 'Embedded Finance', href: '/services/embedded-finance' },
  { label: 'Risk Mitigation', href: '/services/risk-mitigation' },
]

const COMPANY = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Book a Consultation', href: '/#consultation' },
]

const RESOURCES = [
  { label: 'Insights', href: '/#insights' },
  { label: 'Market Coverage', href: '/#markets' },
  { label: 'Partner Network', href: '/#partners' },
]

const CONTACT = [
  // TODO: Replace with real contact info
  { label: 'info@unitedfintech.com', href: 'mailto:info@unitedfintech.com' },
  { label: '+1 (555) 000-0000', href: 'tel:+15550000000' },
]

const linkStyle: React.CSSProperties = {
  display: 'block',
  color: '#7E8794',
  fontSize: '0.875rem',
  textDecoration: 'none',
  marginBottom: '0.625rem',
  transition: 'color 0.15s',
}

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0A0C12', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '4rem 1.5rem 2rem' }}>
      <div className="max-w-7xl mx-auto">

        <div style={{ display: 'grid', gap: '3rem', marginBottom: '3.5rem' }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">

          {/* Brand — spans 2 columns */}
          <div style={{ gridColumn: 'span 2' }}>
            {/* Logo */}
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', marginBottom: '1.25rem' }}>
              <Image
                src="/logo.png"
                alt="United Fintech — Global Interchange"
                width={160}
                height={40}
                style={{ height: 32, width: 'auto', objectFit: 'contain' }}
              />
            </Link>

            <p style={{ color: '#7E8794', fontSize: '0.875rem', lineHeight: 1.75, maxWidth: 280, marginBottom: '1.5rem' }}>
              Strategic financial infrastructure for global merchants. We connect complex businesses with the acquiring relationships, banking solutions, and risk strategies they need to scale.
            </p>

            {/* Contact quick-links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {CONTACT.map((c) => (
                <a key={c.href} href={c.href}
                  style={{ color: '#7E8794', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#2BB8E6' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#7E8794' }}>
                  {c.label}
                </a>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <p style={{ color: '#E8EDF2', fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem', letterSpacing: '0.04em' }}>Solutions</p>
            {SOLUTIONS.map((l) => (
              <Link key={l.href} href={l.href} style={linkStyle}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#2BB8E6' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#7E8794' }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <p style={{ color: '#E8EDF2', fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem', letterSpacing: '0.04em' }}>Company</p>
            {COMPANY.map((l) => (
              <Link key={l.href} href={l.href} style={linkStyle}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#2BB8E6' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#7E8794' }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Resources */}
          <div>
            <p style={{ color: '#E8EDF2', fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem', letterSpacing: '0.04em' }}>Resources</p>
            {RESOURCES.map((l) => (
              <Link key={l.href} href={l.href} style={linkStyle}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#2BB8E6' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#7E8794' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
          <p style={{ color: '#7E8794', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} United Fintech. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                style={{ color: '#7E8794', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#2BB8E6' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#7E8794' }}>
                {l.label}
              </Link>
            ))}
            <Link
              href="/admin"
              style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.75rem', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#2BB8E6' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.18)' }}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
