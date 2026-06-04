'use client'

import { PhotoGallery, PhotoItem } from '@/components/ui/gallery'

const FINANCE_PHOTOS: PhotoItem[] = [
  {
    id: 1, order: 0,
    x: '-320px', y: '15px',
    zIndex: 50, direction: 'left',
    src: '/images/03_financial_city_skyline.jpg',
    alt: 'Financial district',
  },
  {
    id: 2, order: 1,
    x: '-160px', y: '32px',
    zIndex: 40, direction: 'left',
    src: '/images/05_speed_light_trails.jpg',
    alt: 'Global markets',
  },
  {
    id: 3, order: 2,
    x: '0px', y: '8px',
    zIndex: 30, direction: 'right',
    src: '/images/07_digital_payment_network.jpg',
    alt: 'Trading floor',
    label: 'Global Markets',
    sub: '150+ institutions',
  },
  {
    id: 4, order: 3,
    x: '160px', y: '22px',
    zIndex: 20, direction: 'right',
    src: '/images/11_corporate_towers_dark.jpg',
    alt: 'Business meeting',
  },
  {
    id: 5, order: 4,
    x: '320px', y: '44px',
    zIndex: 10, direction: 'left',
    src: '/images/12_world_network_map_dark.jpg',
    alt: 'Financial data',
  },
]

export default function GlobalNetwork() {
  return (
    <section style={{ backgroundColor: '#0E1118', padding: '6rem 1.5rem', overflow: 'hidden' }}>
      <div className="max-w-7xl mx-auto">
        <PhotoGallery
          animationDelay={0.3}
          photos={FINANCE_PHOTOS}
          eyebrow="Our Reach"
          heading="Connected Across"
          headingAccent="30+ Countries."
          body="Strategic relationships with acquiring banks, card networks, and payment processors spanning 150+ financial institutions worldwide."
          hideCta={true}
        />
      </div>
    </section>
  )
}
