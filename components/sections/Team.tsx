'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const TEAM = [
  {
    name: 'Michael Torres',
    role: 'CEO & Co-Founder',
    bio: 'Former VP at a top-5 global acquiring bank. 20 years building payment infrastructure across EMEA, APAC, and the Americas.',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    linkedin: '#',
  },
  {
    name: 'Sarah Chen',
    role: 'Chief Risk Officer',
    bio: 'Expert in cross-border compliance, chargeback management, and high-risk merchant underwriting with Visa and Mastercard networks.',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    linkedin: '#',
  },
  {
    name: 'David Okafor',
    role: 'Head of Global Partnerships',
    bio: 'Spent 15 years at global payment networks cultivating relationships with 150+ financial institutions across 30+ countries.',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    linkedin: '#',
  },
  {
    name: 'Emma Larsson',
    role: 'Head of Embedded Finance',
    bio: 'Architect of embedded banking solutions for platforms processing $2B+ annually. Specialist in BaaS and card issuing.',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    linkedin: '#',
  },
]

export default function Team() {
  return (
    <section id="team" style={{ backgroundColor: '#1a1a1a', padding: '6rem 1.5rem' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <p style={{ color: '#2BB8E6', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Our Team
          </p>
          <h2
            style={{ fontWeight: 800, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.02em', color: '#E8EDF2' }}
          >
            The people behind the{' '}
            <span style={{ color: '#2BB8E6', fontStyle: 'italic' }}>network.</span>
          </h2>
          <p style={{ color: '#7E8794', fontSize: '1rem', lineHeight: 1.75, maxWidth: 520, margin: '1.25rem auto 0' }}>
            Decades of combined experience building financial infrastructure, acquiring relationships, and risk frameworks at the highest levels.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                backgroundColor: '#141C28',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.08)',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(43,184,230,0.15)' }}
            >
              <div style={{ position: 'relative', width: '100%', height: 220 }}>
                <Image
                  src={member.avatar}
                  alt={member.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <p style={{ color: '#E8EDF2', fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
                  {member.name}
                </p>
                <p style={{ color: '#2BB8E6', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '0.875rem', textTransform: 'uppercase' }}>
                  {member.role}
                </p>
                <p style={{ color: '#7E8794', fontSize: '0.85rem', lineHeight: 1.65 }}>
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
