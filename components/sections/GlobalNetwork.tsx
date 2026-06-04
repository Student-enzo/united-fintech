'use client'

import { PhotoGallery, PhotoItem } from '@/components/ui/gallery'

const FINANCE_PHOTOS: PhotoItem[] = [
  {
    id: 1, order: 0,
    x: '-320px', y: '15px',
    zIndex: 50, direction: 'left',
    src: '/payments-paris.png',
    alt: 'Contactless payment at a Paris café',
  },
  {
    id: 2, order: 1,
    x: '-160px', y: '32px',
    zIndex: 40, direction: 'left',
    src: '/payments-cafe.png',
    alt: 'Card payment at a modern coffee shop',
  },
  {
    id: 3, order: 2,
    x: '0px', y: '8px',
    zIndex: 30, direction: 'right',
    src: '/payments-middleeast.png',
    alt: 'Payment transaction in the Middle East',
    label: 'Global Reach',
    sub: '30+ countries',
  },
  {
    id: 4, order: 3,
    x: '160px', y: '22px',
    zIndex: 20, direction: 'right',
    src: '/payments-mexico.png',
    alt: 'Card payment at a Mexican street market',
  },
  {
    id: 5, order: 4,
    x: '320px', y: '44px',
    zIndex: 10, direction: 'left',
    src: '/payments-japan.png',
    alt: 'Contactless payment at a Japanese ramen bar',
  },
]

export default function GlobalNetwork() {
  return (
    <section style={{ backgroundColor: '#161616', padding: '6rem 1.5rem', overflow: 'visible' }}>
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
