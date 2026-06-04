import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import BookCall from '@/components/sections/BookCall'
import { FocusRail, FocusRailItem } from '@/components/ui/focus-rail'

const POSTS: FocusRailItem[] = [
  {
    id: 'merchant-high-risk',
    title: 'High-Risk Merchant Accounts: What Banks Won\'t Tell You',
    description: 'The hidden criteria banks use to evaluate high-risk applications, and how to position your business for approval across 30+ countries.',
    imageSrc: '/uf-chart.jpg',
    meta: 'Merchant Processing',
    href: '/blog/merchant-high-risk',
  },
  {
    id: 'embedded-finance-guide',
    title: 'Embedded Finance in 2025: The Complete Infrastructure Guide',
    description: 'From BaaS relationships to card issuing — a practitioner\'s guide to embedding financial services into your platform without regulatory headaches.',
    imageSrc: '/uf-data-wave.jpg',
    meta: 'Embedded Finance',
    href: '/blog/embedded-finance-guide',
  },
  {
    id: 'chargeback-reduction',
    title: 'Reducing Chargebacks: The Multi-Processor Strategy',
    description: 'How redundant acquiring relationships and smart routing rules can reduce chargeback rates by up to 40% for high-volume eCommerce.',
    imageSrc: '/uf-corridor.jpg',
    meta: 'Risk Mitigation',
    href: '/blog/chargeback-reduction',
  },
  {
    id: 'global-acquiring',
    title: 'The Global Acquiring Landscape: 2025 Market Map',
    description: 'Which regions offer the best acquiring conditions for cross-border merchants, and where mainstream processors leave you exposed.',
    imageSrc: '/uf-hero-bg.jpg',
    meta: 'Global Markets',
    href: '/blog/global-acquiring',
  },
  {
    id: 'payment-stack',
    title: 'Building a Resilient Payment Stack for Scale',
    description: 'The architecture decisions that separate payment operations that survive growth from those that collapse under it.',
    imageSrc: '/uf-towers.jpg',
    meta: 'Infrastructure',
    href: '/blog/payment-stack',
  },
  {
    id: 'reserve-negotiation',
    title: 'Rolling Reserves: How to Negotiate Better Terms',
    description: 'Reserve percentages, release schedules, and the negotiating leverage most merchants don\'t know they have.',
    imageSrc: '/uf-handshake.jpg',
    meta: 'Strategy',
    href: '/blog/reserve-negotiation',
  },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#0A0C12] text-[#E8EDF2]">
      <Navbar />

      {/* Hero */}
      <section style={{ backgroundColor: '#0D1B2A', padding: '9rem 1.5rem 5rem' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p style={{
            color: '#2BB8E6',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
          }}>
            INSIGHTS
          </p>
          <h1
            className="chrome-text"
            style={{
              fontFamily: 'var(--font-outfit)',
              fontWeight: 200,
              fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
            }}
          >
            The United Fintech Blog
          </h1>
          <p style={{
            color: '#7E8794',
            fontSize: '1.0625rem',
            lineHeight: 1.75,
            maxWidth: '42rem',
            margin: '0 auto',
          }}>
            Perspectives on global payments, merchant acquiring, and financial infrastructure.
          </p>
        </div>
      </section>

      {/* FocusRail */}
      <section style={{ backgroundColor: '#0A0C12', padding: '4rem 1.5rem 6rem' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <FocusRail
            items={POSTS}
            autoPlay={true}
            interval={6000}
            className="rounded-2xl overflow-hidden"
          />
        </div>
      </section>

      <BookCall />
      <Footer />
    </main>
  )
}
