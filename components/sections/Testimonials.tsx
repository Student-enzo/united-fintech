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
    avatar:
      "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
]

const CARD_STYLE: React.CSSProperties = {
  background: "linear-gradient(160deg, #141c2e 0%, #0d1117 60%, #0a0f1a 100%)",
  border: "1px solid rgba(30,168,212,0.18)",
  boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset, 0 24px 48px rgba(0,0,0,0.5)",
}

export default function Testimonials() {
  return (
    <section id="insights" style={{ backgroundColor: "#161616" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 1.5rem 0", textAlign: "center" }}>
        <p style={{ color: "#1EA8D4", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          CLIENT STORIES
        </p>
        <h2 style={{ fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.5rem)", letterSpacing: "-0.02em", color: "#E8EDF2", marginBottom: "0.75rem" }}>
          Trusted by global{" "}
          <span style={{ color: "#1EA8D4", fontStyle: "italic" }}>merchants.</span>
        </h2>
        <p style={{ color: "rgba(232,237,242,0.5)", fontSize: "1rem", maxWidth: 440, margin: "0 auto" }}>
          What our clients say after working with United Fintech.
        </p>
      </div>

      <ContainerScroll className="h-[300vh]">
        <div className="sticky left-0 top-0 h-svh w-full flex items-center justify-center py-12">
          <CardsContainer className="size-full h-[460px] w-[370px] mx-auto">
            {TESTIMONIALS.map((t, i) => (
              <CardTransformed
                key={t.id}
                arrayLength={TESTIMONIALS.length}
                index={i + 2}
                variant="dark"
                style={{ ...CARD_STYLE, position: "absolute", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
              >
                {/* Logo — large, top-right corner */}
                <div style={{ position: "absolute", top: 16, right: 16 }}>
                  <Image
                    src="/uf-logo-new.png"
                    alt="United Fintech"
                    width={80}
                    height={80}
                    style={{
                      objectFit: "contain",
                      filter: "drop-shadow(0 0 10px rgba(30,168,212,0.5)) brightness(1.05)",
                    }}
                  />
                </div>

                {/* Quote */}
                <div style={{ width: "100%", paddingRight: 64, paddingBottom: 16 }}>
                  <span style={{ fontSize: "2rem", lineHeight: 1, color: "#1EA8D4", opacity: 0.4, fontFamily: "Georgia, serif", display: "block", marginBottom: 8 }}>
                    &ldquo;
                  </span>
                  <p style={{
                    color: "rgba(232,237,242,0.88)",
                    fontSize: "0.9rem",
                    lineHeight: 1.75,
                    fontStyle: "italic",
                    margin: 0,
                  }}>
                    {t.quote}
                  </p>
                </div>

                {/* Separator */}
                <div style={{
                  width: "100%",
                  height: 1,
                  background: "linear-gradient(90deg, #1EA8D4 0%, rgba(30,168,212,0.08) 100%)",
                  marginBottom: 14,
                }} />

                {/* Author row */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{
                      width: 42, height: 42, borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #1EA8D4",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ textAlign: "left" }}>
                    <p style={{ fontWeight: 700, color: "#E8EDF2", fontSize: "0.88rem", lineHeight: 1.25, margin: 0 }}>{t.name}</p>
                    <p style={{ color: "rgba(232,237,242,0.45)", fontSize: "0.7rem", marginTop: 2 }}>{t.role}</p>
                    <p style={{ color: "#1EA8D4", fontSize: "0.63rem", letterSpacing: "0.08em", marginTop: 2 }}>{t.region}</p>
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
