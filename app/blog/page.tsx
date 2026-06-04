'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'

const POSTS = [
  {
    id: 'high-risk-merchant-processing-guide',
    title: 'What Is High-Risk Merchant Processing? A Complete Guide',
    excerpt:
      'High-risk merchant accounts unlock acquiring relationships that mainstream banks refuse — giving global eCommerce businesses stable payment rails across difficult verticals. Learn how underwriting criteria, reserve structures, and processor selection actually work when your business is labelled high-risk.',
    category: 'Merchant Processing',
    image: '/images/09_modular_fintech_blocks.jpg',
    href: '/blog/high-risk-merchant-processing-guide',
  },
  {
    id: 'embedded-finance-ecommerce',
    title: 'How Embedded Finance Is Transforming eCommerce Platforms',
    excerpt:
      'Platforms that embed financial services — lending, card issuing, and treasury — directly into their checkout flows are capturing a larger share of transaction economics while delivering a frictionless buyer experience. Discover the infrastructure stack making it possible in 2025.',
    category: 'Embedded Finance',
    image: '/images/07_digital_payment_network.jpg',
    href: '/blog/embedded-finance-ecommerce',
  },
  {
    id: 'chargeback-prevention-strategies',
    title: 'Chargeback Prevention Strategies That Actually Work in 2025',
    excerpt:
      'Rising dispute rates threaten merchant accounts and erode margins — but the right combination of multi-processor routing, real-time alerts, and compelling evidence packages can drive chargeback ratios below 0.5%. Here is what high-volume merchants are doing differently.',
    category: 'Risk Mitigation',
    image: '/images/10_market_chart_abstract.jpg',
    href: '/blog/chargeback-prevention-strategies',
  },
  {
    id: 'acquiring-bank-relationships',
    title: 'Acquiring Bank Relationships: Why They Matter for Global Scale',
    excerpt:
      'Having a single acquiring partner is a single point of failure. The merchants scaling past $50M annually maintain relationships with three or more acquirers across different jurisdictions, ensuring redundancy, competitive interchange, and geographic coverage when it matters most.',
    category: 'Payments',
    image: '/images/03_financial_city_skyline.jpg',
    href: '/blog/acquiring-bank-relationships',
  },
  {
    id: 'baas-vs-full-banking-license',
    title: 'BaaS vs. Full Banking License: What eCommerce Businesses Need to Know',
    excerpt:
      'Banking-as-a-Service lets platforms offer financial products in weeks rather than years, but full licensing unlocks capabilities — and margins — that BaaS providers cannot match. Understanding the trade-offs determines your embedded finance roadmap for the next five years.',
    category: 'Embedded Finance',
    image: '/images/08_data_particle_landscape.jpg',
    href: '/blog/baas-vs-full-banking-license',
  },
  {
    id: 'payment-processing-high-risk-verticals',
    title: 'Payment Processing for High-Risk Verticals: Getting Approved and Staying Stable',
    excerpt:
      'Approval is only the beginning — maintaining a merchant account in high-risk verticals like nutraceuticals, travel, and subscription billing requires ongoing compliance, proactive reserve management, and a broker relationship that advocates for you when disputes arise.',
    category: 'Merchant Processing',
    image: '/images/05_speed_light_trails.jpg',
    href: '/blog/payment-processing-high-risk-verticals',
  },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#0E1118]" style={{ backgroundColor: '#0E1118', color: '#E8EDF2' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ backgroundColor: '#0B0F1A', padding: '9rem 1.5rem 5rem' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p style={{
              color: '#2BB8E6',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}>
              Blog
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                letterSpacing: '0.01em',
                textTransform: 'uppercase',
                lineHeight: 1.1,
                marginBottom: '1.5rem',
                color: '#E8EDF2',
              }}
            >
              Insights &amp; Resources
            </h1>
            <p style={{
              color: '#7E8794',
              fontSize: '1.0625rem',
              lineHeight: 1.75,
              maxWidth: '42rem',
              margin: '0 auto',
            }}>
              Perspectives on global payments, high-risk merchant acquiring, embedded finance, and the infrastructure powering cross-border commerce.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section style={{ backgroundColor: '#0E1118', padding: '5rem 1.5rem 7rem' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {POSTS.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{
                  backgroundColor: '#141C28',
                  borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
              >
                {/* Cover image */}
                <div style={{ position: 'relative', width: '100%', height: 200 }}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* Card body */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Category tag */}
                  <span style={{
                    display: 'inline-block',
                    color: '#2BB8E6',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem',
                  }}>
                    {post.category}
                  </span>

                  {/* Title */}
                  <h2 style={{
                    color: '#E8EDF2',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    lineHeight: 1.45,
                    marginBottom: '0.75rem',
                  }}>
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p style={{
                    color: '#7E8794',
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    flex: 1,
                    marginBottom: '1.25rem',
                  }}>
                    {post.excerpt}
                  </p>

                  {/* Read More */}
                  <Link
                    href={post.href}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      color: '#2BB8E6',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textDecoration: 'none',
                      textTransform: 'uppercase',
                    }}
                  >
                    Read More →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
