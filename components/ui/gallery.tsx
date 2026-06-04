"use client";

import { Ref, forwardRef, useState, useEffect, useRef } from "react";
import Image, { ImageProps } from "next/image";
import { motion, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "left" | "right";

// Motion-wrapped Next.js Image (same pattern as original 21st.dev component)
const MotionImage = motion(
  forwardRef(function MotionImage(props: ImageProps, ref: Ref<HTMLImageElement>) {
    return <Image ref={ref} {...props} />;
  })
);

function getRandomNumberInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

const NASSAU_PHOTOS = [
  {
    id: 1, order: 0,
    x: "-320px", y: "15px",
    zIndex: 50, direction: "left" as Direction,
    src: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=520&h=520&fit=crop",
    alt: "Nassau from above",
  },
  {
    id: 2, order: 1,
    x: "-160px", y: "32px",
    zIndex: 40, direction: "left" as Direction,
    src: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=520&h=520&fit=crop",
    alt: "Bahamas crystal waters",
  },
  {
    id: 3, order: 2,
    x: "0px", y: "8px",
    zIndex: 30, direction: "right" as Direction,
    src: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=520&h=520&fit=crop",
    alt: "Palm beach Nassau",
    label: "Palm Beach",
    sub: "Nassau, Bahamas",
  },
  {
    id: 4, order: 3,
    x: "160px", y: "22px",
    zIndex: 20, direction: "right" as Direction,
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=520&h=520&fit=crop",
    alt: "Cable Beach white sands",
  },
  {
    id: 5, order: 4,
    x: "320px", y: "44px",
    zIndex: 10, direction: "left" as Direction,
    src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=520&h=520&fit=crop",
    alt: "Arriving in Nassau",
  },
];

// Animation variants — exact structure from original 21st.dev component
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const photoVariants = {
  hidden: () => ({ x: 0, y: 0, rotate: 0, scale: 1 }),
  visible: (custom: { x: string; y: string; order: number }) => ({
    x: custom.x,
    y: custom.y,
    rotate: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 70,
      damping: 12,
      mass: 1,
      delay: custom.order * 0.15,
    },
  }),
};

// Individual draggable photo — closely follows original Photo component
const Photo = ({
  src, alt, className, direction, width, height, label, sub,
}: {
  src: string; alt: string; className?: string;
  direction?: Direction; width: number; height: number;
  label?: string; sub?: string;
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const x = useMotionValue(width / 2);
  const y = useMotionValue(height / 2);

  useEffect(() => {
    const randomRotation = getRandomNumberInRange(1, 4) * (direction === "left" ? -1 : 1);
    setRotation(randomRotation);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleMouse(event: { currentTarget: { getBoundingClientRect: () => DOMRect }; clientX: number; clientY: number }) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  const resetMouse = () => {
    x.set(width / 2);
    y.set(height / 2);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.2, zIndex: 9999 }}
      whileHover={{ scale: 1.1, rotateZ: 2 * (direction === "left" ? -1 : 1), zIndex: 9999 }}
      whileDrag={{ scale: 1.1, zIndex: 9999 }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        width, height,
        perspective: 400,
        zIndex: 1,
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
      }}
      className={cn(className, "relative mx-auto shrink-0 cursor-grab active:cursor-grabbing")}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      draggable={false}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[20px]"
           style={{ boxShadow: "0 20px 56px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)" }}>
        <MotionImage
          className="object-cover"
          fill
          src={src}
          alt={alt}
          draggable={false}
          sizes="260px"
        />
        {/* Location label overlay */}
        {label && (
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 40%, transparent 65%)",
            borderRadius: 20,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0.875rem",
          }}>
            <p style={{
              color: "rgba(240,237,232,0.95)", fontWeight: 700, fontSize: "0.85rem",
              lineHeight: 1.2, letterSpacing: "-0.01em",
              textShadow: "0 1px 8px rgba(0,0,0,0.95), 0 2px 20px rgba(0,0,0,0.8)",
            }}>
              {label}
            </p>
            <p style={{
              color: "rgba(240,237,232,0.5)", fontSize: "0.65rem", marginTop: "0.2rem",
              textShadow: "0 1px 6px rgba(0,0,0,0.95)", letterSpacing: "0.04em",
            }}>
              {sub}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export interface PhotoItem {
  id: number;
  order: number;
  x: string;
  y: string;
  zIndex: number;
  direction: Direction;
  src: string;
  alt: string;
  label?: string;
  sub?: string;
}

export interface PhotoGalleryProps {
  animationDelay?: number;
  photos?: PhotoItem[];
  eyebrow?: string;
  heading?: string;
  headingAccent?: string;
  body?: string;
  hideCta?: boolean;
}

export function PhotoGallery({
  animationDelay = 0.5,
  photos,
  eyebrow,
  heading,
  headingAccent,
  body,
  hideCta = false,
}: PhotoGalleryProps) {
  const isNassauDefaults = !photos && !eyebrow && !heading && !headingAccent && !body;
  const displayPhotos = photos ?? NASSAU_PHOTOS;
  const displayEyebrow = eyebrow ?? "NASSAU, BAHAMAS";
  const displayHeading = heading ?? "Every destination.";
  const displayHeadingAccent = headingAccent ?? "One tap away.";
  const displayBody = body ?? "Airport pickups, resort hops, cruise port runs — flat fares, no surprises.";
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const visibilityTimer = setTimeout(() => setIsVisible(true), animationDelay * 1000);
          const animationTimer = setTimeout(() => setIsLoaded(true), (animationDelay + 0.4) * 1000);
          observer.disconnect();
          return () => { clearTimeout(visibilityTimer); clearTimeout(animationTimer); };
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animationDelay]);

  return (
    <div className="relative" ref={sectionRef}>
      {/* Subtle grid backdrop */}
      <div className="absolute inset-0 max-md:hidden top-[180px] -z-10 h-[340px] w-full bg-[linear-gradient(to_right,#57534e_1px,transparent_1px),linear-gradient(to_bottom,#57534e_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-15 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <p style={{ color: "#1EA8D4", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textAlign: "center", marginBottom: "0.6rem" }}>
        {displayEyebrow}
      </p>
      <h2
        className="z-20 mx-auto max-w-2xl text-center py-2"
        style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 800, color: "#f0ede8", letterSpacing: "-0.03em", lineHeight: 1.1 }}
      >
        {displayHeading}<br />
        <span style={{ color: "#1EA8D4" }}>{displayHeadingAccent}</span>
      </h2>
      <p style={{ color: "#8a8070", fontSize: "1rem", textAlign: "center", marginTop: "0.75rem", maxWidth: 440, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
        {displayBody}
      </p>

      {/* Animated photo spread — exact structure from 21st.dev original */}
      <div className="relative mb-8 h-[380px] w-full items-center justify-center lg:flex" style={{ marginTop: "3rem" }}>
        <motion.div
          className="relative mx-auto flex w-full max-w-7xl justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="relative flex w-full justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <div className="relative h-[260px] w-[260px]">
              {[...displayPhotos].reverse().map((photo) => (
                <motion.div
                  key={photo.id}
                  className="absolute left-0 top-0"
                  style={{ zIndex: photo.zIndex }}
                  variants={photoVariants}
                  custom={{ x: photo.x, y: photo.y, order: photo.order }}
                >
                  <Photo
                    width={260}
                    height={260}
                    src={photo.src}
                    alt={photo.alt}
                    direction={photo.direction}
                    label={photo.label}
                    sub={photo.sub}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* CTAs — shown only for Nassau defaults and when hideCta is false */}
      {!hideCta && isNassauDefaults && (
        <div className="flex w-full justify-center gap-4 flex-wrap items-center">
          <a
            href="https://app.hopbahamas.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: "0.875rem 1.75rem", fontSize: "0.925rem", gap: "0.5rem", textDecoration: "none" }}
          >
            Book your ride
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
          <a href="/routes" style={{ color: "#1EA8D4", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            See all routes
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1EA8D4" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      )}
    </div>
  );
}
