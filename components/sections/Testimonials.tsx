// TODO: Replace placeholder testimonial data with real client quotes before launch.
// Image paths reference /public/testimonials/ — add real headshots or use abstract placeholders.

import CircularTestimonials from '@/components/ui/circular-testimonials'

const TESTIMONIALS = [
  {
    quote:
      'United Fintech opened doors we had been knocking on for years. Within 60 days we had three new acquiring relationships across EU and APAC — and a processing stack that actually makes sense for our volume.',
    name: 'Alex Mercer',
    designation: 'CEO, Global Commerce Group — placeholder',
    src: '/testimonials/placeholder-1.jpg',
  },
  {
    quote:
      'After our previous processor terminated our account without notice, United Fintech stepped in and built us a redundant solution in record time. Their network and advisory made the difference between shutdown and scale.',
    name: 'Jordan Blake',
    designation: 'CFO, eCommerce Platform — placeholder',
    src: '/testimonials/placeholder-2.jpg',
  },
  {
    quote:
      'What sets them apart is that they stay involved. Most brokers disappear after the deal. United Fintech treats you like a long-term partner — they\'re still optimizing our processing costs 18 months later.',
    name: 'Sam Rivera',
    designation: 'COO, Digital Marketplace — placeholder',
    src: '/testimonials/placeholder-3.jpg',
  },
]

export default function Testimonials() {
  return (
    <section style={{ backgroundColor: '#0A0C12', padding: '6rem 1.5rem' }}>
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ color: '#2BB8E6', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Client Stories
          </p>
          <h2 style={{
            fontFamily: 'var(--font-outfit)', fontWeight: 200,
            fontSize: 'clamp(1.875rem, 4vw, 3rem)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }} className="chrome-text">
            Trusted by Global Merchants
          </h2>
        </div>

        {/* Carousel */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CircularTestimonials testimonials={TESTIMONIALS} autoplay />
        </div>
      </div>
    </section>
  )
}
