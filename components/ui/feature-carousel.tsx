"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign, CreditCard, Shield, BarChart2, Users, Globe,
  Zap, Lock, Clock, FileText, Star, MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Each entry maps to a real /public/screenshots/ file — update paths for UF screens
const FEATURES = [
  {
    id: "payments",
    label: "Payment Processing",
    icon: DollarSign,
    screenshot: "/screenshots/payments.png",
    bg: "/images/bg-payments.jpg",
    description: "Seamless payment processing across all major card networks. Real-time settlement and transparent fee structures.",
  },
  {
    id: "merchant-portal",
    label: "Merchant Portal",
    icon: CreditCard,
    screenshot: "/screenshots/merchant-portal.png",
    bg: "/images/bg-merchant.jpg",
    description: "Full-featured merchant management dashboard. Track transactions, manage disputes, and monitor residuals in one place.",
  },
  {
    id: "risk",
    label: "Risk Management",
    icon: Shield,
    screenshot: "/screenshots/risk.png",
    bg: "/images/bg-risk.jpg",
    description: "Advanced risk scoring and underwriting tools. Automated flagging with customizable thresholds per portfolio.",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart2,
    screenshot: "/screenshots/analytics.png",
    bg: "/images/bg-analytics.jpg",
    description: "Deep analytics across processing volume, residuals, and approval rates. Exportable reports and live dashboards.",
  },
  {
    id: "partners",
    label: "Partner Network",
    icon: Users,
    screenshot: "/screenshots/partners.png",
    bg: "/images/bg-partners.jpg",
    description: "Manage processor relationships, bank partners, and lenders. Track residual splits and agreements end-to-end.",
  },
  {
    id: "global",
    label: "Global Coverage",
    icon: Globe,
    screenshot: "/screenshots/global.png",
    bg: "/images/bg-global.jpg",
    description: "Support for international merchants across 50+ countries. Multi-currency settlement and local compliance built in.",
  },
  {
    id: "instant",
    label: "Instant Onboarding",
    icon: Zap,
    screenshot: "/screenshots/onboarding.png",
    bg: "/images/bg-onboarding.jpg",
    description: "Digital merchant applications with automated underwriting. Go from lead to live in days, not weeks.",
  },
  {
    id: "compliance",
    label: "PCI Compliance",
    icon: Lock,
    screenshot: "/screenshots/compliance.png",
    bg: "/images/bg-compliance.jpg",
    description: "PCI DSS Level 1 certified infrastructure. End-to-end encryption, tokenization, and fraud prevention.",
  },
  {
    id: "scheduling",
    label: "Residual Scheduling",
    icon: Clock,
    screenshot: "/screenshots/residuals.png",
    bg: "/images/bg-residuals.jpg",
    description: "Automated residual calculations by period. Split payments to reps and partners with full audit trails.",
  },
  {
    id: "agreements",
    label: "Agreements",
    icon: FileText,
    screenshot: "/screenshots/agreements.png",
    bg: "/images/bg-agreements.jpg",
    description: "Digital agreement generation and e-signature. Track status from draft through signed and live.",
  },
  {
    id: "commissions",
    label: "Commission Tracking",
    icon: Star,
    screenshot: "/screenshots/commissions.png",
    bg: "/images/bg-commissions.jpg",
    description: "Track rep commissions per merchant and period. Bonus structures, pending vs paid — all in one view.",
  },
  {
    id: "consultations",
    label: "Lead Intake",
    icon: MessageCircle,
    screenshot: "/screenshots/consultations.png",
    bg: "/images/bg-consultations.jpg",
    description: "Capture consultation requests directly from your site. Automated pipeline routing to the right rep.",
  },
];

const AUTO_PLAY_INTERVAL = 3400;
const ITEM_HEIGHT = 62;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function FeatureCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex = ((step % FEATURES.length) + FEATURES.length) % FEATURES.length;
  const nextStep = useCallback(() => setStep((prev) => prev + 1), []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + FEATURES.length) % FEATURES.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = FEATURES.length;
    let d = diff;
    if (diff > len / 2) d -= len;
    if (diff < -len / 2) d += len;
    if (d === 0) return "active";
    if (d === -1) return "prev";
    if (d === 1) return "next";
    return "hidden";
  };

  const activeFeature = FEATURES[currentIndex];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div
        className="relative overflow-hidden flex flex-col lg:flex-row border"
        style={{
          borderRadius: "2.5rem",
          minHeight: 600,
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        {/* Left: scrolling feature list */}
        <div
          className="w-full lg:w-[37%] relative z-30 flex flex-col items-start justify-center overflow-hidden px-8 md:px-12 lg:pl-12"
          style={{ backgroundColor: "#0A0C12", minHeight: 340 }}
        >
          <div className="absolute inset-x-0 top-0 h-20 z-40 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, #0A0C12 0%, transparent 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 h-20 z-40 pointer-events-none"
            style={{ background: "linear-gradient(to top, #0A0C12 0%, transparent 100%)" }} />

          <div className="relative w-full flex items-center justify-start z-20" style={{ height: 400 }}>
            {FEATURES.map((feature, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;
              const wrappedDistance = wrap(-(FEATURES.length / 2), FEATURES.length / 2, distance);
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.id}
                  style={{ height: ITEM_HEIGHT, width: "max-content" }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.2,
                  }}
                  transition={{ type: "spring", stiffness: 90, damping: 22, mass: 1 }}
                  className="absolute flex items-center"
                >
                  <button
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "flex items-center gap-3 px-5 md:px-6 py-3 rounded-full border transition-all duration-500 text-sm tracking-tight whitespace-nowrap uppercase font-semibold",
                      isActive
                        ? "z-10"
                        : "bg-transparent border-white/10 text-white/40 hover:border-white/25 hover:text-white/65"
                    )}
                    style={isActive ? {
                      backgroundColor: "#1EA8D4",
                      borderColor: "#1EA8D4",
                      color: "#0A0C12",
                    } : {}}
                  >
                    <Icon size={15} strokeWidth={2.2} className="flex-shrink-0" />
                    {feature.label}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right: screenshot on blurred background */}
        <div
          className="flex-1 relative flex items-center justify-center border-t lg:border-t-0 lg:border-l overflow-hidden"
          style={{ borderColor: "rgba(255,255,255,0.05)", minHeight: 600 }}
        >
          {/* Blurred background — cross-fades per feature */}
          <AnimatePresence mode="sync">
            <motion.div
              key={activeFeature.bg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <Image
                src={activeFeature.bg}
                alt=""
                fill
                style={{ objectFit: "cover", filter: "blur(28px) saturate(1.5)", transform: "scale(1.15)" }}
              />
              <div className="absolute inset-0" style={{ background: "rgba(10,12,18,0.55)" }} />
            </motion.div>
          </AnimatePresence>

          {/* Vignette edges */}
          <div className="absolute inset-0 z-10 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(10,12,18,0.75) 100%)" }} />

          {/* Phone/screen cards */}
          <div className="relative z-20 w-full h-full" style={{ minHeight: 600 }}>
            {FEATURES.map((feature, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? "-38%" : isNext ? "38%" : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.8 : 0.65,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.28 : 0,
                    rotate: isPrev ? -5 : isNext ? 5 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.85 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* Screen frame */}
                  <div style={{
                    position: "relative",
                    borderRadius: 44,
                    padding: 9,
                    background: "linear-gradient(145deg, #333 0%, #1a1a1a 100%)",
                    boxShadow: isActive
                      ? "0 40px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.1), 0 0 60px rgba(30,168,212,0.18)"
                      : "0 20px 50px rgba(0,0,0,0.6)",
                    transition: "box-shadow 0.5s ease",
                  }}>
                    <div style={{ borderRadius: 36, overflow: "hidden", width: 210, height: 454 }}>
                      <Image
                        src={feature.screenshot}
                        alt={feature.label}
                        width={210}
                        height={454}
                        style={{ objectFit: "cover", objectPosition: "top", display: "block" }}
                      />
                    </div>
                  </div>

                  {/* Caption below — only when active */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        style={{
                          position: "absolute",
                          bottom: 28,
                          left: 32,
                          right: 32,
                          textAlign: "center",
                          zIndex: 30,
                        }}
                      >
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: "0.4rem",
                          padding: "0.25rem 0.875rem",
                          backgroundColor: "rgba(30,168,212,0.18)",
                          border: "1px solid rgba(30,168,212,0.35)",
                          borderRadius: 999,
                          marginBottom: "0.5rem",
                          backdropFilter: "blur(12px)",
                        }}>
                          <Icon size={11} strokeWidth={2.5} color="#1EA8D4" />
                          <span style={{ color: "#1EA8D4", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            {feature.label}
                          </span>
                        </div>
                        <p style={{
                          color: "rgba(240,237,232,0.92)",
                          fontSize: "0.875rem",
                          lineHeight: 1.55,
                          fontWeight: 500,
                          textShadow: "0 1px 12px rgba(0,0,0,0.95)",
                          maxWidth: 340,
                          margin: "0 auto",
                        }}>
                          {feature.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureCarousel;
