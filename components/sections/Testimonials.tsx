"use client"

import Image from "next/image"
import {
  ContainerScroll,
  CardsContainer,
  CardTransformed,
} from "@/components/blocks/animated-cards-stack"

const TESTIMONIALS = [
  {
    id: "t1",
    name: "Alex Mercer",
    role: "CEO, Global Commerce Group",
    region: "EU & APAC · 2025",
    quote:
      "United Fintech opened doors we had been knocking on for years. Within 60 days we had three new acquiring relationships — and a processing stack that actually makes sense for our volume.",
    initials: "AM",
    color: "#2BB8E6",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: "t2",
    name: "Jordan Blake",
    role: "CFO, eCommerce Platform",
    region: "Global · 2025",
    quote:
      "After our previous processor terminated our account without notice, United Fintech stepped in and built us a redundant solution in record time. Their network made the difference.",
    initials: "JB",
    color: "#46D4F2",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: "t3",
    name: "Sam Rivera",
    role: "COO, Digital Marketplace",
    region: "Americas · 2025",
    quote:
      "What sets them apart is that they stay involved. Most brokers disappear after the deal. United Fintech treats you like a long-term partner — still optimizing our costs 18 months later.",
    initials: "SR",
    color: "#0E8FB8",
    avatar:
      "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
]

export default function Testimonials() {
  return (
    <section style={{ backgroundColor: "#0A0C12" }}>
      {/* Sticky header */}
      <div
        style={{
          padding: "5rem 1.5rem 0",
          textAlign: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "#0A0C12",
          paddingBottom: "2rem",
        }}
      >
        <p
          style={{
            color: "#2BB8E6",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          CLIENT STORIES
        </p>
        <h2
          style={{
            fontFamily: "var(--font-outfit)",
            fontWeight: 200,
            fontSize: "clamp(1.875rem, 4vw, 3rem)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
          className="chrome-text"
        >
          Trusted by Global Merchants
        </h2>
      </div>

      {/* Scroll-stacked cards */}
      <ContainerScroll className="h-[300vh]">
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CardsContainer
            style={{
              width: 440,
              height: 360,
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <CardTransformed
                key={t.id}
                arrayLength={TESTIMONIALS.length + 2}
                index={i}
                variant="dark"
              >
                {/* UF badge */}
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    backgroundColor: "rgba(43,184,230,0.12)",
                    border: "1px solid rgba(43,184,230,0.3)",
                    borderRadius: 9999,
                    padding: "2px 10px",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    color: "#2BB8E6",
                  }}
                >
                  UF
                </div>

                {/* Quote */}
                <p
                  style={{
                    fontStyle: "italic",
                    color: "rgba(232,237,242,0.9)",
                    fontSize: "0.9rem",
                    lineHeight: 1.65,
                    textAlign: "center",
                    flexGrow: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Avatar row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 4,
                  }}
                >
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={44}
                    height={44}
                    style={{
                      borderRadius: "9999px",
                      objectFit: "cover",
                      border: `2px solid ${t.color}`,
                    }}
                    unoptimized
                  />
                  <div style={{ textAlign: "left" }}>
                    <p
                      style={{
                        fontWeight: 700,
                        color: "#E8EDF2",
                        fontSize: "0.85rem",
                        lineHeight: 1.2,
                      }}
                    >
                      {t.name}
                    </p>
                    <p
                      style={{
                        color: "#7E8794",
                        fontSize: "0.75rem",
                        lineHeight: 1.3,
                      }}
                    >
                      {t.role}
                    </p>
                    <p
                      style={{
                        color: "#2BB8E6",
                        fontSize: "0.65rem",
                        letterSpacing: "0.08em",
                        marginTop: 2,
                      }}
                    >
                      {t.region}
                    </p>
                  </div>
                </div>
              </CardTransformed>
            ))}
          </CardsContainer>
        </div>
      </ContainerScroll>
    </section>
  )
}
