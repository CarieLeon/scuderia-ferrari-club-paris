"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
};

/**
 * Counts up from 0 to `value` the first time it scrolls into view.
 */
export default function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {display.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}
