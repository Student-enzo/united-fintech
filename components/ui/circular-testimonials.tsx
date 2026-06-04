"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}
interface Colors {
  name?: string;
  designation?: string;
  testimony?: string;
  arrowBackground?: string;
  arrowForeground?: string;
  arrowHoverBackground?: string;
}
interface FontSizes {
  name?: string;
  designation?: string;
  quote?: string;
}
interface CircularTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  colors?: Colors;
  fontSizes?: FontSizes;
}

function calculateGap(width: number) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth) return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const CircularTestimonials = ({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {},
}: CircularTestimonialsProps) => {
  const colorName = colors.name ?? "#f0ede8";
  const colorDesignation = colors.designation ?? "#8a8070";
  const colorTestimony = colors.testimony ?? "rgba(240,237,232,0.8)";
  const colorArrowBg = colors.arrowBackground ?? "#141821";
  const colorArrowFg = colors.arrowForeground ?? "#f0ede8";
  const colorArrowHoverBg = colors.arrowHoverBackground ?? "#2BB8E6";
  const fontSizeName = fontSizes.name ?? "1.4rem";
  const fontSizeDesignation = fontSizes.designation ?? "0.85rem";
  const fontSizeQuote = fontSizes.quote ?? "1.05rem";

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const testimonialsLength = useMemo(() => testimonials.length, [testimonials]);
  const activeTestimonial = useMemo(() => testimonials[activeIndex], [activeIndex, testimonials]);

  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) setContainerWidth(imageContainerRef.current.offsetWidth);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (autoplay) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonialsLength);
      }, 5000);
    }
    return () => { if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current); };
  }, [autoplay, testimonialsLength]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonialsLength) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handlePrev, handleNext]);

  function getImageStyle(index: number): React.CSSProperties {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + testimonialsLength) % testimonialsLength === index;
    const isRight = (activeIndex + 1) % testimonialsLength === index;
    if (isActive) {
      return {
        zIndex: 3, opacity: 1, pointerEvents: "auto",
        transform: "translateX(0px) translateY(0px) scale(1) rotateY(0deg)",
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isLeft) {
      return {
        zIndex: 2, opacity: 1, pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isRight) {
      return {
        zIndex: 2, opacity: 1, pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    return { zIndex: 1, opacity: 0, pointerEvents: "none", transition: "all 0.8s cubic-bezier(.4,2,.3,1)" };
  }

  const quoteVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div style={{ width: "100%", maxWidth: "56rem", padding: "2rem" }}>
      <div
        style={{
          display: "grid",
          gap: "5rem",
          gridTemplateColumns: "1fr",
        }}
        className="md:grid-cols-2"
      >
        {/* Images */}
        <div
          ref={imageContainerRef}
          style={{ position: "relative", width: "100%", height: "24rem", perspective: 1000 }}
        >
          {testimonials.map((testimonial, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={testimonial.src}
              src={testimonial.src}
              alt={testimonial.name}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "1.5rem",
                boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                ...getImageStyle(index),
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={quoteVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h3 style={{ color: colorName, fontSize: fontSizeName, fontWeight: 800, marginBottom: "0.25rem", letterSpacing: "-0.02em" }}>
                {activeTestimonial.name}
              </h3>
              <p style={{ color: colorDesignation, fontSize: fontSizeDesignation, marginBottom: "1.75rem", fontWeight: 500 }}>
                {activeTestimonial.designation}
              </p>
              <motion.p style={{ color: colorTestimony, fontSize: fontSizeQuote, lineHeight: 1.75 }}>
                {activeTestimonial.quote.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut", delay: 0.025 * i }}
                    style={{ display: "inline-block" }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div style={{ display: "flex", gap: "1rem", paddingTop: "2.5rem" }}>
            <button
              onClick={handlePrev}
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              aria-label="Previous testimonial"
              style={{
                width: 48, height: 48, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)",
                backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg,
                transition: "background-color 0.25s, border-color 0.25s",
              }}
            >
              <FaArrowLeft size={16} color={hoverPrev ? "#0A0C12" : colorArrowFg} />
            </button>
            <button
              onClick={handleNext}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              aria-label="Next testimonial"
              style={{
                width: 48, height: 48, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)",
                backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg,
                transition: "background-color 0.25s, border-color 0.25s",
              }}
            >
              <FaArrowRight size={16} color={hoverNext ? "#0A0C12" : colorArrowFg} />
            </button>

            {/* Dot indicators */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginLeft: "0.5rem" }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveIndex(i); if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current); }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  style={{
                    width: i === activeIndex ? 20 : 6,
                    height: 6,
                    borderRadius: 999,
                    backgroundColor: i === activeIndex ? "#2BB8E6" : "rgba(255,255,255,0.2)",
                    border: "none", cursor: "pointer", padding: 0,
                    transition: "width 0.3s, background-color 0.3s",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularTestimonials;
