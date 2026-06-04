import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import StatsBar from '@/components/sections/StatsBar'
import ServicesGrid from '@/components/sections/ServicesGrid'
import WhyUs from '@/components/sections/WhyUs'
import IdealClient from '@/components/sections/IdealClient'
import Testimonials from '@/components/sections/Testimonials'
import BookCall from '@/components/sections/BookCall'
import Footer from '@/components/sections/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0C12] text-[#E8EDF2]">
      <Navbar />
      <Hero />
      <StatsBar />
      <ServicesGrid />
      <WhyUs />
      <IdealClient />
      <Testimonials />
      <BookCall />
      <Footer />
    </main>
  )
}
