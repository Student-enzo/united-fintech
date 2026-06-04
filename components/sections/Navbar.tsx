'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { LiquidButton } from '@/components/ui/liquid-glass-button'

const CYAN = '#2BB8E6'
const TEXT = '#E8EDF2'
const MUTED = '#7E8794'

const SOLUTIONS = [
  { label: 'Merchant Processing', href: '/services/merchant-processing', desc: 'Global acquiring & payment infrastructure' },
  { label: 'Embedded Finance', href: '/services/embedded-finance', desc: 'Banking-as-a-service & embedded accounts' },
  { label: 'Risk Mitigation', href: '/services/risk-mitigation', desc: 'Stability, protection & advisory strategy' },
]

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Markets', href: '/#markets' },
  { label: 'Partners', href: '/#partners' },
  { label: 'Insights', href: '/#insights' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSolutionsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const isActive = (href: string) => pathname === href

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          width: 'calc(100% - 32px)',
          maxWidth: 1120,
          backgroundColor: scrolled ? 'rgba(10,12,18,0.97)' : 'rgba(10,12,18,0.65)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          borderRadius: 999,
          border: scrolled
            ? '1px solid rgba(43,184,230,0.22)'
            : '1px solid rgba(255,255,255,0.08)',
          boxShadow: scrolled
            ? '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(43,184,230,0.06)'
            : '0 4px 24px rgba(0,0,0,0.4)',
          transition: 'background-color 0.3s, border-color 0.3s, box-shadow 0.3s',
          overflow: 'visible',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px 6px 14px', height: 56 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <Image
              src="/logo.png"
              alt="United Fintech — Global Interchange"
              width={160}
              height={40}
              style={{ height: 36, width: 'auto', objectFit: 'contain' }}
              priority
            />
          </Link>

          {/* Desktop nav — centered */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.1rem', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>

            {/* Solutions dropdown */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onMouseEnter={() => setSolutionsOpen(true)}
                onMouseLeave={(e) => {
                  if (!dropdownRef.current?.contains(e.relatedTarget as Node)) setSolutionsOpen(false)
                }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: solutionsOpen ? TEXT : MUTED,
                  fontSize: '0.875rem', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '0.25rem',
                  padding: '0.4rem 0.875rem', borderRadius: 999,
                  transition: 'color 0.15s, background-color 0.15s',
                  backgroundColor: solutionsOpen ? 'rgba(43,184,230,0.08)' : 'transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                Solutions
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  style={{ transition: 'transform 0.2s', transform: solutionsOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {solutionsOpen && (
                <div
                  onMouseEnter={() => setSolutionsOpen(true)}
                  onMouseLeave={() => setSolutionsOpen(false)}
                  style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', paddingTop: 10, zIndex: 100, width: 320 }}
                >
                  <div style={{
                    backgroundColor: 'rgba(10,12,18,0.98)',
                    backdropFilter: 'blur(32px)',
                    WebkitBackdropFilter: 'blur(32px)',
                    border: '1px solid rgba(43,184,230,0.18)',
                    borderRadius: 20,
                    padding: '1rem',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)',
                  }}>
                    <p style={{ color: MUTED, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em', marginBottom: '0.625rem', padding: '0 0.25rem', textTransform: 'uppercase' }}>Our Solutions</p>
                    {SOLUTIONS.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        onClick={() => setSolutionsOpen(false)}
                        style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', padding: '0.625rem 0.5rem', borderRadius: 12, textDecoration: 'none', transition: 'background-color 0.15s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(43,184,230,0.06)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <span style={{ color: TEXT, fontSize: '0.875rem', fontWeight: 600 }}>{s.label}</span>
                        <span style={{ color: MUTED, fontSize: '0.75rem' }}>{s.desc}</span>
                      </Link>
                    ))}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '0.625rem', paddingTop: '0.625rem' }}>
                      <Link href="/about" onClick={() => setSolutionsOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.5rem', color: CYAN, fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', borderRadius: 8, transition: 'background-color 0.15s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(43,184,230,0.07)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        About United Fintech
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: isActive(link.href) ? TEXT : MUTED,
                  fontSize: '0.875rem', fontWeight: 500,
                  textDecoration: 'none',
                  padding: '0.4rem 0.875rem', borderRadius: 999,
                  transition: 'color 0.15s, background-color 0.15s',
                  whiteSpace: 'nowrap',
                  backgroundColor: isActive(link.href) ? 'rgba(43,184,230,0.08)' : 'transparent',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = TEXT; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = isActive(link.href) ? TEXT : MUTED; e.currentTarget.style.backgroundColor = isActive(link.href) ? 'rgba(43,184,230,0.08)' : 'transparent' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right CTA */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <Link
              href="/contact"
              className="btn-cyan-outline"
              style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
            >
              Contact Us
            </Link>
            <LiquidButton size="sm"
              className="bg-[#2BB8E6] text-[#0A0C12] font-bold rounded-full whitespace-nowrap"
              onClick={() => { window.location.href = '/#consultation' }}>
              Book a Consultation
            </LiquidButton>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', marginRight: 4 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div style={{ width: 22, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ display: 'block', height: 2, background: TEXT, borderRadius: 2, transition: 'transform 0.2s', transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
              <span style={{ display: 'block', height: 2, background: TEXT, borderRadius: 2, opacity: mobileOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
              <span style={{ display: 'block', height: 2, background: TEXT, borderRadius: 2, transition: 'transform 0.2s', transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)', maxWidth: 1120, zIndex: 49,
          backgroundColor: 'rgba(10,12,18,0.97)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 20, border: '1px solid rgba(43,184,230,0.15)',
          padding: '1.25rem 1.5rem 1.5rem',
          boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
        }}>
          <p style={{ color: MUTED, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Solutions</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
            {SOLUTIONS.map((s) => (
              <Link key={s.href} href={s.href} onClick={() => setMobileOpen(false)}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', padding: '0.625rem 0.75rem', borderRadius: 12, textDecoration: 'none', backgroundColor: 'rgba(43,184,230,0.05)', border: '1px solid rgba(43,184,230,0.1)' }}>
                <span style={{ color: TEXT, fontSize: '0.9rem', fontWeight: 600 }}>{s.label}</span>
                <span style={{ color: MUTED, fontSize: '0.75rem' }}>{s.desc}</span>
              </Link>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
            {[{ label: 'About', href: '/about' }, { label: 'Markets', href: '/#markets' }, { label: 'Partners', href: '/#partners' }, { label: 'Insights', href: '/#insights' }].map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', color: TEXT, fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.95rem' }}>
                {link.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <Link href="/#consultation" onClick={() => setMobileOpen(false)}
              style={{ textAlign: 'center', padding: '0.875rem', borderRadius: 999, backgroundColor: CYAN, color: '#0A0C12', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem', boxShadow: '0 0 24px rgba(43,184,230,0.3)' }}>
              Book a Consultation
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)}
              style={{ textAlign: 'center', padding: '0.75rem', borderRadius: 999, border: `1px solid ${CYAN}`, color: CYAN, fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
