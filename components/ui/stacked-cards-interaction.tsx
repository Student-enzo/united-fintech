"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const CYAN  = "#2BB8E6";
const TEXT  = "#f0ede8";
const MUTED = "#8a8070";
const CARD_BG = "#141821";
const BORDER  = "rgba(255,255,255,0.09)";

const UFCard = ({
  className,
  image,
  children,
}: {
  className?: string;
  image?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn("w-[400px] cursor-pointer h-[520px] overflow-hidden rounded-2xl", className)}
      style={{
        backgroundColor: CARD_BG,
        border: `1px solid ${BORDER}`,
        boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
      }}
    >
      {image && (
        <div className="relative overflow-hidden w-full" style={{ height: 360 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="card" className="object-cover w-full h-full" style={{ display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 55%, rgba(20,24,33,0.85) 100%)" }} />
        </div>
      )}
      {children && (
        <div style={{ padding: "1.25rem" }}>{children}</div>
      )}
    </div>
  );
};

export interface CardData {
  image: string;
  name: string;
  sub: string;
  from: string;
  time: string;
  href: string;
}

export const StackedCardsInteraction = ({
  cards,
  spreadDistance = 52,
  rotationAngle = 7,
  animationDelay = 0.08,
}: {
  cards: CardData[];
  spreadDistance?: number;
  rotationAngle?: number;
  animationDelay?: number;
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const limited = cards.slice(0, 3);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[400px] h-[520px]">
        {limited.map((card, index) => {
          const isFirst = index === 0;
          let xOffset = 0;
          let rotation = 0;

          if (limited.length > 1) {
            if (index === 1) { xOffset = -spreadDistance; rotation = -rotationAngle; }
            else if (index === 2) { xOffset = spreadDistance; rotation = rotationAngle; }
          }

          return (
            <motion.div
              key={index}
              className={cn("absolute", isFirst ? "z-10" : "z-0")}
              initial={{ x: 0, rotate: 0 }}
              animate={{
                x: isHovering ? xOffset : 0,
                rotate: isHovering ? rotation : 0,
                zIndex: isFirst ? 10 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut", delay: index * animationDelay, type: "spring" }}
              {...(isFirst && {
                onHoverStart: () => setIsHovering(true),
                onHoverEnd: () => setIsHovering(false),
              })}
            >
              <UFCard
                className={isFirst ? "z-10 cursor-pointer" : "z-0"}
                image={card.image}
              >
                <p style={{ color: "rgba(43,184,230,0.75)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: "0.3rem" }}>
                  {card.sub}
                </p>
                <p style={{ color: TEXT, fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.01em", lineHeight: 1.25, marginBottom: "1rem" }}>
                  {card.name}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ color: CYAN, fontWeight: 700, fontSize: "0.95rem" }}>{card.from}</span>
                    <span style={{ color: MUTED, fontSize: "0.78rem", marginLeft: "0.4rem" }}>· {card.time}</span>
                  </div>
                  <Link
                    href={card.href}
                    onClick={e => e.stopPropagation()}
                    style={{
                      backgroundColor: CYAN, color: "#0A0C12",
                      borderRadius: 999, padding: "0.4rem 0.9rem",
                      fontSize: "0.78rem", fontWeight: 700, textDecoration: "none",
                    }}
                  >
                    View
                  </Link>
                </div>
              </UFCard>
            </motion.div>
          );
        })}
      </div>

      {/* Hover hint */}
      <p style={{
        position: "absolute", bottom: -32, left: "50%", transform: "translateX(-50%)",
        color: MUTED, fontSize: "0.72rem", letterSpacing: "0.06em", whiteSpace: "nowrap",
        transition: "opacity 0.3s",
        opacity: isHovering ? 0 : 0.6,
      }}>
        Hover to explore
      </p>
    </div>
  );
};
