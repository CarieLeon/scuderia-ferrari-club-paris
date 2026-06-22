"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

type Tag =
  | "div"
  | "section"
  | "article"
  | "span"
  | "ul"
  | "li"
  | "header"
  | "figure"
  | "p";

const offset = 40;

function getVariants(direction: Direction): Variants {
  const from: Record<Direction, { x?: number; y?: number }> = {
    up: { y: offset },
    down: { y: -offset },
    left: { x: offset },
    right: { x: -offset },
    none: {},
  };
  return {
    hidden: { opacity: 0, ...from[direction] },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Reveal direction. Default "up". */
  direction?: Direction;
  /** Delay in seconds. */
  delay?: number;
  /** Duration in seconds. Default 0.7. */
  duration?: number;
  as?: Tag;
  /** Re-run the animation each time it scrolls into view. Default false. */
  repeat?: boolean;
};

/**
 * Scroll-triggered slide-up + fade reveal. The signature building block for the
 * site's scroll choreography.
 */
export default function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.7,
  as = "div",
  repeat = false,
}: RevealProps) {
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      variants={getVariants(direction)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !repeat, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
