"use client"

import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import {
  HTMLMotionProps,
  MotionValue,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  cubicBezier,
} from "framer-motion"
import { cn } from "@/lib/utils"

const cardVariants = cva("absolute will-change-transform", {
  variants: {
    variant: {
      dark: "flex size-full flex-col items-center justify-center gap-6 rounded-2xl border border-white/10 bg-[#141821]/90 p-6 backdrop-blur-md",
      light: "flex size-full flex-col items-center justify-center gap-6 rounded-2xl border border-black/[0.08] bg-white/80 p-6 backdrop-blur-md",
    },
  },
  defaultVariants: { variant: "dark" },
})

interface CardStickyProps
  extends HTMLMotionProps<"div">,
    VariantProps<typeof cardVariants> {
  arrayLength: number
  index: number
  incrementY?: number
  incrementZ?: number
  incrementRotation?: number
}

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>
}

const ContainerScrollContext = React.createContext<
  ContainerScrollContextValue | undefined
>(undefined)

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext)
  if (!context) throw new Error("Must be inside ContainerScroll")
  return context
}

export const ContainerScroll: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  style,
  className,
  ...props
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start center", "end end"],
  })

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative min-h-svh w-full", className)}
        style={{ perspective: "1000px", ...style }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  )
}
ContainerScroll.displayName = "ContainerScroll"

export const CardsContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={cn("relative", className)}
    style={{ perspective: "1000px", ...props.style }}
    {...props}
  >
    {children}
  </div>
)
CardsContainer.displayName = "CardsContainer"

export const CardTransformed = React.forwardRef<HTMLDivElement, CardStickyProps>(
  (
    {
      arrayLength,
      index,
      incrementY = 10,
      incrementZ = 10,
      incrementRotation,
      className,
      variant,
      style,
      ...props
    },
    ref
  ) => {
    const rotation = incrementRotation ?? (-index + 90)
    const { scrollYProgress } = useContainerScrollContext()

    const start = index / (arrayLength + 1)
    const end = (index + 1) / (arrayLength + 1)
    const range = React.useMemo(() => [start, end], [start, end])
    const rotateRange = [range[0] - 1.5, range[1] / 1.5]

    const ease = cubicBezier(0.25, 0.46, 0.45, 0.94)
    const y = useTransform(scrollYProgress, range, ["0%", "-180%"], { ease })
    const rotate = useTransform(scrollYProgress, rotateRange, [rotation, 0], { ease })
    const transform = useMotionTemplate`translateZ(${index * incrementZ}px) translateY(${y}) rotate(${rotate}deg)`

    const dx = useTransform(scrollYProgress, rotateRange, [4, 0])
    const dy = useTransform(scrollYProgress, rotateRange, [4, 12])
    const blur = useTransform(scrollYProgress, rotateRange, [2, 24])
    const alpha = useTransform(scrollYProgress, rotateRange, [0.15, 0.2])
    const shadowFilter = useMotionTemplate`drop-shadow(${dx}px ${dy}px ${blur}px rgba(0,0,0,${alpha}))`
    const filter = variant === "light" ? shadowFilter : "none"

    return (
      <motion.div
        layout="position"
        ref={ref}
        style={{
          top: index * incrementY,
          transform,
          backfaceVisibility: "hidden",
          zIndex: (arrayLength - index) * incrementZ,
          filter,
          ...style,
        }}
        className={cn(cardVariants({ variant, className }))}
        {...props}
      />
    )
  }
)
CardTransformed.displayName = "CardTransformed"
