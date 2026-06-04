'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useCursorArrow } from '@/components/ui/cursor-arrow'

const CYAN = '#1EA8D4'
const TEXT = '#E8EDF2'
const MUTED = '#9BA5B0'

const SOLUTIONS = [
  { label: 'Merchant Processing', href: '/services/merchant-processing', desc: 'Global acquiring & payment infrastructure' },
  { label: 'Embedded Finance', href: '/services/embedded-finance', desc: 'Banking-as-a-service & embedded accounts' },
  { label: 'Risk Mitigation', href: '/services/risk-mitigation', desc: 'Stability, protection & advisory strategy' },
]

const NAV_LINKS = [
  { label: 'About', href: '/about', anchor: null },
  { label: 'Markets', href: '/#markets', anchor: 'markets' },
  { label: 'Partners', href: '/#partners', anchor: 'partners' },
  { label: 'Insights', href: '/blog', anchor: null },
]

export default function Navbar() {
  const consultationRef = useCursorArrow<HTMLAnchorElement>()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 70)
    onScroll()
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

  const scrollTo = (anchor: string) => {
    const el = document.getElementById(anchor)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // When NOT scrolled: translateX(0) → stays at right:16px
  // When scrolled: translateX(calc(-50vw + 50% + 16px)) → centers the pill
  const navTransform = scrolled ? 'translateX(calc(-50vw + 50% + 16px))' : 'translateX(0)'

  return (
    <>
      {/* ── Logo — big, top-left, fades when scrolled ── */}
      <motion.div
        initial={false}
        animate={{ opacity: scrolled ? 0 : 1, y: scrolled ? -10 : 0 }}
        transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'fixed', top: 20, left: 24, zIndex: 52,
          pointerEvents: scrolled ? 'none' : 'all',
        }}
      >
        <Link href="/" style={{ display: 'block', textDecoration: 'none' }}>
          <Image
            src="/logo.png"
            alt="United Fintech — Global Interchange"
            width={480} height={96}
            style={{ height: 96, width: 'auto', objectFit: 'contain' }}
            priority
          />
        </Link>
      </motion.div>

      {/* ── Desktop Nav ── */}
      <nav
        className="hidden md:flex"
        style={{
          position: 'fixed', top: 14, right: 16, zIndex: 50,
          alignItems: 'center', gap: '0.25rem',
          height: 56, borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.10)',
          backgroundColor: 'rgba(10,12,18,0.97)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
          padding: '0 8px 0 16px',
          transform: navTransform,
          transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'visible', whiteSpace: 'nowrap',
        }}
      >
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
              backgroundColor: solutionsOpen ? 'rgba(30,168,212,0.08)' : 'transparent',
              whiteSpace: 'nowrap',
              textShadow: 'none',
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
                backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)',
                border: '1px solid rgba(30,168,212,0.18)',
                borderRadius: 20, padding: '1rem',
                boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
              }}>
                <p style={{ color: MUTED, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em', marginBottom: '0.625rem', padding: '0 0.25rem', textTransform: 'uppercase' }}>
                  Our Solutions
                </p>
                {SOLUTIONS.map((s) => (
                  <Link key={s.href} href={s.href} onClick={() => setSolutionsOpen(false)}
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', padding: '0.625rem 0.5rem', borderRadius: 12, textDecoration: 'none', transition: 'background-color 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(30,168,212,0.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <span style={{ color: TEXT, fontSize: '0.875rem', fontWeight: 600 }}>{s.label}</span>
                    <span style={{ color: MUTED, fontSize: '0.75rem' }}>{s.desc}</span>
                  </Link>
                ))}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '0.625rem', paddingTop: '0.625rem' }}>
                  <Link href="/about" onClick={() => setSolutionsOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.5rem', color: CYAN, fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', borderRadius: 8, transition: 'background-color 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(30,168,212,0.07)')}
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

        {/* Nav links */}
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href}
            onClick={link.anchor ? (e) => { e.preventDefault(); scrollTo(link.anchor!) } : undefined}
            style={{
              color: isActive(link.href) ? TEXT : MUTED,
              fontSize: '0.875rem', fontWeight: 500,
              textDecoration: 'none', padding: '0.4rem 0.875rem', borderRadius: 999,
              transition: 'color 0.15s, background-color 0.15s',
              whiteSpace: 'nowrap',
              backgroundColor: isActive(link.href) ? 'rgba(30,168,212,0.08)' : 'transparent',
              textShadow: 'none',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = TEXT; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = isActive(link.href) ? TEXT : MUTED; e.currentTarget.style.backgroundColor = isActive(link.href) ? 'rgba(30,168,212,0.08)' : 'transparent' }}
          >
            {link.label}
          </Link>
        ))}

        {/* Divider */}
        <span style={{ width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.15)', display: 'inline-block', margin: '0 0.25rem', flexShrink: 0 }} />

        {/* Portal */}
        <Link href="/login"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            fontSize: '0.8rem', fontWeight: 600, color: TEXT,
            textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.15)', whiteSpace: 'nowrap',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
          </svg>
          Portal
        </Link>

        {/* Contact Us */}
        <Link href="/contact"
          style={{
            fontSize: '0.875rem', padding: '0.5rem 1.25rem', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
            border: '1px solid rgba(255,255,255,0.35)', color: TEXT, borderRadius: 999,
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          Contact Us
        </Link>

        {/* Book a Consultation */}
        <a ref={consultationRef} href="/#consultation"
          style={{
            backgroundColor: '#ffffff', color: '#0A0C12', fontWeight: 700,
            fontSize: '0.875rem', padding: '0.5rem 1.25rem',
            borderRadius: 999, textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            whiteSpace: 'nowrap', transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          Book a Consultation
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0A0C12" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </a>
      </nav>

      {/* ── Mobile header ── */}
      <div className="md:hidden" style={{ position: 'fixed', top: 14, left: 0, right: 0, zIndex: 50, alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        {/* Mobile logo */}
        <motion.div
          animate={{ opacity: scrolled ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          style={{ pointerEvents: scrolled ? 'none' : 'all' }}
        >
          <Link href="/">
            <Image src="/logo-icon.png" alt="UF" width={36} height={36} style={{ height: 36, width: 'auto' }} priority />
          </Link>
        </motion.div>

        {/* Hamburger pill */}
        <div style={{
          backgroundColor: 'rgba(12,14,20,0.95)', backdropFilter: 'blur(24px)',
          borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)',
          padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          {scrolled && (
            <Link href="/" style={{ display: 'flex', alignItems: 'center', marginRight: 4 }}>
              <Image src="/logo-icon.png" alt="UF" width={24} height={24} style={{ height: 24, width: 'auto' }} />
            </Link>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 22, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ display: 'block', height: 2, background: TEXT, borderRadius: 2, transition: 'transform 0.2s', transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
              <span style={{ display: 'block', height: 2, background: TEXT, borderRadius: 2, opacity: mobileOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
              <span style={{ display: 'block', height: 2, background: TEXT, borderRadius: 2, transition: 'transform 0.2s', transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
            </div>
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 76, left: 16, right: 16, zIndex: 49,
          backgroundColor: 'rgba(10,12,18,0.98)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 20, border: '1px solid rgba(30,168,212,0.15)',
          padding: '1.25rem 1.5rem 1.5rem',
          boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
        }}>
          <p style={{ color: MUTED, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Solutions</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
            {SOLUTIONS.map((s) => (
              <Link key={s.href} href={s.href} onClick={() => setMobileOpen(false)}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', padding: '0.625rem 0.75rem', borderRadius: 12, textDecoration: 'none', backgroundColor: 'rgba(30,168,212,0.04)', border: '1px solid rgba(30,168,212,0.12)' }}>
                <span style={{ color: TEXT, fontSize: '0.9rem', fontWeight: 600 }}>{s.label}</span>
                <span style={{ color: MUTED, fontSize: '0.75rem' }}>{s.desc}</span>
              </Link>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                onClick={link.anchor
                  ? (e) => { e.preventDefault(); setMobileOpen(false); scrollTo(link.anchor!) }
                  : () => setMobileOpen(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', color: TEXT, fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.95rem' }}>
                {link.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </Link>
            ))}
            <Link href="/login" onClick={() => setMobileOpen(false)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', color: TEXT, fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.95rem' }}>
              Portal
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" /></svg>
            </Link>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <Link href="/#consultation" onClick={() => setMobileOpen(false)}
              style={{ textAlign: 'center', padding: '0.875rem', borderRadius: 999, backgroundColor: '#ffffff', color: '#0A0C12', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
              Book a Consultation
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)}
              style={{ textAlign: 'center', padding: '0.75rem', borderRadius: 999, border: '1px solid rgba(255,255,255,0.35)', color: TEXT, fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
